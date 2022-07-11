import { Box, Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface Props {
  sideInfo: ReactNode;
  mainInfoPanel: ReactNode;
  bottomInfo: ReactNode;
}

export const FixedApyPanelFrame = ({ sideInfo, mainInfoPanel, bottomInfo }: Props) => {
  return (
    <Flex p={{ base: '', lg: '40px 100px 80px 100px' }} flex='1' direction={{ base: 'column', lg: 'row' }}>
      <Box flex='1' maxH='100vh' position={{ base: 'initial', lg: 'sticky' }} top='0'>
        {sideInfo}
      </Box>
      <Box width='5rem' />
      <Box flex='3'>{mainInfoPanel}</Box>
      {bottomInfo}
    </Flex>
  );
};
