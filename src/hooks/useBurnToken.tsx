import React, { useState, useCallback, useMemo, useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Box, Button, Flex, Text } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';

import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';
import { getEtherscanLink, shortenTxId, isAddress } from '../utils/web3Utils';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import { BlockInteractionState } from '../constants/blockActionStatus';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import ProtocolType from '../constants/termInfo/protocolType';
import IGAIN_AAVE_IRS from '../constants/abis/IGainAAVEIRS.json';
import IGAIN_YEARN_IRS from '../constants/abis/IGainYearnIRS.json';
import AGGREGATED_YEARN_PROXY from '../constants/abis/YearnProxy.json';
import { LoadingModalContext } from '../context/LoadingModalContext';
import { TermFactoryContext } from '../context/TermFactoryContext';
import IGainIrsTermConfig from '../constants/termInfo/iGainIrsTermConfig';
import { getYvTokenAddressByType } from '../constants/termInfo/yvTokenConfig';

const BURN_FUNCTION_MAP = {
  [TradeTokenType.LONG]: 'burnB',
  [TradeTokenType.SHORT]: 'burnA',
  [TradeTokenType.LP]: 'burnLP',
};

const callBurnToken = (
  burnFunctionName: string,
  signer: any,
  burnAmount: BigNumber,
  minAmount: BigNumber,
  termParams: IGainIrsTermConfig,
): Promise<any> => {
  const aggregatedProxyAddress = termParams?.terms[0]?.aggregatedProxy;
  const contractAddress = termParams?.terms[0]?.contractAddress;
  if (aggregatedProxyAddress && termParams.protocolType === ProtocolType.YEARN) {
    const aggregatedProxyContract = new Contract(aggregatedProxyAddress, AGGREGATED_YEARN_PROXY, signer);
    const yVault = getYvTokenAddressByType(termParams.chainId, termParams.baseTokenType);
    return aggregatedProxyContract[burnFunctionName](contractAddress, yVault, burnAmount, minAmount, {
      gasLimit: 535347,
    });
  }
  const igainAbi = termParams?.protocolType !== ProtocolType.YEARN ? IGAIN_AAVE_IRS : IGAIN_YEARN_IRS;
  const igainContract = new Contract(contractAddress, igainAbi, signer);
  return igainContract[burnFunctionName](burnAmount, minAmount);
};

export default function useBurnToken(
  contractAddress: string | undefined,
  web3Controller: IWeb3Controller,
  burnAmount: BigNumber,
  minAmount: string,
  tokenType: TradeTokenType,
  transactionCallback?: (success: boolean) => void,
): {
  burnTokenState: BlockInteractionState;
  burnToken: () => Promise<void>;
} {
  const { web3Provider, chainId } = web3Controller;
  const { onLoadingModalOpen, onLoadingModalClose } = useContext(LoadingModalContext);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const burnTokenState: BlockInteractionState = useMemo(() => {
    return currentTransaction ? BlockInteractionState.PENDING : BlockInteractionState.READY;
  }, [currentTransaction]);

  const { iGainTermBaseInfo } = useContext(TermFactoryContext);

  const burnToken = useCallback(async (): Promise<void> => {
    if (!web3Provider || !contractAddress || !isAddress(contractAddress)) {
      console.error('no provider or address');
      return;
    }
    onLoadingModalOpen();
    const signer = await web3Provider.getSigner();
    const termParams = getParamsByContractId(contractAddress, chainId, iGainTermBaseInfo);
    const burnFunction = BURN_FUNCTION_MAP[tokenType];
    const parsedMinAmount = BigNumber.from(minAmount);

    try {
      if (!termParams) {
        return;
      }
      const tx = await callBurnToken(burnFunction, signer, burnAmount, parsedMinAmount, termParams);
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
      toast.success(`Successfully Sell ${tokenType}!`);
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
      if (transactionCallback) {
        transactionCallback(true);
      }
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
  }, [burnAmount, minAmount, tokenType, chainId, contractAddress, web3Provider]);

  return { burnTokenState, burnToken };
}
