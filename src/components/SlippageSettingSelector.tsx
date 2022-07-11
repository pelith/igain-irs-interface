import React, { ReactElement, useState, useContext, useRef, useEffect } from 'react';
import { Box, Text, Flex, HStack } from '@chakra-ui/react';
import { ReactComponent as IconGear } from '../assets/icon-gear.svg';
import { SlippageToleranceContext } from '../context/SlippageToleranceContext';
import NumericalInput from './NumericalInput';

const SLIPPAGE_OPTION = ['0.1', '0.5', '1.0'];
const CUSTOM_INPUT = 'customInput';

function SlippageSettingSelector(): ReactElement {
  const [customSlippage, setCustomSlippage] = useState<string>('');
  const [isShowController, setIsShowController] = useState<boolean>(false);

  const { slippageTolerance, setSlippageTolerance } = useContext(SlippageToleranceContext);

  const [selectedSlippageOption, setSelectedSlippageOption] = useState<string>('');

  const handleCustomInput = (input: string) => {
    if (parseFloat(input) > 100) {
      setSlippageTolerance('0.001');
      setSelectedSlippageOption('0.1');
      setCustomSlippage(input);
      window.localStorage.setItem('SlippageTolerance', '');
    } else {
      const value = (parseFloat(input) / 100).toString();
      setSlippageTolerance(value === 'NaN' ? '0.001' : value);
      setCustomSlippage(input);
      window.localStorage.setItem('SlippageTolerance', value === 'NaN' ? '' : input);
    }
  };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (isShowController && ref.current && !ref.current.contains(e.target)) {
        setIsShowController(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isShowController]);

  const localStorageSlippageTolerance = window.localStorage.getItem('SlippageTolerance');

  useEffect(() => {
    if (localStorageSlippageTolerance) {
      setCustomSlippage(localStorageSlippageTolerance);
      setSelectedSlippageOption(CUSTOM_INPUT);
      setSlippageTolerance((parseFloat(localStorageSlippageTolerance) / 100).toString());
    }
  }, []);

  return (
    <Box ref={ref} position='relative'>
      <Box
        onClick={() => {
          setIsShowController(!isShowController);
          const candidateOption = (parseFloat(slippageTolerance) * 100).toFixed(1);
          const initOption = SLIPPAGE_OPTION.includes(candidateOption) ? candidateOption : CUSTOM_INPUT;
          setSelectedSlippageOption(initOption);
        }}
        cursor='pointer'
        color='primary.100'
        _hover={{
          color: 'neutral',
        }}
      >
        <IconGear />
      </Box>
      {isShowController && (
        <Box
          position='absolute'
          top='1.5rem'
          right='0'
          bg='primary.500'
          p='1.5rem'
          zIndex='2'
          borderRadius='0.5rem'
          boxShadow='0px 24px 32px rgba(0, 0, 0, 0.12), 0px 16px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 0px 1px rgba(0, 0, 0, 0.12)'
        >
          <Flex justify='space-between'>
            <Text fontSize='sm' color='primary.100' fontWeight='500'>
              Slippage Tolerance
            </Text>
          </Flex>
          <HStack align='center' mt='1rem' spacing='0.5rem'>
            {SLIPPAGE_OPTION.map((option) => (
              <Box
                key={option}
                onClick={() => {
                  setSlippageTolerance((parseFloat(option) / 100).toString());
                  setSelectedSlippageOption(option);
                  setCustomSlippage('');
                  window.localStorage.setItem('SlippageTolerance', '');
                }}
                borderColor={selectedSlippageOption === option ? 'neutral' : 'primary.300'}
                color={selectedSlippageOption === option ? 'neutral' : 'primary.100'}
                cursor='pointer'
                p='6px 8px'
                border='1px solid'
                borderRadius='0.5rem'
              >
                {option}%
              </Box>
            ))}
            <Flex
              onClick={() => {
                setSelectedSlippageOption(CUSTOM_INPUT);
                if (localStorageSlippageTolerance) {
                  setSlippageTolerance((parseFloat(localStorageSlippageTolerance) / 100).toString());
                }
              }}
              border='1px'
              borderColor={selectedSlippageOption === CUSTOM_INPUT ? 'neutral' : 'primary.300'}
              color={selectedSlippageOption === CUSTOM_INPUT ? 'neutral' : 'primary.100'}
              p='6px 8px'
              borderRadius='0.5rem'
            >
              <NumericalInput w='98px' value={customSlippage} onUserInput={handleCustomInput} placeholder={'0.1'} />
              <Box>%</Box>
            </Flex>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

export default SlippageSettingSelector;
