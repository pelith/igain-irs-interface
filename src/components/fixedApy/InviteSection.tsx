import React from 'react';
import { Box, Text, Flex, Link } from '@chakra-ui/react';
import InviteButtonWithModalContainer from '../../containers/InviteButtonWithModalContainer';
import { ReactComponent as IconLink } from '../../assets/icon-link.svg';
import bgInviteSection from '../../assets/bgImages/bg-inviteSection.svg';
import { EXTERNAL_LINKS } from '../../constants/links';

function InviteSection() {
  return (
    <Box
      p='20px 1rem 1rem 1rem'
      borderRadius='8px'
      bg='primary.700'
      bgImage={bgInviteSection}
      bgRepeat='no-repeat'
      bgPosition='right bottom'
    >
      <Text mb='1rem' fontWeight='700' fontSize='lg'>
        Invite to get rewards
      </Text>
      <Text mb='1rem' fontSize='xs'>
        Earn rewards by{' '}
        <Text as='span' bgGradient='linear(to-r, secondary.300, secondary.500)' bgClip='text'>
          inviting friends
        </Text>{' '}
        to trade on Fixed APY - Lending
      </Text>
      <Flex align='center'>
        <Box flex={1}>
          <InviteButtonWithModalContainer buttonWidth={'100%'} />
        </Box>
        <Link href={EXTERNAL_LINKS.IGAIN_IRS_ARTICLE_ABOUT_REFERRAL_CODE} isExternal variant='secondary'>
          <Flex p='0.5rem 0.5rem 0.5rem 1rem' align='center'>
            <Text pr='4px' fontSize='sm'>
              Detail
            </Text>
            <IconLink width='20px' />
          </Flex>
        </Link>
      </Flex>
    </Box>
  );
}

export default InviteSection;
