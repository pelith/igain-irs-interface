import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { transformDate } from '../../utils';
import CountDownInfo from '../CountDownInfo';

interface FixedApyTermItemProps {
  expiryTime?: number;
  apy?: React.ReactNode;
  protocolName?: string;
  proxyIcon?: React.FunctionComponent;
  baseTokenIcon?: React.FunctionComponent;
}

const FixedApyTermItem = ({
  expiryTime,
  apy,
  protocolName,
  proxyIcon: ProxyIcon,
  baseTokenIcon: BaseTokenIcon,
}: FixedApyTermItemProps) => {
  return (
    <Box px='18px' p='1rem'>
      <Flex justify='space-between'>
        {expiryTime ? <CountDownInfo countdownTime={expiryTime * 1000} /> : '-'}
        <Text fontSize='xs' fontWeight='bold'>
          {expiryTime ? transformDate(expiryTime * 1000) : ''}
        </Text>
      </Flex>
      <Flex justify='space-between'>
        <Flex>
          {BaseTokenIcon ? <BaseTokenIcon /> : '-'}
          <Text ml='0.5rem' fontWeight='bold' fontSize='lg'>
            {apy}
          </Text>
        </Flex>
        <Flex alignItems='center' color='primary.100'>
          {ProxyIcon ? <ProxyIcon /> : '-'}
          <Text ml='0.5rem'>{protocolName}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default FixedApyTermItem;
