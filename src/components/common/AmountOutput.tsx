import { Box, Flex, Input, Text } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  amountLabel?: string;
  amount: string;
}

export const AmountOutput = ({ amount, amountLabel, children }: Props) => {
  return (
    <Box borderRadius='0.5rem' p='1rem' w='100%' fontWeight='bold'>
      <Flex justifyContent='space-between' alignItems='baseline'>
        <Input value={amount} fontSize='2xl' fontWeight='bold' variant='unstyled' borderRadius='none' isReadOnly />
        <Box ml='0.5rem ' color='primary.100'>
          {amountLabel}
        </Box>
      </Flex>
      <Text color='primary.100' fontSize='sm' mt='0.5rem'>
        {children}
      </Text>
    </Box>
  );
};
