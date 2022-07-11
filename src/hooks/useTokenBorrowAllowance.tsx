import { useEffect, useRef, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Zero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';

import { IWeb3Controller } from '../constants/web3ContextConstants';
import DEBT_TOKEN_ABI from '../constants/abis/DebtTokenBase.json';

function useTokenBorrowAllowance(
  tokenAddress: string,
  account: string,
  tokenSpender: string,
  web3Controller: IWeb3Controller,
): BigNumber {
  const { web3Provider, blockNumber } = web3Controller;
  const [borrowAllowance, setBorrowAllowance] = useState<BigNumber>(Zero);
  const prevAddress = useRef('');

  const fetchBorrowAllowance = async (ownerAccount: string, passWeb3Provider: Web3Provider) => {
    try {
      let tokenContract = new Contract(tokenAddress, DEBT_TOKEN_ABI, passWeb3Provider);
      const allowance = await tokenContract.borrowAllowance(ownerAccount, tokenSpender);
      setBorrowAllowance(allowance);
    } catch (e) {
      console.error('Failed to borrowAllowance', e);
    }
  };

  useEffect(() => {
    if (account && web3Provider && tokenSpender && tokenAddress) {
      fetchBorrowAllowance(account, web3Provider);
    }
  }, [account, web3Provider, blockNumber, tokenSpender, tokenAddress]);

  useEffect(() => {
    if (tokenAddress && tokenAddress !== prevAddress.current) {
      prevAddress.current = tokenAddress;
      setBorrowAllowance(Zero);
    }
  }, [tokenAddress]);

  return borrowAllowance;
}

export default useTokenBorrowAllowance;
