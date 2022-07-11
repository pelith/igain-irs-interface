import { VStack } from '@chakra-ui/react';
import React from 'react';

type Props = {
  hidden?: boolean;
  children: React.ReactNode;
};

export const PanelFormFrame = ({ children, hidden = false }: Props) => {
  return (
    <VStack borderRadius='0.5rem' bg='primary.700' p='1rem' spacing='1rem' h='100%' hidden={hidden}>
      {children}
    </VStack>
  );
};
