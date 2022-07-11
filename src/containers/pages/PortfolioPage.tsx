import React, { ReactElement } from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';
import PortfolioTermContainer from '../portfolio/PortfolioTermContainer';
import ChainSwitch from '../../components/ChainSwitch';
import useWindowSize from '../../hooks/useWindowSize';
import { ResponsiveView } from '../../constants/responsive';
import SideInfoContainer from '../portfolio/SideInfoContainer';
import PageFrame from '../../components/common/PageFrame';

interface Props {}

function PortfolioPage({}: Props): ReactElement {
  const windowSize = useWindowSize();
  return (
    <PageFrame>
      <Box px={{ base: '1rem', lg: '100px' }} pt={{ base: '34px', lg: '40px' }} mb='80px'>
        <Flex justify='space-between'>
          <Heading mb='24px' fontWeight='bold' fontSize={{ base: '2xl', lg: '4xl' }}>
            Portfolio
          </Heading>
          <ChainSwitch isSimpleMode={windowSize === ResponsiveView.MOBILE} />
        </Flex>
        <Flex direction={{ base: 'column', lg: 'row' }}>
          <Box flex={1} maxH='calc(100vh - 1rem)' position={{ base: 'initial', lg: 'sticky' }} top='1rem'>
            <SideInfoContainer />
          </Box>
          <Flex direction='column' align='flex-start' flex={2}>
            <Box pt={{ base: '1rem', lg: '0' }} w='full'>
              <PortfolioTermContainer />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </PageFrame>
  );
}

export default PortfolioPage;
