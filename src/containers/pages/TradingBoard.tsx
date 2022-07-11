import React, { ReactElement } from 'react';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import TableContainer from '../TableContainer';
import ChainSwitch from '../../components/ChainSwitch';
import useWindowSize from '../../hooks/useWindowSize';
import { ResponsiveView } from '../../constants/responsive';
import PageFrame from '../../components/common/PageFrame';

interface TradingBoardProps {}

function TradingBoard({}: TradingBoardProps): ReactElement {
  const windowSize = useWindowSize();
  return (
    <PageFrame>
      <Box px={{ base: '1rem', lg: '100px' }} pt={{ base: '2rem', lg: '40px' }} pb='80px'>
        <Flex justify='space-between' pb='40px'>
          <Box>
            <Heading fontWeight='bold' fontSize={{ base: '2xl', lg: '4xl' }}>
              Trade
            </Heading>
            <Text fontSize='sm' color='primary.100'>
              You can buy LONG and SHORT tokens to transfer risks on your existing position
            </Text>
          </Box>
          {windowSize === ResponsiveView.WEB && <ChainSwitch isSimpleMode={false} />}
        </Flex>
        <TableContainer />
      </Box>
    </PageFrame>
  );
}

export default TradingBoard;
