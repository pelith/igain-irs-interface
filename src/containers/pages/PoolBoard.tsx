import React, { ReactElement } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import TableContainer from '../TableContainer';
import ChainSwitch from '../../components/ChainSwitch';
import useWindowSize from '../../hooks/useWindowSize';
import { ResponsiveView } from '../../constants/responsive';
import PageFrame from '../../components/common/PageFrame';

interface PoolBoardProps {}

function PoolBoard({}: PoolBoardProps): ReactElement {
  const windowSize = useWindowSize();
  return (
    <PageFrame>
      <Box px={{ base: '1rem', lg: '100px' }} pt={{ base: '2rem', lg: '40px' }} pb='80px'>
        <Flex justify='space-between' pb='40px'>
          <Box>
            <Heading fontWeight='bold' fontSize={{ base: '2xl', lg: '4xl' }}>
              Pools
            </Heading>
            <Text fontSize='sm' color='primary.100'>
              Provide liquidity to get LP tokens and earn rewards
            </Text>
          </Box>
          {windowSize === ResponsiveView.WEB && <ChainSwitch isSimpleMode={false} />}
        </Flex>
        <TableContainer />
      </Box>
    </PageFrame>
  );
}

export default PoolBoard;
