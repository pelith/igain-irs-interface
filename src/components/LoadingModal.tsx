import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { LoadingModalContext } from '../context/LoadingModalContext';
import LoadingSection from './LoadingSection';

const LoadingModal = () => {
  const { isLoadingModalOpen, loadingMessage, onLoadingModalClose } = useContext(LoadingModalContext);
  return (
    <Modal isOpen={isLoadingModalOpen} onClose={onLoadingModalClose} isCentered>
      <ModalOverlay />
      <ModalContent w={{ base: '343px', lg: '360px' }} bg='primary.500'>
        <ModalHeader />
        <ModalCloseButton color='primary.100' _focus={{ boxShadow: 'none' }} />
        <ModalBody>
          <Box position={'relative'} h='4rem' mb='1rem'>
            <LoadingSection bg='primary.500' />
          </Box>
          <Text textAlign='center' mb='1.5rem' fontWeight='bold'>
            {loadingMessage}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingModal;
