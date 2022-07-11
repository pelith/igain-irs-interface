import { useEffect, useState, useMemo } from 'react';
import { Provider } from '@ethersproject/providers';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';

import { IWeb3Controller } from '../constants/web3ContextConstants';
import ERC20_ABI from '../constants/abis/erc20.json';
import debounce from 'lodash.debounce';
import { ChainId, DEV_MULTICALL_CHAIN_ID } from '../constants';
import arrayToAddressMap from '../utils/arrayToAddressMap';

export function useTokenBalances(
  tokenAddresses: string[],
  accountAddress: string,
  web3Controller: IWeb3Controller,
): BigNumber[] | undefined {
  const { web3Provider, chainId: walletChainId, blockNumber, connecting } = web3Controller;
  const [tokenBalances, setTokenBalances] = useState<BigNumber[]>();

  const fetchMultiCall = async (ethcallProvider: MulticallProvider, addresses: string[], account: string) => {
    const tokensData = await ethcallProvider.all(
      addresses.map((token) => {
        if (token) {
          const tokenContract = new MulticallContract(token, ERC20_ABI);
          return tokenContract.balanceOf(account);
        }
      }),
    );
    return tokensData as BigNumber[];
  };

  const fetchTokenBalances = async (provider?: Provider, addresses?: string[], account?: string) => {
    if (!connecting && provider && walletChainId && addresses && account) {
      try {
        const filteredAddress = addresses.filter((address) => !!address);
        const multicallChainId =
          walletChainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : walletChainId;
        const ethcallProvider = new MulticallProvider(provider, multicallChainId);
        const formattedRoundsData = await fetchMultiCall(ethcallProvider, filteredAddress, account);
        const filterAddressData = filteredAddress.map((address, index) => ({
          address,
          balance: formattedRoundsData[index],
        }));

        const filterAddressDataMap = arrayToAddressMap(filterAddressData);
        setTokenBalances(addresses.map((address) => filterAddressDataMap[address]?.balance || Zero));
        return;
      } catch (e) {
        console.log(e);
        console.log('fetch balance error.');
      }
    }
    setTokenBalances(new Array(tokenAddresses.length).fill(Zero));
  };

  const debouncedFetchTokenBalancesInfo = useMemo(() => debounce(fetchTokenBalances, 200), [fetchTokenBalances]);

  useEffect(() => {
    if (accountAddress) {
      debouncedFetchTokenBalancesInfo(web3Provider as Provider, tokenAddresses, accountAddress);
    }
  }, [web3Provider, blockNumber, tokenAddresses, accountAddress]);

  return tokenBalances;
}

export default function useTokenBalance(
  tokenAddresses: string | undefined,
  accountAddress: string | undefined,
  web3Controller: IWeb3Controller,
): BigNumber | undefined {
  const memoTokenAddresses = useMemo(() => [tokenAddresses || ''], [tokenAddresses]);
  const memoAccountAddress = useMemo(() => accountAddress || '', [accountAddress]);
  return useTokenBalances(memoTokenAddresses, memoAccountAddress, web3Controller)?.[0];
}
