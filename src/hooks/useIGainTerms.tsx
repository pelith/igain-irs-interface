import { useEffect, useMemo, useContext, useState, useRef } from 'react';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import flatten from 'lodash.flatten';
import chunk from 'lodash.chunk';
import debounce from 'lodash.debounce';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Web3Context } from '../context/Web3Context';
import { TermsContext } from '../context/TermsContext';
import ERC20_ABI from '../constants/abis/erc20.json';
import { ChainId, DEV_MULTICALL_CHAIN_ID } from '../constants';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { getTargetAbi } from '../utils/web3Utils';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import ProtocolType from '../constants/termInfo/protocolType';
import { getYvTokenAddressByType } from '../constants/termInfo/yvTokenConfig';

export function useIGainTermsInfo(targetPairsData: IGainIrsTermParams[] | undefined): IGainTerm[] | undefined {
  const web3Controller = useContext(Web3Context);
  const { blockNumber, connecting } = web3Controller;
  const prevChainId = useRef(targetPairsData?.[0].chainId);
  const [IGainTermsInfo, setTermsInfo] = useState<IGainTerm[]>();

  const fetchMultiCall = async (ethcallProvider: MulticallProvider, termParamData: IGainIrsTermParams) => {
    const igainAbi = getTargetAbi(termParamData.protocolType);
    const terms = termParamData.terms;
    const baseTokenAddress =
      termParamData.protocolType === ProtocolType.YEARN
        ? getYvTokenAddressByType(termParamData.chainId, termParamData.baseTokenType)
        : termParamData.baseTokenAddress;
    const termCalls = terms.map((term) => {
      const igainContract = new MulticallContract(term.contractAddress, igainAbi);
      const baseTokenContract = new MulticallContract(baseTokenAddress, ERC20_ABI);
      return [
        igainContract.openTime(),
        igainContract.closeTime(),
        igainContract.initialRate(),
        igainContract.leverage(),
        igainContract.protocolFee(),
        igainContract.poolA(),
        igainContract.poolB(),
        igainContract.bPrice(),
        igainContract.fee(),
        igainContract.totalSupply(),
        igainContract.decimals(),
        igainContract.canBuy(),
        baseTokenContract.balanceOf(term.contractAddress),
      ];
    });
    const falttenCalls = flatten(termCalls);
    const termsData = chunk(await ethcallProvider.all(falttenCalls), 13);
    const formattedRoundsData = termsData.map((data, index) => {
      const decimals = data[10];

      return {
        address: terms[index].contractAddress,
        tradeBaseTokenType: termParamData.baseTokenType,
        protocolType: termParamData.protocolType,
        openTime: parseInt(data[0].toString() || '0'),
        closeTime: parseInt(data[1].toString() || '0'),
        initialRate: data[2],
        leverage: data[3],
        protocolFee: decimals === 18 ? data[4] : parseUnits(formatUnits(data[4]).substring(0, decimals), decimals),
        poolA: data[5],
        poolB: data[6],
        bPrice: data[7],
        fee: decimals === 18 ? data[8] : parseUnits(formatUnits(data[8]).substring(0, decimals), decimals),
        lpTotalSupply: (data[9] as BigNumber).sub(BigNumber.from(1000)),
        decimals,
        canBuy: data[11],
        termBaseTokenBalance: data[12] || null,
        tradeBaseTokenAddress: termParamData.baseTokenAddress,
        farmAddress: terms[index].farmAddress,
      };
    });

    return formattedRoundsData as IGainTerm[];
  };

  const fetchIGainTermsInfo = async (termParamsData?: IGainIrsTermParams[]) => {
    if (termParamsData && !connecting) {
      try {
        const fetchPromise = termParamsData.map((termParamData) => {
          let localProvider;
          if (termParamData.chainId === ChainId.FORK_MAIN_NET) {
            let providerUrl = process.env.REACT_APP_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else if (termParamData.chainId === ChainId.POLYGON) {
            let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else if (termParamData.chainId === ChainId.FANTOM) {
            let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else {
            return;
          }
          const multicallChainId =
            termParamData.chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID
              ? DEV_MULTICALL_CHAIN_ID
              : termParamData.chainId;
          const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
          const formatedRoundsDataPromise = fetchMultiCall(ethcallProvider, termParamData);
          return formatedRoundsDataPromise;
        });
        let combinedRoundsData = await Promise.all(fetchPromise);
        setTermsInfo(combinedRoundsData.reduce((acc, val) => (acc ? acc.concat(val || []) : []), []));
      } catch (e) {
        console.log(e);
        console.log('fetch igain error.');
      }
    }
  };

  const debouncedFetchIGainTermsInfo = useMemo(() => debounce(fetchIGainTermsInfo, 200), [fetchIGainTermsInfo]);

  useEffect(() => {
    if (prevChainId.current !== targetPairsData?.[0].chainId) {
      prevChainId.current = targetPairsData?.[0].chainId;
      setTermsInfo(undefined);
    }
    debouncedFetchIGainTermsInfo(targetPairsData);
  }, [blockNumber, targetPairsData]);

  return IGainTermsInfo;
}

export function useSelectedIGainTermsInfo(selectedTermsData: IGainIrsTermParams[]): IGainTerm[] {
  const { iGainTermsInfo } = useContext(TermsContext);
  const memoTargetContract = useMemo(
    () =>
      selectedTermsData
        ? flatten(flatten(selectedTermsData.map((params) => params.terms.map((term) => term.contractAddress))))
        : undefined,
    [selectedTermsData],
  );

  return iGainTermsInfo?.filter((termConfig) => memoTargetContract?.includes(termConfig.address)) || [];
}

export default function useSelectedIGainTermInfo(
  targetTermData: IGainIrsTermParams | undefined,
): IGainTerm | undefined {
  const { iGainTermsInfo } = useContext(TermsContext);
  const memoTargetContract = useMemo(
    () => (targetTermData ? targetTermData.terms[0].contractAddress : undefined),
    [targetTermData],
  );
  return iGainTermsInfo?.filter((termConfig) => termConfig.address === memoTargetContract)[0];
}
