import { Flex, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

export interface InfoPairProps {
  name: string;
  value?: string | ReactElement;
}

export const InfoPair = ({ name, value }: InfoPairProps) => {
  if (!value) {
    return <></>;
  }
  return (
    <Flex justifyContent='space-between' fontWeight='bold' fontSize='xs'>
      <Text color='primary.100'>{name}</Text>
      {value}
    </Flex>
  );
};
