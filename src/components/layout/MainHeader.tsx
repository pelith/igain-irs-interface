import { Center, Flex, Box } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { Link as ReachLink, useLocation } from 'react-router-dom';
import { ReactComponent as MainLogo } from '../../assets/logo-irs.svg';
import { INTERNAL_PATH } from '../../constants/links';
import { ResponsiveView } from '../../constants/responsive';
import useWindowSize from '../../hooks/useWindowSize';
import WalletIndicator from '../WalletIndicator';
import HeaderLink from './HeaderLink';

function MainHeader(): ReactElement {
  const location = useLocation();
  const isLanding = location.pathname === INTERNAL_PATH.LANDING;
  const windowSize = useWindowSize();
  return (
    <Flex bg='primary.700' justifyContent='space-between' alignItems={'center'} px='40px' height='68px'>
      <Box as={ReachLink} to={INTERNAL_PATH.LANDING}>
        <MainLogo fontSize='24px' />
      </Box>
      <Flex alignItems='center'>
        {windowSize !== ResponsiveView.MOBILE && (
          <>
            <HeaderLink linkName='Portfolio' linkPath={INTERNAL_PATH.PORTFOLIO} />
            <HeaderLink linkName='Fixed APY' linkPath={INTERNAL_PATH.FIX_INTEREST} />
            <HeaderLink linkName='Trade' linkPath={INTERNAL_PATH.TRADE} />
            <HeaderLink linkName='Pool' linkPath={INTERNAL_PATH.POOL} />
          </>
        )}
        {!isLanding && <WalletIndicator />}
      </Flex>
      {windowSize === ResponsiveView.MOBILE && (
        <Center position='fixed' bottom='12px' w='100%' left='0' zIndex='20'>
          <Flex alignItems='center' borderRadius='0.5rem' border='1px solid' borderColor='primary.300' bg='primary.500'>
            <HeaderLink linkName='Portfolio' linkPath={INTERNAL_PATH.PORTFOLIO} variant='navMobile' />
            <HeaderLink linkName='Fixed APY' linkPath={INTERNAL_PATH.FIX_INTEREST} variant='navMobile' />
            <HeaderLink linkName='Trade' linkPath={INTERNAL_PATH.TRADE} variant='navMobile' />
            <HeaderLink linkName='Pool' linkPath={INTERNAL_PATH.POOL} variant='navMobile' />
          </Flex>
        </Center>
      )}
    </Flex>
  );
}

export default MainHeader;
