import { Box, Text } from '@chakra-ui/react';
import React from 'react';

interface CallActionMainInfoProps {
  subtitle: string;
  title: string;
  description: string;
}

export const CallActionMainInfo = ({ subtitle, title, description }: CallActionMainInfoProps) => {
  return (
    <Box mb='1rem'>
      <Text fontWeight='bold' fontSize='xs'>
        {subtitle}
      </Text>
      <Text fontWeight='bold' fontSize='2xl' color='secondary.500'>
        {title}
      </Text>
      <Text fontWeight='bold' fontSize='xs' color='primary.100'>
        {description}
      </Text>
    </Box>
  );
};
