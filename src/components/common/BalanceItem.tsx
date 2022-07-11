import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

interface BalanceItemProps {
  content: string;
  balance?: string;
  Icon?: any;
}

const BalanceItem = ({ content, balance, Icon }: BalanceItemProps) => (
  <Box ml='4px'>
    <Flex align='center'>
      <Icon width='20px' height='20px' />
      <Text ml='8px' fontSize='sm' color='primary.100'>{`${content} Balance`}</Text>
    </Flex>
    <Text
      h='32px'
      mt='8px'
      fontSize='xl'
      fontWeight='bold'
      color={parseFloat(balance || '0') > 0 ? 'neutral' : 'primary.300'}
    >
      {balance ? balance : '-'}
    </Text>
  </Box>
);

export default BalanceItem;
