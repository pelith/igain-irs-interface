import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '../assets/icon-arrow-left.svg';

interface Props {
  path: string;
}

export const BackLink = ({ path }: Props) => {
  return (
    <Link to={path}>
      <Flex align='center' p='8px' cursor='pointer' color='primary.100' _hover={{ color: 'neutral' }}>
        <IconArrowLeft />
        <Text pl='10px'>Back</Text>
      </Flex>
    </Link>
  );
};
