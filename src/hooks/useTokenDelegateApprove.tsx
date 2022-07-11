import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box } from '@chakra-ui/react';
import { Zero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { toast } from 'react-toastify';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';

import useTokenBorrowAllowance from './useTokenBorrowAllowance';
import { getEtherscanLink, shortenTxId } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import DEBT_TOKEN_ABI from '../constants/abis/DebtTokenBase.json';
import {
  ApprovalInteractionState,
  BlockInteractionState,
  ExtraApprovalInteractionState,
} from '../constants/blockActionStatus';

export default function useTokenDelegateApprove(
  tokenAddress: string,
  spender: string,
  requiredAllowance: BigNumber,
  web3Controller: IWeb3Controller,
): { delegationApprovalState: ApprovalInteractionState; approveDelegation: () => Promise<void> } {
  const { web3Provider, account, chainId } = web3Controller;
  const currentAllowance = useTokenBorrowAllowance(tokenAddress, account, spender, web3Controller);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionSucceeded, setTransactionSucceeded] = useState(false);
  const prevAddress = useRef('');

  const delegationApprovalState: ApprovalInteractionState = useMemo(() => {
    if (!spender) return BlockInteractionState.READY;
    if (!tokenAddress) return ExtraApprovalInteractionState.APPROVED; // no need to approve
    if (!currentAllowance) return BlockInteractionState.READY;
    if (transactionSucceeded) {
      return ExtraApprovalInteractionState.APPROVED;
    }

    return (requiredAllowance && currentAllowance.lt(requiredAllowance)) || currentAllowance.eq(Zero)
      ? currentTransaction
        ? BlockInteractionState.PENDING
        : ExtraApprovalInteractionState.NOT_APPROVED
      : ExtraApprovalInteractionState.APPROVED;
  }, [currentTransaction, tokenAddress, requiredAllowance, currentAllowance, spender]);

  useEffect(() => {
    if (tokenAddress !== prevAddress.current) {
      prevAddress.current = tokenAddress;
      setTransactionSucceeded(false);
    }
  }, [tokenAddress]);

  const approveDelegation = useCallback(async (): Promise<void> => {
    if (delegationApprovalState !== ExtraApprovalInteractionState.NOT_APPROVED) {
      console.error('approveDelegation was called unnecessarily');
      return;
    }
    if (!tokenAddress) {
      console.error('no token');
      return;
    }
    if (!web3Provider) {
      console.error('no provider');
      return;
    }

    let tokenContract = null;
    try {
      tokenContract = new Contract(tokenAddress, DEBT_TOKEN_ABI, web3Provider.getSigner());
    } catch (error) {
      console.error('tokenContract is null');
      return;
    }

    if (!spender) {
      console.error('no spender');
      return;
    }

    try {
      const tx = await tokenContract.approveDelegation(spender, MaxUint256);
      setCurrentTransaction(tx.hash);
      toast(
        <a target='_blank' href={getEtherscanLink(chainId, tx.hash, 'transaction')} rel='noopener noreferrer'>
          <HStack spacing='0.5rem' align='center' justify='space-between' fontWeight='bold'>
            <Box as='span'>{shortenTxId(tx.hash)}</Box>
            <ExternalLinkIcon size={16} />
          </HStack>
        </a>,
      );
      await tx.wait();
      toast.success('Succeeded!');
      setTransactionSucceeded(true);
    } catch (err) {
      if ('data' in (err as any)) {
        const errorData = (err as any).data;
        toast.error(<div>{JSON.stringify(errorData)}</div>);
      } else {
        const errorMessage = (err as any).message;
        toast.error(<div>{errorMessage}</div>);
      }
    } finally {
      setCurrentTransaction(null);
    }
  }, [delegationApprovalState, chainId, tokenAddress, spender, web3Provider]);

  return { delegationApprovalState, approveDelegation };
}
