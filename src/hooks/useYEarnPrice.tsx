import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import { useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import debounce from 'lodash.debounce';
import { JsonRpcProvider } from '@ethersproject/providers';

import yVaultAbi from '../constants/abis/Yearn.json';
import { ChainId, DEV_MULTICALL_CHAIN_ID } from '../constants';
import BaseTokenType, { PureBaseTokenTypeKeys } from '../constants/termInfo/baseTokenType';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import YEARN_VAULT from '../constants/yEarnVault';
import { Web3Context } from '../context/Web3Context';

export type YearnTokenPriceType = {
  [baseTokenType in BaseTokenType]?: BigNumber;
};

export default function useYEarnPrice(chainId: ChainId): {
  yearnTokenPrices: YearnTokenPriceType;
} {
  const web3Controller = useContext(Web3Context);
  const { blockNumber, connecting } = web3Controller;
  const [yearnTokenPrices, setYearnTokenPrices] = useState<YearnTokenPriceType>({});

  const fetchYEarnPriceMulticall = async (ethcallProvider: MulticallProvider) => {
    if (ethcallProvider) {
      const baseTokeArray = PureBaseTokenTypeKeys;
      const contractList = baseTokeArray.map((baseTokenType) => {
        const yVaultContractAddress: string | undefined =
          YEARN_VAULT[chainId as ChainId]?.[
            BASE_TOKEN_DATA[baseTokenType as BaseTokenType]?.address[chainId as ChainId]
          ];
        return new MulticallContract(yVaultContractAddress, yVaultAbi);
      });
      let formattedYearnTokenPrices: YearnTokenPriceType = {};
      try {
        const requestArray = contractList.map((vaultContract) => vaultContract.pricePerShare());
        const vTokenPriceData = await ethcallProvider.all(requestArray);

        for (let i = 0; i < vTokenPriceData.length; i++) {
          formattedYearnTokenPrices[baseTokeArray[i] as BaseTokenType] = vTokenPriceData[i];
        }

        setYearnTokenPrices(formattedYearnTokenPrices);
      } catch (e) {
        console.log(e);
        console.log('fetch yEarn Price error');
        setYearnTokenPrices(formattedYearnTokenPrices);
      }
    }
  };

  const fetchYEarnPrice = async () => {
    if (!connecting) {
      try {
        let localProvider;
        if (chainId === ChainId.FORK_MAIN_NET) {
          let providerUrl = process.env.REACT_APP_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (chainId === ChainId.POLYGON) {
          let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (chainId === ChainId.FANTOM) {
          let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else {
          return;
        }
        const multicallChainId =
          chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : chainId;
        const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
        fetchYEarnPriceMulticall(ethcallProvider);
      } catch (e) {
        console.log(e);
        console.log('fetch igain base info error.');
      }
    }
  };

  const debouncedFetchYEarnPrice = useMemo(() => debounce(fetchYEarnPrice, 200), [fetchYEarnPrice]);

  useEffect(() => {
    debouncedFetchYEarnPrice();
  }, [connecting, blockNumber]);

  return { yearnTokenPrices };
}
