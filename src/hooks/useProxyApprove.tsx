import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { Zero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';

import useTokenAllowance from './useTokenAllowance';
import { getEtherscanLink, shortenTxId } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
// import AAVE_PROXY_ABI from '../constants/abis/YearnProxy.json'; // should be replaced
import YEARN_PROXY_ABI from '../constants/abis/YearnProxy.json';
import {
  ApprovalInteractionState,
  BlockInteractionState,
  ExtraApprovalInteractionState,
} from '../constants/blockActionStatus';

export default function useProxyApprove(
  tokenAddress: string,
  aggregatedProxyAddress: string | undefined,
  spender: string,
  web3Controller: IWeb3Controller,
): { proxyApprovalState: ApprovalInteractionState; proxyApprove: () => Promise<void> } {
  const { web3Provider, chainId } = web3Controller;
  const currentAllowance = useTokenAllowance(tokenAddress, aggregatedProxyAddress || '', spender, web3Controller);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionSucceeded, setTransactionSucceeded] = useState(false);
  const prevAddress = useRef('');

  const proxyApprovalState: ApprovalInteractionState = useMemo(() => {
    if (!spender) return BlockInteractionState.READY;
    if (!aggregatedProxyAddress) return ExtraApprovalInteractionState.APPROVED;
    if (!tokenAddress) return ExtraApprovalInteractionState.APPROVED; // no need to approve
    if (transactionSucceeded) {
      return ExtraApprovalInteractionState.APPROVED;
    }

    return !currentAllowance.gt(Zero)
      ? currentTransaction
        ? BlockInteractionState.PENDING
        : ExtraApprovalInteractionState.NOT_APPROVED
      : ExtraApprovalInteractionState.APPROVED;
  }, [currentTransaction, tokenAddress, spender, currentAllowance]);

  useEffect(() => {
    if (tokenAddress !== prevAddress.current) {
      prevAddress.current = tokenAddress;
      setTransactionSucceeded(false);
    }
  }, [tokenAddress]);

  const proxyApprove = useCallback(async (): Promise<void> => {
    if (proxyApprovalState !== ExtraApprovalInteractionState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!tokenAddress) {
      console.error('no token');
      return;
    }
    if (!aggregatedProxyAddress) {
      console.error('no aggregatedProxy');
      return;
    }
    if (!web3Provider) {
      console.error('no provider');
      return;
    }

    try {
      const proxyAbi = YEARN_PROXY_ABI; // iGainParams.protocolType === ProtocolType.AAVE ? AAVE_PROXY_ABI : YEARN_PROXY_ABI;
      const proxyContract = new Contract(aggregatedProxyAddress, proxyAbi, web3Provider.getSigner());
      const tx = await proxyContract.approve(tokenAddress, spender);
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
  }, [proxyApprovalState, chainId, tokenAddress, spender, web3Provider]);

  return { proxyApprovalState, proxyApprove };
}
