import React, { ReactElement } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';

interface Props {
  stepNumber: string;
  children: React.ReactNode;
  sideInfoContent: string;
}

function PanelStepper({ stepNumber, children, sideInfoContent }: Props): ReactElement {
  return (
    <Flex justify='space-between' width='100%' h='100%' minH='0' direction={{ base: 'column', lg: 'row' }}>
      <Flex
        flex='1'
        p='1rem'
        direction={{ base: 'row', lg: 'column' }}
        alignItems={{ base: 'center', lg: 'flex-start' }}
      >
        <Box fontWeight='bold' color='neutral' minW='fit-content'>
          STEP {stepNumber}
        </Box>
        <Text fontSize='xs' fontWeight='bold' color='primary.100' ml={{ base: '0.5rem', lg: '0' }}>
          {sideInfoContent}
        </Text>
      </Flex>
      <Box flex='2' minW='0' border='solid 1px' borderColor='primary.500' borderRadius='0.5rem' p='1rem'>
        {children}
      </Box>
    </Flex>
  );
}

export default PanelStepper;
