import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal,
  Box,
  Text,
  Flex,
  Divider,
  HStack,
} from '@chakra-ui/react';
import JSBI from 'jsbi';
import React, { ReactElement, useContext, useMemo } from 'react';
import { SelectedChainContext } from '../../context/SelectedChainContext';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import { BlockInteractionState } from '../../constants/blockActionStatus';
import { TradeTokenConfig, TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import { UserInfo } from '../../constants/userInfo';
import { useClaimPrice } from '../../hooks/useClaimPrice';
import { formatAmount, formatJsbiAmount } from '../../utils';
import AuthNetworkCheckButtonContainer from '../AuthNetworkCheckButtonContainer';
import { getParamsByContractId } from '../../constants/termInfo/termConfigData';
import useSelectedIGainTermInfo from '../../hooks/useIGainTerms';
import LoadingSection from '../../components/LoadingSection';
import { TermFactoryContext } from '../../context/TermFactoryContext';
import ProtocolType from '../../constants/termInfo/protocolType';
import { getYvTokenInfoByType } from '../../constants/termInfo/yvTokenConfig';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId?: string;
  userInfo?: UserInfo;
  onRedeemConfirm: () => void;
  claimState: BlockInteractionState;
}

type Position = {
  tokenType: TradeTokenType;
  tokenBalance: string;
  tokenPrice: string;
  tokenValue: string;
  baseTokenName: string;
};

const renderPositionCard = (position: Position): JSX.Element => {
  const tokenConfig = TradeTokenConfig[position.tokenType];
  const { TokenIcon } = tokenConfig;
  return (
    <Box mb='2rem' mt='0.5rem' fontSize='sm'>
      <Box mb='1rem'>
        <HStack align='center' spacing='6px'>
          <TokenIcon width='20px' height='20px' />
          <Text>{`${tokenConfig.title} Balance`}</Text>
        </HStack>
        <Text mt='0.5rem' fontSize='xl' fontWeight='bold' color='neutral'>
          {position.tokenBalance}
        </Text>
      </Box>
      <Flex justify='space-between'>
        <Text>Price</Text>
        <Text>
          <Text as='span' mr='4px' fontWeight='bold' color='neutral'>
            {position.tokenPrice}
          </Text>
          {position.baseTokenName}
        </Text>
      </Flex>
      <Flex justify='space-between'>
        <Text>Value</Text>
        <Text>
          <Text as='span' mr='4px' fontWeight='bold' color='neutral'>
            {position.tokenValue}
          </Text>
          {position.baseTokenName}
        </Text>
      </Flex>
    </Box>
  );
};

function RedeemModal({
  isOpen,
  onClose,
  onRedeemConfirm,
  contractId,
  userInfo,
  claimState,
}: RedeemModalProps): ReactElement {
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);

  const targetTermData = useMemo(
    () => getParamsByContractId(contractId || '', selectedChain, iGainTermBaseInfo),
    [contractId, selectedChain, iGainTermBaseInfo],
  );

  const term = useSelectedIGainTermInfo(targetTermData);
  const isSettling = (term?.closeTime || 0) * 1000 < Date.now() && term?.canBuy;

  const {
    longBaseTokenValue,
    shortBaseTokenValue,
    lpBaseTokenValue,
    combineProtocolFee,
    longBaseTokenPrice,
    lpBaseTokenPrice,
    shortBaseTokenPrice,
  } = useClaimPrice(userInfo, term);

  const baseTokenName = useMemo(() => {
    if (targetTermData?.protocolType === ProtocolType.YEARN) {
      return getYvTokenInfoByType(targetTermData.chainId, targetTermData.baseTokenType)?.name || '';
    }
    return term?.tradeBaseTokenType ? BASE_TOKEN_DATA[term?.tradeBaseTokenType].name : '';
  }, [targetTermData]);

  const decimals = term?.decimals || 18;
  let positions: Position[] = useMemo(() => {
    const oriPositions = [
      {
        tokenType: TradeTokenType.LONG,
        tokenBalance: userInfo ? formatAmount(userInfo.longBalance, decimals, 4) : '',
        tokenPrice: formatJsbiAmount(longBaseTokenPrice, 18, 4),
        tokenValue: formatJsbiAmount(longBaseTokenValue, 18, 4),
        baseTokenName,
      },
      {
        tokenType: TradeTokenType.SHORT,
        tokenBalance: userInfo ? formatAmount(userInfo.shortBalance, decimals, 4) : '',
        tokenPrice: formatJsbiAmount(shortBaseTokenPrice, 18, 4),
        tokenValue: formatJsbiAmount(shortBaseTokenValue, 18, 4),
        baseTokenName,
      },
      {
        tokenType: TradeTokenType.LP,
        tokenBalance: userInfo ? formatAmount(userInfo.lpBalance, decimals, 4) : '',
        tokenPrice: formatJsbiAmount(lpBaseTokenPrice, 18, 4),
        tokenValue: formatJsbiAmount(lpBaseTokenValue, 18, 4),
        baseTokenName,
      },
    ];
    return oriPositions.filter((position) => parseFloat(position.tokenBalance) > 0);
  }, [userInfo, longBaseTokenPrice, shortBaseTokenPrice, lpBaseTokenValue]);

  const { add } = JSBI;
  const totalValue = add(shortBaseTokenValue, add(lpBaseTokenValue, longBaseTokenValue));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: '343px', lg: '360px' }} bg='primary.500' color='primary.100'>
        <ModalHeader fontWeight='bold' fontSize='sm'>
          Redeem
        </ModalHeader>
        <ModalCloseButton color='primary.100' _focus={{ boxShadow: 'none' }} />
        <Divider borderWidth='1px' borderColor='primary.700' />
        <ModalBody>
          <Box position='relative' minH='240px'>
            {!term && <LoadingSection bg='primary.500' />}
            <Box>{positions.map((position) => renderPositionCard(position))}</Box>
            <Box p='1rem' borderRadius='0.5rem' bg='primary.700' fontSize='xs' fontWeight='bold'>
              <Text color='neutral'>Total value</Text>
              <Text fontSize='2xl' color='secondary.500' fontWeight='bold'>{`${formatJsbiAmount(
                totalValue,
                18,
                4,
              )} ${baseTokenName}`}</Text>
              <Text>{`including Protocol Fee ${formatJsbiAmount(combineProtocolFee, 18, 4)} ${baseTokenName}`}</Text>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          {term && (
            <AuthNetworkCheckButtonContainer
              colorScheme='secondary'
              targetNetwork={targetTermData?.chainId || selectedChain}
              mr={3}
              onClick={onRedeemConfirm}
              disabled={claimState === BlockInteractionState.PENDING || isSettling}
            >
              CONFIRM
            </AuthNetworkCheckButtonContainer>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RedeemModal;
