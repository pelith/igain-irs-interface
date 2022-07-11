import React, { useContext } from 'react';
import { Box, Text, Flex, Link, HStack, Button } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import useSWR from 'swr';
import { Web3Context } from '../../context/Web3Context';
import { ReferralCodeContext } from '../../context/ReferralCodeContext';
import { jsonFetcher } from '../../utils/fetch';
import InviteButtonWithModalContainer from '../../containers/InviteButtonWithModalContainer';
import useWindowSize from '../../hooks/useWindowSize';
import { EXTERNAL_LINKS, INTERNAL_PATH } from '../../constants/links';
import { ResponsiveView } from '../../constants/responsive';
import { ReactComponent as IconMedalIron } from '../../assets/icon-medal-iron-small.svg';
import { ReactComponent as IconLink } from '../../assets/icon-link.svg';
import bgInviteTrigger from '../../assets/bgImages/bg-inviteTrigger.svg';
import bgInviteTriggerLarge from '../../assets/bgImages/bg-inviteTrigger-large.svg';

interface ReferralResultDetailProps {
  value: string;
  title: string;
}

const ReferralResultDetail = ({ value, title }: ReferralResultDetailProps) => {
  return (
    <Box>
      <Text fontWeight='bold'>{value}</Text>
      <Text fontSize='xs' color='primary.100-60'>
        {title}
      </Text>
    </Box>
  );
};

const RankingButton = () => {
  return (
    <Link as={ReachLink} to={INTERNAL_PATH.RANKING} variant='primary'>
      <Button variant='secondary' p='4px 12px' height='unset'>
        <Text fontSize='xs'>Ranking</Text>
      </Button>
    </Link>
  );
};

function InviteInfoAreaAndTrigger() {
  const web3Controller = useContext(Web3Context);
  const { account } = web3Controller;
  const { referralCode } = useContext(ReferralCodeContext);
  const { data } = useSWR(
    !!referralCode && referralCode !== '0'
      ? `${process.env.REACT_APP_CHART_API}/proxy/${account}/${referralCode || '0'}`
      : null,
    jsonFetcher,
  );
  const { invitees, volume } = data || { invitees: 0, volume: 0 };
  const windowSize = useWindowSize();

  return (
    <Box
      p='24px'
      bg='primary.700'
      borderRadius='8px'
      bgImage={windowSize === ResponsiveView.WEB ? bgInviteTrigger : bgInviteTriggerLarge}
      bgRepeat='no-repeat'
      bgPosition='right bottom'
    >
      <HStack spacing='12px' mb='12px' align={{ base: 'flex-start', lg: 'center' }}>
        <Text fontWeight='bold' fontSize='sm'>
          Invite friends to join Fixed APY - Lending
        </Text>
        {invitees > 0 && <IconMedalIron />}
        <Box hidden={windowSize === ResponsiveView.MOBILE}>
          <RankingButton />
        </Box>
      </HStack>
      <Flex direction={{ base: 'column', lg: 'row' }} justify='space-between'>
        <HStack spacing='3rem'>
          <ReferralResultDetail value={invitees} title='Invitees' />
          <ReferralResultDetail value={volume} title='Volume' />
          <Box hidden={windowSize === ResponsiveView.WEB}>
            <RankingButton />
          </Box>
        </HStack>
        <HStack mt={{ base: '24px', lg: '0' }} align='center' spacing='0.5rem'>
          <Box flex={1}>
            <InviteButtonWithModalContainer buttonWidth={windowSize === ResponsiveView.MOBILE ? '100%' : ''} />
          </Box>
          <Link href={EXTERNAL_LINKS.IGAIN_IRS_ARTICLE_ABOUT_REFERRAL_CODE} isExternal variant='secondary'>
            <Flex p='0.5rem 0.5rem 0.5rem 1rem'>
              <Text>Detail</Text>
              <IconLink width='20px' />
            </Flex>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}

export default InviteInfoAreaAndTrigger;
