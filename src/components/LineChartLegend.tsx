import React from 'react';
import { HStack, Flex, Box, Text } from '@chakra-ui/react';

interface LegendItemProps {
  color: string;
  content: string;
}

const LineChartLegend = ({ color, content }: LegendItemProps) => {
  return (
    <HStack justify='center' spacing='2rem'>
      <Flex align='center'>
        <Box display='inline-block' w='8px' h='8px' bg={color}></Box>
        <Text pl='1rem' color='primary.100' fontSize='xs' fontWeight='bold'>
          {content}
        </Text>
      </Flex>
    </HStack>
  );
};

export default LineChartLegend;
