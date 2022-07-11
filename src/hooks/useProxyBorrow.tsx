import React, { useState, useCallback, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box, Button, Flex, Text } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';
import { getEtherscanLink, shortenTxId, isAddress } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { BlockInteractionState } from '../constants/blockActionStatus';
import IGAIN_AAVE_BORROW_PROXY from '../constants/abis/IGainAAVEBorrowProxy.json';
import AGGREGATED_AAVE_PROXY from '../constants/abis/AAVEProxy.json';
import { LoadingModalContext } from '../context/LoadingModalContext';
import IGainIrsTermConfig from '../constants/termInfo/iGainIrsTermConfig';
import { AAVE_V3_ADDRESS } from '../constants';

const callProxyBorrow = (
  borrowAmount: BigNumber,
  borrowingBaseTokenAmount: BigNumber,
  minTokenAmount: BigNumber,
  signer: any,
  termParams: IGainIrsTermConfig,
): Promise<any> => {
  const aggregatedProxyAddress = termParams?.terms[0]?.aggregatedProxy;

  if (!aggregatedProxyAddress) {
    const borrowContractAddress = termParams?.terms[0]?.borrowProxyAddress;
    if (!borrowContractAddress) {
      return Promise.resolve();
    }
    const igainAbi = IGAIN_AAVE_BORROW_PROXY;
    const igainProxyContract = new Contract(borrowContractAddress, igainAbi, signer);
    return igainProxyContract.borrow(borrowAmount, borrowingBaseTokenAmount, minTokenAmount);
  }

  const contractAddress = termParams?.terms[0]?.contractAddress;
  if (!termParams?.chainId || !contractAddress) {
    return Promise.resolve();
  }

  const aggregatedProxyContract = new Contract(aggregatedProxyAddress, AGGREGATED_AAVE_PROXY, signer);
  return aggregatedProxyContract.fixedBorrow(
    contractAddress,
    termParams.baseTokenAddress,
    AAVE_V3_ADDRESS[termParams?.chainId],
    borrowAmount,
    borrowingBaseTokenAmount,
    minTokenAmount,
  );
};

export default function useProxyBorrow(
  termParams: IGainIrsTermConfig | undefined,
  web3Controller: IWeb3Controller,
  borrowAmount: BigNumber,
  borrowingBaseTokenAmount: BigNumber,
  minTokenAmount: BigNumber,
): { borrowState: BlockInteractionState; borrow: () => Promise<void> } {
  const { web3Provider, chainId } = web3Controller;
  const contractAddress = termParams?.terms[0]?.contractAddress;
  const { onLoadingModalOpen, onLoadingModalClose } = useContext(LoadingModalContext);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const borrowState: BlockInteractionState = useMemo(() => {
    return transactionSuccess
      ? BlockInteractionState.SUCCESS
      : currentTransaction
      ? BlockInteractionState.PENDING
      : BlockInteractionState.READY;
  }, [transactionSuccess, currentTransaction]);

  const borrow = useCallback(async (): Promise<void> => {
    setTransactionSuccess(false);
    if (!web3Provider || !contractAddress || !isAddress(contractAddress)) {
      console.error('no provider or contractAddress');
      return;
    }
    onLoadingModalOpen();
    const signer = await web3Provider.getSigner();

    try {
      const tx = await callProxyBorrow(borrowAmount, borrowingBaseTokenAmount, minTokenAmount, signer, termParams);
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
      toast.success('Successfully Borrowed!');
      toast(
        <Box>
          <HStack spacing='0.5rem' align='center' justify='space-between' fontWeight='bold'>
            <Box as='span'>
              <Text p='14px'>View your balance on the portfolio page</Text>
              <Flex justifyContent='flex-end'>
                <Button as={ReachLink} size='sm' variant='secondary' to={INTERNAL_PATH.PORTFOLIO}>
                  <Text pr='13px'>Go to Portfolio</Text>
                  <IconArrowRight width='14px' height='11px' />
                </Button>
              </Flex>
            </Box>
          </HStack>
        </Box>,
      );
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
  }, [chainId, contractAddress, web3Provider, borrowAmount, borrowingBaseTokenAmount, minTokenAmount]);

  return { borrowState, borrow };
}
