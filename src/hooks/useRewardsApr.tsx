import { useEffect, useMemo, useState } from 'react';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import FARM_ABI from '../constants/abis/RewardFarm.json';
import debounce from 'lodash.debounce';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero, WeiPerEther } from '@ethersproject/constants';
import { ChainId, YEAR_SECONDS, DEV_MULTICALL_CHAIN_ID } from '../constants';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';
import { TermConfigType } from '../constants/termInfo/iGainIrsTermConfig';
import { JsonFragment } from '@ethersproject/abi';
import { getTargetAbi } from '../utils/web3Utils';
import { parseUnits } from 'ethers/lib/utils';
import { CoinGeckoApiId } from '../constants/tokenPriceKey';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import BaseTokenType from '../constants/termInfo/baseTokenType';

const SECONDS_IN_YEAR = BigNumber.from(YEAR_SECONDS.toString());

export function useRewardsApr(
  targetPairsData: IGainIrsTermParams[] | undefined,
  tokenPrices: { [key: string]: { usd: number } },
  web3Controller: IWeb3Controller,
  expiredTermAddress?: string[],
): BigNumber[] | undefined {
  const { web3Provider, blockNumber, connecting } = web3Controller;
  const [IGainFarmsInfo, setFarmsInfo] = useState<BigNumber[]>();

  const fetchMultiCall = async (
    ethcallProvider: MulticallProvider,
    igainAbi: JsonFragment[],
    terms: TermConfigType[],
    baseTokenType: BaseTokenType,
  ) => {
    const now = Math.round(Date.now() / 1000);
    const farmsData = await Promise.all(
      terms.map((term) => {
        if (!term.farmAddress || expiredTermAddress?.includes(term.contractAddress)) {
          return [];
        }
        const farmContract = new MulticallContract(term.farmAddress, FARM_ABI);
        const igainContract = new MulticallContract(term.contractAddress, igainAbi);

        const multicallPromise = [
          farmContract.totalSupply(),
          farmContract.rewardRate(),
          farmContract.periodFinish(),
          igainContract.poolA(),
          igainContract.poolB(),
          igainContract.totalSupply(),
          igainContract.decimals(),
        ];

        return ethcallProvider.all(multicallPromise);
      }),
    );

    const formattedRoundsData = farmsData.map((data, index) => {
      if (!terms[index].farmAddress || data.length === 0) {
        return Zero;
      }
      const [farmTotalSupply, rewardRate, periodFinish, poolA, poolB, lpTotalSupply, decimals] = data;
      const decimalBNUnit = parseUnits('1', decimals);

      const perLpPrice = poolA
        .mul(poolB)
        .mul(BigNumber.from(2))
        .div(poolA.add(poolB))
        .mul(decimalBNUnit)
        .div(lpTotalSupply);

      const stakedTotalValue = perLpPrice
        .mul(farmTotalSupply.isZero() ? decimalBNUnit : farmTotalSupply)
        .div(decimalBNUnit);
      if (periodFinish.lt(now)) {
        return Zero;
      }

      const baseTokenId = BASE_TOKEN_DATA[baseTokenType].coinGeckoApiId;
      const tokenPriceMultiplier = parseUnits((tokenPrices[baseTokenId]?.usd || 1).toFixed(4), decimals);

      const yearlyUsdRewards = rewardRate
        .mul(SECONDS_IN_YEAR)
        .mul(parseUnits(tokenPrices[CoinGeckoApiId.HAKKA]?.usd.toString()))
        .div(WeiPerEther);

      return yearlyUsdRewards
        .mul(100)
        .mul(decimalBNUnit)
        .div(stakedTotalValue.mul(tokenPriceMultiplier).div(decimalBNUnit));
    });

    return formattedRoundsData as BigNumber[];
  };

  const fetchIGainTermsInfo = async (provider?: Provider, termsData?: IGainIrsTermParams[]) => {
    if (termsData && !connecting) {
      try {
        const fetchPromise = termsData.map((termData) => {
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
          const multicallChainId =
            termData.chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID
              ? DEV_MULTICALL_CHAIN_ID
              : termData.chainId;
          const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
          const formatedRoundsDataPromise = fetchMultiCall(
            ethcallProvider,
            getTargetAbi(termData.protocolType),
            termData.terms,
            termData.baseTokenType,
          );
          return formatedRoundsDataPromise;
        });
        let combinedRoundsData = await Promise.all(fetchPromise);
        setFarmsInfo(combinedRoundsData.reduce((acc, val) => (acc ? acc.concat(val || []) : []), []));
      } catch (e) {
        console.log(e);
        console.log('fetch farm error.');
      }
    }
  };

  const debouncedFetchIGainTermsInfo = useMemo(() => debounce(fetchIGainTermsInfo, 200), [fetchIGainTermsInfo]);

  useEffect(() => {
    if (tokenPrices[CoinGeckoApiId.HAKKA]?.usd > 0) {
      debouncedFetchIGainTermsInfo(web3Provider as Provider, targetPairsData);
    }
  }, [web3Provider, blockNumber, tokenPrices, targetPairsData]);

  return IGainFarmsInfo;
}

export default function useRewardApr(
  targetTermData: IGainIrsTermParams | undefined,
  tokenPrices: { [key: string]: { usd: number } },
  web3Controller: IWeb3Controller,
): BigNumber | undefined {
  const memoTargetPairsData = useMemo(() => targetTermData && [targetTermData], [targetTermData]);
  return useRewardsApr(memoTargetPairsData, tokenPrices, web3Controller)?.[0];
}
