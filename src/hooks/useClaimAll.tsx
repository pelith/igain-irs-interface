import React, { useState, useCallback, useMemo, useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box, Button, Flex, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { Contract } from '@ethersproject/contracts';
import { Link as ReachLink } from 'react-router-dom';

import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';
import { getEtherscanLink, shortenTxId, isAddress } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { BlockInteractionState } from '../constants/blockActionStatus';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import ProtocolType from '../constants/termInfo/protocolType';
import IGAIN_AAVE_IRS from '../constants/abis/IGainAAVEIRS.json';
import IGAIN_YEARN_IRS from '../constants/abis/IGainYearnIRS.json';
import { LoadingModalContext } from '../context/LoadingModalContext';
import { TermFactoryContext } from '../context/TermFactoryContext';
import IGainIrsTermConfig from '../constants/termInfo/iGainIrsTermConfig';

const callClaimAll = (signer: any, termParams: IGainIrsTermConfig): Promise<any> => {
  const contractAddress = termParams?.terms[0]?.contractAddress;
  const igainAbi = termParams?.protocolType !== ProtocolType.YEARN ? IGAIN_AAVE_IRS : IGAIN_YEARN_IRS;
  const igainContract = new Contract(contractAddress, igainAbi, signer);
  return igainContract.claim();
};

export default function useClaimAll(
  contractAddress: string | undefined,
  web3Controller: IWeb3Controller,
): { claimState: BlockInteractionState; claim: (successCallback: (contractId: string) => void) => Promise<void> } {
  const { web3Provider, chainId } = web3Controller;
  const { onLoadingModalOpen, onLoadingModalClose } = useContext(LoadingModalContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const claimState: BlockInteractionState = useMemo(() => {
    return currentTransaction ? BlockInteractionState.PENDING : BlockInteractionState.READY;
  }, [currentTransaction]);

  const claim = useCallback(
    async (successCallback: (contractId: string) => void): Promise<void> => {
      if (!web3Provider || !contractAddress || !isAddress(contractAddress)) {
        console.error('no provider');
        return;
      }
      const termParams = getParamsByContractId(contractAddress, chainId, iGainTermBaseInfo);
      if (!termParams) {
        return;
      }
      onLoadingModalOpen();
      const signer = await web3Provider.getSigner();
      try {
        const tx = await callClaimAll(signer, termParams);
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
        toast.success('Successfully Claimed!');
        toast(
          <Box>
            <HStack spacing='0.5rem' align='center' justify='space-between' fontWeight='bold'>
              <Box as='span'>
                <Text p='14px'>Switch to Fixed APY page and start your new terms!</Text>
                <Flex justifyContent='flex-end'>
                  <Button as={ReachLink} size='sm' variant='secondary' to={INTERNAL_PATH.TRADE}>
                    <Text pr='13px'>Restart</Text>
                    <IconArrowRight width='14px' height='11px' />
                  </Button>
                </Flex>
              </Box>
            </HStack>
          </Box>,
        );
        successCallback(contractAddress);
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
        onLoadingModalClose();
      }
    },
    [chainId, contractAddress, web3Provider],
  );

  return { claimState, claim };
}
