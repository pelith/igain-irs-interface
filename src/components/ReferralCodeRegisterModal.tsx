import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Divider,
  Text,
  Link,
  Flex,
} from '@chakra-ui/react';
import MainButton from './MainButton';
import { ReactComponent as IconLink } from '../assets/icon-link.svg';
import { EXTERNAL_LINKS } from '../constants/links';
import { BlockInteractionState } from '../constants/blockActionStatus';

interface ReferralCodeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickRegister: () => void;
  registerState: BlockInteractionState;
}

const ReferralCodeRegisterModal = ({
  isOpen,
  onClose,
  onClickRegister,
  registerState,
}: ReferralCodeRegisterModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: '343px', lg: '360px' }} bg='primary.500' fontSize='sm' color='primary.100'>
        <ModalHeader fontWeight='700' fontSize='sm'>
          Invite
        </ModalHeader>
        <ModalCloseButton color='primary.100' _focus={{ boxShadow: 'none' }} />
        <Divider borderWidth='2px' borderColor='primary.700' />
        <ModalBody>
          <Text my='1rem' fontWeight='700' fontSize='xl' color='neutral'>
            Get Your Invite Link
          </Text>
          <Text mb='1rem'>
            Click Register to get your invite link. It might take a few seconds to confirm the transaction.
          </Text>
          <Link
            mb='0.5rem'
            display='inline-block'
            href={EXTERNAL_LINKS.IGAIN_IRS_ARTICLE_ABOUT_REFERRAL_CODE}
            isExternal
            variant='secondary'
          >
            <Flex align='center'>
              <Text pr='4px'>Detail</Text>
              <IconLink width='20px' />
            </Flex>
          </Link>
        </ModalBody>
        <ModalFooter>
          <MainButton onClick={onClickRegister} disabled={registerState !== BlockInteractionState.READY}>
            <Text fontWeight='bold'>REGISTER</Text>
          </MainButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReferralCodeRegisterModal;
