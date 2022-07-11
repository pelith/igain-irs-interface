import React, { useMemo } from 'react';
import { parseUnits } from '@ethersproject/units';
import { escapeRegExp } from '../utils/index';
import { Input, InputProps } from '@chakra-ui/react';

const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$'); // match escaped "." characters via in a non-capturing group

interface NumericalInputProps extends Omit<InputProps, 'onChange'> {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: number; // for escape Warning: Received `false` for a non-boolean attribute `error`. When use error?: boolean;
  maxLength?: number;
  setIsFocused?: (focused: boolean) => void;
  decimals?: number;
}

const NumericalInput = React.forwardRef<HTMLInputElement, NumericalInputProps>(
  ({ value, onUserInput, placeholder, maxLength, decimals = 18, setIsFocused, ...rest }, ref) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        try {
          parseUnits(nextUserInput, decimals);
        } catch (error) {
          const decimalString = nextUserInput?.split('.')[1];
          const fixLength = decimalString ? decimalString.length - decimals : 1;
          nextUserInput = nextUserInput.substring(0, nextUserInput.length - fixLength);
        }
        onUserInput(nextUserInput);
      }
    };

    const onFocus = useMemo(
      () =>
        setIsFocused
          ? () => {
              setIsFocused(true);
            }
          : undefined,
      [setIsFocused],
    );
    const onBlur = useMemo(
      () =>
        setIsFocused
          ? () => {
              setIsFocused(false);
            }
          : undefined,
      [setIsFocused],
    );
    return (
      <Input
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={(event) => {
          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, '.'));
        }}
        // universal input options
        inputMode='decimal'
        title='Token Amount'
        autoComplete='off'
        autoCorrect='off'
        // text-specific options
        type='text'
        pattern='^[0-9]*[.,]?[0-9]*$'
        placeholder={placeholder || '0'}
        minLength={1}
        maxLength={maxLength || 79}
        spellCheck='false'
        variant='unstyled'
        _placeholder={{
          color: 'primary.300',
        }}
        {...rest}
      />
    );
  },
);

NumericalInput.displayName = 'NumericalInput';

export default NumericalInput;
