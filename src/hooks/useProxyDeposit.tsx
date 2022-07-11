import React, { useState, useCallback, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import { BigNumber } from '@ethersproject/bignumber';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box, Button, Flex, Text } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { Interface } from '@ethersproject/abi';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { Web3Provider } from '@ethersproject/providers';
import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';
import { getEtherscanLink, shortenTxId, isAddress } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { BlockInteractionState } from '../constants/blockActionStatus';
import IGAIN_AAVE_LEND_PROXY from '../constants/abis/IGainAAVELendProxy.json';
import AGGREGATED_YEARN_PROXY from '../constants/abis/YearnProxy.json';
import AGGREGATED_AAVE_PROXY from '../constants/abis/AAVEProxy.json';
import { LoadingModalContext } from '../context/LoadingModalContext';
import { ReceivedInviteCodeContext } from '../context/ReceivedInviteCodeContext';
import IGainIrsTermConfig from '../constants/termInfo/iGainIrsTermConfig';
import { getYvTokenAddressByType } from '../constants/termInfo/yvTokenConfig';
import ProtocolType from '../constants/termInfo/protocolType';
import { AAVE_V3_ADDRESS } from '../constants';

const callProxyDeposit = (
  depositAmount: BigNumber,
  requiredBaseTokenAmount: BigNumber,
  minTokenAmount: BigNumber,
  account: string,
  referralCode: string,
  web3Provider: Web3Provider,
  termParams: IGainIrsTermConfig,
): Promise<any> => {
  const aggregatedProxyAddress = termParams?.terms[0]?.aggregatedProxy;
  const contractAddress = termParams?.terms[0]?.contractAddress;

  let callerAddress;
  let functionData;

  if (!aggregatedProxyAddress) {
    const igainProxyInterface = new Interface(IGAIN_AAVE_LEND_PROXY);
    functionData = igainProxyInterface.encodeFunctionData('deposit', [
      depositAmount,
      requiredBaseTokenAmount,
      minTokenAmount,
    ]);

    callerAddress = termParams?.terms[0]?.lendProxyAddress;
  } else if (termParams?.protocolType === ProtocolType.YEARN) {
    const aggregatedProxyInterface = new Interface(AGGREGATED_YEARN_PROXY);
    const yVault = getYvTokenAddressByType(termParams.chainId, termParams.baseTokenType);
    functionData = aggregatedProxyInterface.encodeFunctionData('fixedDeposit', [
      contractAddress,
      termParams.baseTokenAddress,
      yVault,
      depositAmount.sub(requiredBaseTokenAmount),
      requiredBaseTokenAmount,
      minTokenAmount,
    ]);
    callerAddress = aggregatedProxyAddress;
  } else {
    if (!termParams?.chainId) {
      return Promise.resolve();
    }
    const aggregatedProxyInterface = new Interface(AGGREGATED_AAVE_PROXY);
    functionData = aggregatedProxyInterface.encodeFunctionData('fixedDeposit', [
      contractAddress,
      termParams.baseTokenAddress,
      AAVE_V3_ADDRESS[termParams?.chainId],
      depositAmount.sub(requiredBaseTokenAmount),
      requiredBaseTokenAmount,
      minTokenAmount,
    ]);
    callerAddress = aggregatedProxyAddress;
  }

  if (referralCode) {
    const hexRef = hexlify(toUtf8Bytes(referralCode));
    functionData = functionData + hexRef.substring(2);
  }

  const params = [
    {
      from: account,
      to: callerAddress,
      data: functionData,
    },
  ];

  return web3Provider.send('eth_sendTransaction', params);
};

export default function useProxyDeposit(
  termParams: IGainIrsTermConfig | undefined,
  web3Controller: IWeb3Controller,
  depositAmount: BigNumber,
  requiredBaseTokenAmount: BigNumber,
  minTokenAmount: BigNumber,
): { depositState: BlockInteractionState; deposit: () => Promise<void> } {
  const contractAddress = termParams?.terms[0]?.contractAddress;
  const { web3Provider, chainId, account } = web3Controller;
  const { onLoadingModalOpen, onLoadingModalClose } = useContext(LoadingModalContext);
  const { receivedInviteCode: referralCode } = useContext(ReceivedInviteCodeContext);
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
    onLoadingModalOpen();

    const txHash = await callProxyDeposit(
      depositAmount,
      requiredBaseTokenAmount,
      minTokenAmount,
      account,
      referralCode,
      web3Provider,
      termParams,
    );

    try {
      setCurrentTransaction(txHash);
      toast(
        <a target='_blank' href={getEtherscanLink(chainId, txHash, 'transaction')} rel='noopener noreferrer'>
          <HStack spacing='0.5rem' align='center' justify='space-between' fontWeight='bold'>
            <Box as='span'>{shortenTxId(txHash)}</Box>
            <ExternalLinkIcon size={16} />
          </HStack>
        </a>,
      );
      const receiptTx = await web3Provider.getTransaction(txHash);
      await receiptTx.wait();
      toast.success('Successfully Deposited!');
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
  }, [chainId, contractAddress, web3Provider, depositAmount, requiredBaseTokenAmount, minTokenAmount]);

  return { depositState, deposit };
}
