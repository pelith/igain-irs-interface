import React, { ReactElement, useCallback } from 'react';
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
  VStack,
} from '@chakra-ui/react';
import RiskLevelType, { RISK_INFO } from '../../constants/fixedApy/borrowRiskConfig';
import MainButton from '../MainButton';

interface BorrowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrow: () => Promise<void>;
  totalBorrowingAmount: string;
  baseTokenName?: string;
  inputPercentage: string;
  riskLevel: RiskLevelType;
  userWillReceive: string;
  valueToBuyLong: string;
  longAmount: string;
  fixedApy: string;
  priceImpact: string;
}

function BorrowingModal({
  isOpen,
  onClose,
  borrow,
  totalBorrowingAmount,
  baseTokenName,
  inputPercentage,
  riskLevel,
  userWillReceive,
  valueToBuyLong,
  longAmount,
  fixedApy,
  priceImpact,
}: BorrowingModalProps): ReactElement {
  interface ReceiveInfoProps {
    title: string;
    value: string;
  }

  const ReceiveInfo = ({ title, value }: ReceiveInfoProps) => {
    return (
      <Flex justify='space-between' w='100%'>
        <Text>{title}</Text>
        <Text color='neutral'>{value}</Text>
      </Flex>
    );
  };

  const onBorrowConfirm = useCallback(() => {
    borrow();
    onClose();
  }, [borrow, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: '343px', lg: '360px' }} fontSize='xs' bg='primary.500' color='primary.100'>
        <ModalHeader fontWeight='700' fontSize='sm'>
          Confirm
        </ModalHeader>
        <ModalCloseButton color='primary.100' _focus={{ boxShadow: 'none' }} />
        <Divider borderWidth='2px' borderColor='primary.700' />
        <ModalBody>
          <Box>
            <Text mb='0.5rem' fontSize='sm'>
              Total borrowing amount
            </Text>
            <Text mb='0.75rem' fontSize='xl' color='neutral'>
              <Text as='span' fontWeight='700'>
                {totalBorrowingAmount}
              </Text>
              {` ${baseTokenName}`}
            </Text>
            <Flex justify='space-between' fontSize='md' color='neutral' fontWeight='700'>
              <Text>{inputPercentage}</Text>
              <Text color={RISK_INFO[riskLevel].color}>{RISK_INFO[riskLevel].content}</Text>
            </Flex>
          </Box>
        </ModalBody>
        <Divider borderWidth='2px' borderColor='primary.700' />
        <ModalFooter>
          <Flex direction='column'>
            <Box>
              <Text fontSize='sm'>will receive</Text>
              <Text fontSize='xl' color='neutral'>
                <Text as='span' fontWeight='700'>
                  {userWillReceive}
                </Text>
                {` ${baseTokenName}`}
              </Text>
              <VStack mt='1.5rem' mb='2rem' spacing='4px' align='flex-start'>
                <ReceiveInfo title={'Total Value to Buy LONG'} value={`${valueToBuyLong} ${baseTokenName}`} />
                <ReceiveInfo title={'Total Amount of LONG'} value={longAmount} />
                <ReceiveInfo title={'Fixed APY'} value={`${fixedApy}`} />
                <ReceiveInfo title={'Price Impact'} value={`${priceImpact}`} />
              </VStack>
            </Box>
            <Box p='1rem' mb='1rem' bg='rgba(239, 112, 0, 0.1)' color='secondary.700' borderRadius='8px'>
              <Text fontWeight='700' mb='4px'>
                Notice
              </Text>
              <Text>
                Fixed rates and Long token value on iGain IRS are NOT linked to your collateral position on Aave. Please
                beware of liquidation risk while adjusting your collateral ratio on Aave as it is independent to the
                iGain IRS platform.
              </Text>
            </Box>
            <MainButton onClick={onBorrowConfirm}>
              <Text fontWeight='bold'>CONFIRM</Text>
            </MainButton>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default BorrowingModal;
