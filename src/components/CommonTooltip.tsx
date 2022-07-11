import { Box, Tooltip } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { ReactComponent as QuestionMark } from '../assets/icon-question-mark.svg';

interface Props {
  label: string;
}

function CommonTooltip({ label }: Props): ReactElement {
  return (
    <Tooltip
      hasArrow
      label={label}
      bg='black'
      color='neutral'
      fontSize='xs'
      p='1rem'
      borderRadius='0.5rem'
      gutter={16}
      fontWeight='bold'
    >
      <Box color='primary.100' _hover={{ color: 'neutral' }}>
        <QuestionMark width='12px' height='12px' />
      </Box>
    </Tooltip>
  );
}

export default CommonTooltip;
