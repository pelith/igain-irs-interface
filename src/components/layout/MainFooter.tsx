import React, { ReactElement } from 'react';
import { Box, Flex, Text, Link, VStack, HStack, Image } from '@chakra-ui/react';
import { Link as ReachLink, useLocation } from 'react-router-dom';
import { EXTERNAL_LINKS } from '../../constants/links';
import { ReactComponent as MainLogo } from '../../assets/logo-irs.svg';
import { ReactComponent as IconTwitter } from '../../assets/icon-twitter.svg';
import { ReactComponent as IconDiscord } from '../../assets/icon-discord.svg';
import { ReactComponent as IconGithub } from '../../assets/icon-github.svg';
import { ReactComponent as IconTelegram } from '../../assets/icon-telegram.svg';
import { ReactComponent as IconMedium } from '../../assets/icon-medium.svg';
import { ReactComponent as IconBug } from '../../assets/icon-bug.svg';
import IconImmunefi from '../../assets/icon-immunefi-dark.png';
import { INTERNAL_PATH } from '../../constants/links';

function MainFooter(): ReactElement {
  const location = useLocation();
  const isLanding = location.pathname === INTERNAL_PATH.LANDING;
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      justify='space-between'
      align='flex-start'
      p={{ base: '66px 35px 120px 35px', lg: '66px 177px 80px 103px' }}
      bg={isLanding ? 'primary.900' : 'primary.700'}
      fontSize='sm'
    >
      <Box mb={{ base: '66px', lg: '0' }}>
        <Flex mb='30px' align='center'>
          <Box mr={{ base: '16px', lg: '50px' }} as={ReachLink} to={INTERNAL_PATH.LANDING}>
            <MainLogo fontSize='24px' />
          </Box>
          <HStack align='flex-start' spacing='20px'>
            <Link href={EXTERNAL_LINKS.JOIN_DISCORD_COMMUNITY} isExternal variant='secondary'>
              <IconDiscord />
            </Link>
            <Link href={EXTERNAL_LINKS.HAKKA_TELEGRAM} isExternal variant='secondary'>
              <IconTelegram />
            </Link>
            <Link href={EXTERNAL_LINKS.IGAIN_FINANCE_TWITTER} isExternal variant='secondary'>
              <IconTwitter />
            </Link>
            <Link href={EXTERNAL_LINKS.HAKKA_MEDIUM} isExternal variant='secondary'>
              <IconMedium />
            </Link>
            <Link href={EXTERNAL_LINKS.HAKKA_GITHUB} isExternal variant='secondary'>
              <IconGithub />
            </Link>
          </HStack>
        </Flex>
        <Link href={EXTERNAL_LINKS.HAKKA_FINANCE_IMMUNEFI} isExternal variant='primary'>
          <Flex
            display='inline-flex'
            align='center'
            p='8px 10px'
            fontSize='sm'
            borderRadius='0.5rem'
            bg='primary.500'
            _hover={{ bg: 'primary.300', cursor: 'pointer' }}
          >
            <IconBug />
            <Text ml='0.5rem' color='neutral'>
              Bug Bounty
            </Text>
            <Text mr='0.5rem' color='primary.100'>
              &nbsp;via
            </Text>
            <Image src={IconImmunefi} w='80px' h='20px' />
          </Flex>
        </Link>
      </Box>
      <HStack spacing='69px' align='flex-start'>
        <Box>
          <Text mb='1rem'>Documents</Text>
          <VStack direction='column' align='flex-start' spacing='1rem'>
            <Link variant='secondary' href={EXTERNAL_LINKS.IGAIN_IRS_USER_GUIDE} isExternal>
              User Guide
            </Link>
            <Link variant='secondary' href={EXTERNAL_LINKS.IGAIN_IRS_WHITEPAPER} isExternal>
              Whitepaper
            </Link>
            <Link variant='secondary' href={EXTERNAL_LINKS.HAKKA_GITHUB} isExternal>
              Github
            </Link>
            <Link variant='secondary' href={EXTERNAL_LINKS.IGAIN_IRS_AUDIT_REPORT} isExternal>
              Audit Reports
            </Link>
          </VStack>
        </Box>
        <Box>
          <Text mb='1rem'>Help Center</Text>
          <VStack direction='column' align='flex-start' spacing='1rem'>
            <Link variant='secondary' href={EXTERNAL_LINKS.JOIN_DISCORD_COMMUNITY} isExternal>
              Discord
            </Link>
            <Link variant='secondary' href={EXTERNAL_LINKS.HAKKA_FORUM} isExternal>
              Forum
            </Link>
          </VStack>
        </Box>
      </HStack>
    </Flex>
  );
}

export default MainFooter;
