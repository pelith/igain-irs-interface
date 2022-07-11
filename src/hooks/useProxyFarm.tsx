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
import IGAIN_FARM_PROXY from '../constants/abis/iGainLPProxy.json';
import AGGREGATED_YEARN_PROXY from '../constants/abis/YearnProxy.json';
import AGGREGATED_AAVE_PROXY from '../constants/abis/AAVEProxy.json';
import { LoadingModalContext } from '../context/LoadingModalContext';
import { TermFactoryContext } from '../context/TermFactoryContext';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import IGainIrsTermConfig from '../constants/termInfo/iGainIrsTermConfig';
import { getYvTokenAddressByType } from '../constants/termInfo/yvTokenConfig';
import ProtocolType from '../constants/termInfo/protocolType';

const callDepositFarm = (
  depositAmount: BigNumber,
  minAmount: BigNumber,
  signer: any,
  termParams: IGainIrsTermConfig,
): Promise<any> => {
  const aggregatedProxyAddress = termParams?.terms[0]?.aggregatedProxy;
  const contractAddress = termParams?.terms[0]?.contractAddress;

  if (!aggregatedProxyAddress) {
    const igainAbi = IGAIN_FARM_PROXY;
    const igainProxyContract = new Contract(termParams?.terms[0]?.farmProxy || '', igainAbi, signer);
    return igainProxyContract.deposit(depositAmount, minAmount);
  } else if (termParams?.protocolType === ProtocolType.YEARN) {
    const aggregatedProxyContract = new Contract(aggregatedProxyAddress, AGGREGATED_YEARN_PROXY, signer);
    const yVault = getYvTokenAddressByType(termParams.chainId, termParams.baseTokenType);
    return aggregatedProxyContract.mintLPandFarm(
      contractAddress,
      termParams?.terms[0]?.farmAddress,
      termParams.baseTokenAddress,
      yVault,
      depositAmount,
      minAmount,
    );
  }
  const aggregatedProxyContract = new Contract(aggregatedProxyAddress, AGGREGATED_AAVE_PROXY, signer);
  return aggregatedProxyContract.mintLPandFarm(
    contractAddress,
    termParams?.terms[0]?.farmAddress,
    termParams.baseTokenAddress,
    depositAmount,
    minAmount,
  );
};

export default function useProxyFarm(
  contractAddress: string | undefined,
  web3Controller: IWeb3Controller,
  amount: BigNumber,
  minAmount: string,
): { depositState: BlockInteractionState; deposit: () => Promise<void> } {
  const { web3Provider, chainId } = web3Controller;
  const { onLoadingModalOpen, onLoadingModalClose } = useContext(LoadingModalContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const depositState: BlockInteractionState = useMemo(() => {
    return transactionSuccess
      ? BlockInteractionState.SUCCESS
      : currentTransaction
      ? BlockInteractionState.PENDING
      : BlockInteractionState.READY;
  }, [transactionSuccess, currentTransaction]);

  const deposit = useCallback(async (): Promise<void> => {
    setTransactionSuccess(false);
    if (!web3Provider || !contractAddress || !isAddress(contractAddress)) {
      console.error('no provider or contractAddress');
      return;
    }
    const termParams = getParamsByContractId(contractAddress, chainId, iGainTermBaseInfo);
    if (!termParams || (!termParams?.terms[0]?.farmProxy && !termParams?.terms[0]?.aggregatedProxy)) {
      return;
    }
    onLoadingModalOpen();
    const signer = await web3Provider.getSigner();
    try {
      const parsedMinAmount = BigNumber.from(minAmount);
      const tx = await callDepositFarm(amount, parsedMinAmount, signer, termParams);
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
      toast.success('Successfully Minted and Deposited!');
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
  }, [chainId, contractAddress, web3Provider, amount, minAmount]);

  return { depositState, deposit };
}
