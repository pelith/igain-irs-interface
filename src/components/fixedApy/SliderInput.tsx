import React, { useEffect, useState, useMemo } from 'react';
import { Box, Flex, HStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip } from '@chakra-ui/react';

interface Props {
  inputPercentage: number;
  setInputPercentage: (inputPercentage: number) => void;
  lowestValue?: number;
  isDisabled?: boolean;
}

function SliderInput({ inputPercentage, setInputPercentage, lowestValue, isDisabled }: Props) {
  const MAX_VALUE = 60;
  const MIN_VALUE = 0;
  const [sliderPercentage, setSliderPercentage] = useState(MIN_VALUE);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSliderValueChange, setIsSliderValueChange] = useState(false);

  const checkIsValueLessThanLowestValue = () => {
    if (lowestValue && lowestValue > 0 && sliderPercentage < lowestValue) {
      if (lowestValue > MAX_VALUE) {
        setSliderPercentage(MAX_VALUE);
      } else {
        setSliderPercentage(lowestValue);
        setIsSliderValueChange(true);
      }
    }
  };

  useEffect(() => {
    if (sliderPercentage !== inputPercentage) {
      if (isSliderValueChange) {
        const lowerBound = lowestValue || MIN_VALUE;
        if (sliderPercentage < lowerBound) {
          setInputPercentage(lowerBound);
          setIsSliderValueChange(false);
          return;
        }
        setInputPercentage(sliderPercentage);
        setIsSliderValueChange(false);
      } else if (inputPercentage < MAX_VALUE) {
        setSliderPercentage(inputPercentage);
      } else {
        setSliderPercentage(MAX_VALUE);
      }
    } else {
      setIsSliderValueChange(false);
    }
  }, [isSliderValueChange, inputPercentage, lowestValue]);

  useEffect(() => {
    checkIsValueLessThanLowestValue();
  }, [lowestValue, inputPercentage]);

  const coveredTrackWidth = useMemo(() => {
    if (lowestValue) {
      if (lowestValue > MAX_VALUE) {
        return '100%';
      } else {
        return `${((lowestValue / MAX_VALUE) * 100).toFixed(2)}%`;
      }
    } else {
      return 0;
    }
  }, [lowestValue]);

  const thumbCustomLeft = useMemo(
    () => `calc(${(sliderPercentage / MAX_VALUE) * 100}% - 10px) !important`,
    [sliderPercentage],
  );

  return (
    <HStack mt='30px' spacing='16px' px='1rem' py='20px' fontSize='12px'>
      <Box color={(lowestValue && lowestValue > 0) || isDisabled ? 'primary.100-60' : 'accent.500'}>0%</Box>
      <Flex w='100%' alignItems='center' position='relative'>
        <Slider
          id='slider'
          min={MIN_VALUE}
          max={MAX_VALUE}
          value={sliderPercentage}
          onChange={setSliderPercentage}
          onChangeStart={() => {
            setShowTooltip(true);
          }}
          onChangeEnd={() => {
            setShowTooltip(false);
            setIsSliderValueChange(true);
          }}
          isDisabled={isDisabled}
          size='sm'
          focusThumbOnChange={false}
        >
          <SliderTrack
            bgGradient={isDisabled ? '' : 'linear-gradient(270deg, secondary.700 0%, accent.500 100%)'}
            bgColor={isDisabled ? 'primary.300' : ''}
          >
            <SliderFilledTrack bgColor='transparent' />
          </SliderTrack>
          <Tooltip
            placement='top'
            px='8px'
            py='4px'
            mb='6px'
            isOpen={showTooltip}
            label={`${sliderPercentage}%`}
            fontSize='14px'
            fontWeight='bold'
            bg='accent.300'
            color='white'
            borderRadius='8px'
          >
            <SliderThumb
              boxSize={5}
              bg='radial-gradient(120% 120% at 50% 100%, #243259 49.85%, #8491B8 100%)'
              border='none'
              left={thumbCustomLeft}
            />
          </Tooltip>
        </Slider>
        <Box
          display={isDisabled ? 'none' : 'block'}
          position='absolute'
          height='2.5px'
          width={coveredTrackWidth}
          borderLeftRadius='8px'
          bg='primary.300'
        />
      </Flex>
      <Box color={isDisabled ? 'primary.100-60' : 'secondary.700'}>60%</Box>
    </HStack>
  );
}

export default SliderInput;
