import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import { useEffect, useMemo, useState, useRef } from 'react';
import flatten from 'lodash.flatten';
import chunk from 'lodash.chunk';
import debounce from 'lodash.debounce';
import { UserInfo } from '../constants/userInfo';
import { Zero } from '@ethersproject/constants';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import IGAIN_AAVE_IRS from '../constants/abis/IGainAAVEIRS.json';
import IGAIN_YEARN_IRS from '../constants/abis/IGainYearnIRS.json';
import REWARD_FARM from '../constants/abis/RewardFarm.json';

import ERC20_ABI from '../constants/abis/erc20.json';
import ProtocolType from '../constants/termInfo/protocolType';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';
import { ChainId, DEV_MULTICALL_CHAIN_ID } from '../constants';
import { TermConfigType } from '../constants/termInfo/iGainIrsTermConfig';

export function useUserInfoForMultipleAddress(
  termsData: IGainIrsTermParams[] | undefined,
  web3Controller: IWeb3Controller,
): UserInfo[] | undefined {
  const { web3Provider, chainId, blockNumber, account, connecting } = web3Controller;
  const [userInfo, setUserInfo] = useState<UserInfo[]>();
  const termRef = useRef(termsData);

  const { terms, igainAbi, protocolTypeArray, baseTokenAddressArray } = useMemo(() => {
    let concatTerms: TermConfigType[] = [];
    termsData?.forEach((proxyData) => {
      concatTerms = concatTerms.concat(proxyData.terms);
    });

    let protocolTypeArr: ProtocolType[] = [];
    termsData?.forEach((proxyData) => {
      const termsLength = proxyData.terms.length;
      for (let i = 0; i < termsLength; i++) {
        protocolTypeArr.push(proxyData.protocolType);
      }
    });

    let baseTokenAddressArr: string[] = [];
    termsData?.forEach((proxyData) => {
      const termsLength = proxyData.terms.length;
      for (let i = 0; i < termsLength; i++) {
        baseTokenAddressArr.push(proxyData.baseTokenAddress);
      }
    });
    return {
      terms: concatTerms,
      igainAbi: termsData?.[0]?.protocolType !== ProtocolType.YEARN ? IGAIN_AAVE_IRS : IGAIN_YEARN_IRS,
      protocolTypeArray: protocolTypeArr,
      baseTokenAddressArray: baseTokenAddressArr,
    };
  }, [termsData]);

  const fetchUserInfo = async () => {
    if (web3Provider && terms && !!termsData?.length) {
      const multicallChainId =
        chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : chainId;
      const ethcallProvider = new MulticallProvider(web3Provider, multicallChainId);
      try {
        const userDataCalls = terms.map((term, index) => {
          const igainContract = new MulticallContract(term.contractAddress, igainAbi);
          const igainLongContract = new MulticallContract(term.longTokenAddress, igainAbi);
          const igainShortContract = new MulticallContract(term.shortTokenAddress, igainAbi);
          const igainFarmContract = new MulticallContract(term.farmAddress || undefined, REWARD_FARM);

          const baseTokenContract = new MulticallContract(baseTokenAddressArray[index], ERC20_ABI);
          const requestArray = [
            igainContract.balanceOf(account),
            igainLongContract.balanceOf(account),
            igainShortContract.balanceOf(account),
            igainContract.decimals(),
            baseTokenContract.balanceOf(account),
            igainFarmContract.balanceOf(account),
          ];
          return requestArray;
        });

        const flattenCalls = flatten(userDataCalls);
        const userData = chunk(await ethcallProvider.all(flattenCalls), 6);

        const formattedUserData = userData.map((data, index) => {
          return {
            address: terms[index].contractAddress,
            protocolType: protocolTypeArray[index],
            lpBalance: data[0],
            longBalance: data[1],
            shortBalance: data[2],
            decimals: data[3],
            baseTokenBalance: data[4],
            farmBalance: data[5] || Zero,
            longContract: terms[index].longTokenAddress,
            shortContract: terms[index].shortTokenAddress,
            farmContract: terms[index].farmAddress,
          };
        });

        if (termRef.current !== termsData) {
          return;
        }

        setUserInfo(formattedUserData);
      } catch (e) {
        console.log(e);
        console.log('fetch User Info error.');
        setUserInfo(undefined);
      }
    }
  };

  const debouncedFetchUserInfo = useMemo(() => debounce(fetchUserInfo, 200), [fetchUserInfo]);

  useEffect(() => {
    if (termRef.current !== termsData) {
      setUserInfo(undefined);
      termRef.current = termsData;
    }
    if (!connecting && web3Provider) {
      debouncedFetchUserInfo();
    }
  }, [web3Provider, blockNumber, termsData, connecting]);

  return userInfo;
}

export default function useUserInfo(
  termsData: IGainIrsTermParams | undefined,
  web3Controller: IWeb3Controller,
): UserInfo[] | undefined {
  const termsDataList = useMemo(() => (termsData ? [termsData] : undefined), [termsData]);
  const info = useUserInfoForMultipleAddress(termsDataList, web3Controller);
  return info;
}
