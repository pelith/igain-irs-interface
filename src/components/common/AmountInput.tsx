import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import NumericalInput from '../NumericalInput';

interface AmountInputProps {
  children?: React.ReactNode;
  isFocusedFromInput: boolean;
  setIsFocusedFromInput?: (focused: boolean) => void;
  inputAmount?: string;
  onChangeInput: (input: string) => void;
  amountLabel?: string;
  decimals?: number;
  isExceedBalance?: boolean;
}

export const AmountInput = ({
  isFocusedFromInput,
  children,
  inputAmount,
  amountLabel,
  decimals,
  setIsFocusedFromInput,
  onChangeInput,
  isExceedBalance,
}: AmountInputProps) => {
  return (
    <Box
      borderRadius='0.5rem'
      bg='primary.500'
      p='1rem'
      w='100%'
      fontWeight='bold'
      border='1px solid'
      borderColor={isExceedBalance ? 'danger' : isFocusedFromInput ? 'primary.100' : 'primary.700'}
    >
      <Flex alignItems='baseline'>
        <NumericalInput
          setIsFocused={setIsFocusedFromInput}
          placeholder='0.0'
          value={inputAmount || ''}
          onUserInput={onChangeInput}
          bg='primary.500'
          fontSize='2xl'
          fontWeight='bold'
          borderRadius='none'
          decimals={decimals}
        />
        <Box ml='0.5rem' color='primary.100'>
          {amountLabel}
        </Box>
      </Flex>
      <Box color='primary.100' fontSize='sm' mt='0.5rem' hidden={!children}>
        {children}
      </Box>
    </Box>
  );
};
