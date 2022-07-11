import { useEffect, useRef, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Zero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';

import { IWeb3Controller } from '../constants/web3ContextConstants';
import ERC20_ABI from '../constants/abis/erc20.json';

function useTokenAllowance(
  tokenAddress: string,
  account: string,
  tokenSpender: string,
  web3Controller: IWeb3Controller,
): BigNumber {
  const { web3Provider, blockNumber } = web3Controller;
  const [tokenAllowance, setTokenAllowance] = useState<BigNumber>(Zero);
  const prevAddress = useRef('');

  const getTokenAllowance = async (ownerAccount: string, passWeb3Provider: Web3Provider) => {
    try {
      let tokenContract = null;
      tokenContract = new Contract(tokenAddress, ERC20_ABI, passWeb3Provider);
      const allowance = await tokenContract.allowance(ownerAccount, tokenSpender);
      setTokenAllowance(allowance);
    } catch (e) {
      console.error('Failed to allowance', e);
    }
  };

  useEffect(() => {
    if (account && web3Provider && tokenSpender && tokenAddress) {
      getTokenAllowance(account, web3Provider);
    }
  }, [account, web3Provider, blockNumber, tokenSpender, tokenAddress]);

  useEffect(() => {
    if (tokenAddress && tokenAddress !== prevAddress.current) {
      prevAddress.current = tokenAddress;
      setTokenAllowance(Zero);
    }
  }, [tokenAddress]);

  return tokenAllowance;
}

export default useTokenAllowance;
