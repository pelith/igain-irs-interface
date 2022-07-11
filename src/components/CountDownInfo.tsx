import { Box, Flex, Text } from '@chakra-ui/react';
import React, { ReactElement, useCallback } from 'react';
import Countdown from 'react-countdown';

interface Props {
  countdownTime: number;
}

interface CountdownIndicatorProps {
  displayNumber: number;
  label: string;
}

function CountdownIndicator({ displayNumber }: CountdownIndicatorProps): ReactElement {
  return (
    <Text fontWeight='bold' lineHeight='1.25'>
      {displayNumber}
    </Text>
  );
}

function CountDownInfo({ countdownTime }: Props): ReactElement {
  const countdownRenderer = useCallback(
    ({ days, hours, minutes }: { days: number; hours: number; minutes: number }) => {
      if (hours < 1 && days < 1) {
        return [
          <CountdownIndicator key='days' displayNumber={minutes} label={minutes > 1 ? 'minutes' : 'minute'} />,
          <Box key='timeSeparator1' pr='4px' fontWeight='bold' pl='4px'>
            Min
          </Box>,
        ];
      }
      return [
        <CountdownIndicator key='days' displayNumber={days} label={days > 1 ? 'days' : 'day'} />,
        <Box key='timeSeparator1' pr='4px' fontWeight='bold'>
          D
        </Box>,
        <CountdownIndicator key='hours' displayNumber={hours} label={hours > 1 ? 'hours' : 'hour'} />,
        <Box key='timeSeparator2' pr='4px' fontWeight='bold'>
          H
        </Box>,
      ];
    },
    [],
  );
  return (
    <Flex align='center' fontSize='md' color='accent.500' lineHeight='1.5'>
      <Countdown date={new Date(countdownTime)} renderer={countdownRenderer} />
      <Text pl='4px'>Left</Text>
    </Flex>
  );
}

export default CountDownInfo;
