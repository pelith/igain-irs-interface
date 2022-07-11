import { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import {
  ETH_BLOCKS_PER_DAY,
  POLYGON_BLOCKS_PER_DAY,
  DEV_MULTICALL_CHAIN_ID,
  FANTOM_BLOCKS_PER_DAY,
} from '../constants';
import flatten from 'lodash.flatten';
import chunk from 'lodash.chunk';
import debounce from 'lodash.debounce';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { JsonFragment } from '@ethersproject/abi';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { YEarnPriceContext } from '../context//YEarnPriceContext';
import { parseUnits } from 'ethers/lib/utils';
import { ChainId } from '../constants';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';
import { TermConfigType } from '../constants/termInfo/iGainIrsTermConfig';
import { sqrt } from '../utils';
import { getTargetAbi } from '../utils/web3Utils';
import BaseTokenType from '../constants/termInfo/baseTokenType';
import yVaultAbi from '../constants/abis/Yearn.json';
import YEARN_VAULT from '../constants/yEarnVault';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import ITermPoolApy from '../constants/termInfo/termPoolApyInterface';

export function useFeeApys(
  targetPairsData: IGainIrsTermParams[] | undefined,
  web3Controller: IWeb3Controller,
): (BigNumber[] | undefined)[] {
  const { connecting } = web3Controller;
  const { selectedChain } = useContext(SelectedChainContext);
  const yearnTokenPrices = useContext(YEarnPriceContext);
  const [tradeFeeApyList, setTradeFeeApyList] = useState<BigNumber[]>();
  const [protocolTokenApy, setProtocolTokenApyList] = useState<BigNumber[]>();
  const prevChainId = useRef(0);

  const fetchMultiCall = async (
    ethcallProvider: MulticallProvider,
    igainAbi: JsonFragment[],
    terms: TermConfigType[],
    blockTag: number,
    baseTokenType: BaseTokenType,
  ) => {
    let poolsDataCurrent: any[] = [];
    let poolsData7days: any[] = [];

    try {
      const poolsDataCurrentCalls = terms.map((term) => {
        const igainContract = new MulticallContract(term.contractAddress, igainAbi);
        return [igainContract.poolA(), igainContract.poolB(), igainContract.totalSupply(), igainContract.decimals()];
      });
      const poolsDataCurrentFlattenCalls = flatten(poolsDataCurrentCalls);
      poolsDataCurrent = chunk(await ethcallProvider.all(poolsDataCurrentFlattenCalls), 4);

      poolsData7days = await Promise.all(
        terms.map((term) => {
          const igainContract = new MulticallContract(term.contractAddress, igainAbi);
          const yVaultContractAddress: string | undefined =
            YEARN_VAULT[selectedChain as ChainId]?.[
              BASE_TOKEN_DATA[baseTokenType as BaseTokenType]?.address[selectedChain as ChainId]
            ];

          const yVaultContract = new MulticallContract(yVaultContractAddress, yVaultAbi);
          const multicallPromise = [igainContract.poolA(), igainContract.poolB(), igainContract.totalSupply()];
          if (yVaultContractAddress) {
            multicallPromise.push(yVaultContract.pricePerShare());
          }
          return ethcallProvider.all(multicallPromise, blockTag > term.deployBlock ? blockTag : term.deployBlock);
        }),
      );
    } catch (e) {
      console.log(e);
      console.log('fetch 24 hours supply failed');
    }

    const apyList: ITermPoolApy[] = poolsDataCurrent.map((data, index) => {
      const [poolA, poolB, lpTotalSupply, decimals] = data;
      if (!poolA || !poolB || !lpTotalSupply || !poolsData7days[index]) {
        return { feeApy: Zero, protocolTokenPriceApy: Zero };
      }
      const adjustTotalSupply = lpTotalSupply.sub(BigNumber.from(1000));

      if (adjustTotalSupply.isZero()) {
        return { feeApy: Zero, protocolTokenPriceApy: Zero };
      }

      const [poolA7days, poolB7days, lpTotalSupply7days, pricePerShare7days] = poolsData7days[index];

      if (process.env.REACT_APP_ENV === 'development') {
        console.log('poolA:', poolA.toString());
        console.log('poolB:', poolB.toString());
        console.log('lpTotalSupply:', lpTotalSupply.toString());
        console.log('poolA7daysAgo:', poolA7days.toString());
        console.log('poolB7daysAgo:', poolB7days.toString());
        console.log('lpTotalSupply7daysAgo:', lpTotalSupply7days.toString());
        console.log('pricePerShare7days', pricePerShare7days?.toString());
      }
      const PerUnit = parseUnits('1', decimals);
      const k = poolA.mul(poolB);

      const poolStatus = sqrt(k).mul(PerUnit).div(adjustTotalSupply);
      const k7days = poolA7days.mul(poolB7days);
      const poolStatus7days = sqrt(k7days)
        .mul(PerUnit)
        .div(lpTotalSupply7days.isZero() ? PerUnit : lpTotalSupply7days);
      const poolGrowth = poolStatus.mul(PerUnit).div(poolStatus7days.isZero() ? PerUnit : poolStatus7days);

      let protocolTokenPricesGrowth;
      if (yearnTokenPrices && pricePerShare7days) {
        protocolTokenPricesGrowth = yearnTokenPrices[baseTokenType]
          ?.mul(PerUnit)
          .div(pricePerShare7days.isZero() ? PerUnit : pricePerShare7days);
      }

      let protocolTokenPriceApy;
      if (protocolTokenPricesGrowth) {
        protocolTokenPriceApy = protocolTokenPricesGrowth
          .pow(Math.floor(365.25 / 7))
          .div(PerUnit.pow(Math.floor(365.25 / 7) - 1))
          .sub(PerUnit)
          .mul(100);
      } else {
        protocolTokenPriceApy = Zero;
      }

      const feeApy = (protocolTokenPricesGrowth ? protocolTokenPricesGrowth.mul(poolGrowth).div(PerUnit) : poolGrowth)
        .pow(Math.floor(365.25 / 7))
        .div(PerUnit.pow(Math.floor(365.25 / 7) - 1))
        .sub(PerUnit)
        .mul(100);

      return { feeApy, protocolTokenPriceApy };
    });

    return apyList;
  };

  const fetchIGainFeeApys = async (termsData?: IGainIrsTermParams[]) => {
    if (termsData && !connecting) {
      if (prevChainId.current && prevChainId.current != selectedChain) {
        setTradeFeeApyList([]);
        setProtocolTokenApyList([]);
      }
      prevChainId.current = selectedChain;
      try {
        const fetchPromise = termsData.map(async (termData) => {
          let localProvider;
          if (termData.chainId === ChainId.FORK_MAIN_NET) {
            let providerUrl = process.env.REACT_APP_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else if (termData.chainId === ChainId.POLYGON) {
            let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else if (termData.chainId === ChainId.FANTOM) {
            let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else {
            return;
          }
          const currentBlock = await localProvider.getBlockNumber();
          const step =
            termData.chainId === ChainId.POLYGON
              ? POLYGON_BLOCKS_PER_DAY
              : termData.chainId === ChainId.FANTOM
              ? FANTOM_BLOCKS_PER_DAY
              : ETH_BLOCKS_PER_DAY;

          const blockTag =
            termData.chainId === ChainId.FORK_MAIN_NET && process.env.REACT_APP_DEV_START_BLOCK
              ? parseInt(process.env.REACT_APP_DEV_START_BLOCK)
              : currentBlock - step * 7;
          const multicallChainId =
            termData.chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID
              ? DEV_MULTICALL_CHAIN_ID
              : termData.chainId;
          const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
          const formatedRoundsDataPromise = await fetchMultiCall(
            ethcallProvider,
            getTargetAbi(termData.protocolType),
            termData.terms,
            blockTag,
            termData.baseTokenType,
          );
          return formatedRoundsDataPromise;
        });
        const combinedRoundsData = await Promise.all(fetchPromise);
        const flattenAllTermsData = flatten(combinedRoundsData);

        setTradeFeeApyList(flattenAllTermsData.map((termPoolApy) => termPoolApy?.feeApy || Zero));
        setProtocolTokenApyList(flattenAllTermsData.map((termPoolApy) => termPoolApy?.protocolTokenPriceApy || Zero));
      } catch (e) {
        console.log(e);
        console.log('fetch farm and fee error.');
      }
    }
  };

  const debouncedFetchIGainFeeApys = useMemo(() => debounce(fetchIGainFeeApys, 200), [fetchIGainFeeApys]);
  useEffect(() => {
    debouncedFetchIGainFeeApys(targetPairsData);
  }, [targetPairsData, selectedChain]);

  return [tradeFeeApyList, protocolTokenApy];
}

export default function useFeeApy(
  targetTermData: IGainIrsTermParams | undefined,
  web3Controller: IWeb3Controller,
): (BigNumber | undefined)[] {
  const memoTargetPairsData = useMemo(() => targetTermData && [targetTermData], [targetTermData]);
  const roundData = useFeeApys(memoTargetPairsData, web3Controller);
  return [roundData?.[0]?.[0], roundData?.[1]?.[0]];
}
