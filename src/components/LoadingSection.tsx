import React, { ReactElement } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

interface LoadingSectionProps {
  bg?: string;
}

function LoadingSection({ bg }: LoadingSectionProps): ReactElement {
  return (
    <Flex
      justify='center'
      align='center'
      position='absolute'
      w='100%'
      h='100%'
      zIndex='5'
      bg={bg || 'primary.700'}
      borderRadius='8px'
    >
      <Spinner emptyColor='primary.300' size='xl' speed='0.85s' thickness='4px' color='primary.100' />
    </Flex>
  );
}

export default LoadingSection;
