import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import InviteButtonWithModalContainer from '../../containers/InviteButtonWithModalContainer';

const LandingReferralInviter = () => {
  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      p='0.5rem'
      bg='linear-gradient(90deg, #0F1C4D 0%, #17203D 100%)'
      borderRadius='0.5rem'
      w={{ base: '100%', lg: '450px' }}
    >
      <Text fontWeight={700} fontSize='sm' lineHeight='20px' m='0.5rem' letterSpacing='0.02em'>
        Invite friends to join Fixed APY - Lending
      </Text>
      <InviteButtonWithModalContainer buttonColorScheme='common' buttonSize='sm' />
    </Flex>
  );
};

export default LandingReferralInviter;
