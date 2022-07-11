import React, { useState, useCallback, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import { Contract } from '@ethersproject/contracts';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box } from '@chakra-ui/react';
import { getEtherscanLink, shortenTxId, isAddress } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { BlockInteractionState } from '../constants/blockActionStatus';
import REFERRAL_CODE from '../constants/abis/ReferralCode.json';
import { LoadingModalContext } from '../context/LoadingModalContext';
import { REGISTER_REFERRAL_ADDRESS } from '../constants';

export function useSetRegisterReferralCode(web3Controller: IWeb3Controller): {
  registerState: BlockInteractionState;
  register: () => Promise<void>;
} {
  const { web3Provider, chainId } = web3Controller;
  const { onLoadingModalOpen, onLoadingModalClose } = useContext(LoadingModalContext);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const registerState: BlockInteractionState = useMemo(() => {
    return transactionSuccess
      ? BlockInteractionState.SUCCESS
      : currentTransaction
      ? BlockInteractionState.PENDING
      : BlockInteractionState.READY;
  }, [transactionSuccess, currentTransaction]);

  const register = useCallback(async (): Promise<void> => {
    setTransactionSuccess(false);
    const contractAddress = REGISTER_REFERRAL_ADDRESS[chainId];
    if (!web3Provider || !contractAddress || !isAddress(contractAddress)) {
      console.error('no provider or contractAddress');
      return;
    }
    onLoadingModalOpen();
    const signer = await web3Provider.getSigner();
    const referralAbi = REFERRAL_CODE;
    const referralContract = new Contract(contractAddress, referralAbi, signer);

    try {
      const tx = await referralContract.set();
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
      toast.success('Successfully set referral code!');
      setTransactionSuccess(true);
    } catch (err) {
      if ('data' in (err as any)) {
        const errorData = (err as any).data;
        console.log(errorData);
        toast.error(<div>{JSON.stringify(errorData)}</div>);
      } else {
        const errorMessage = (err as any).message;
        console.log(errorMessage);
        toast.error(<div>{errorMessage}</div>);
      }
    } finally {
      setCurrentTransaction(null);
      onLoadingModalClose();
    }
  }, [chainId, web3Provider]);

  return { registerState, register };
}
