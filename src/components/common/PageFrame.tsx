import React, { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

function PageFrame({ children }: Props): ReactElement {
  return (
    <Box w='full' maxW='1440px' mx='auto'>
      {children}
    </Box>
  );
}

export default PageFrame;
