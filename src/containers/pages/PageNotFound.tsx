import React, { ReactElement } from 'react';
import { Text, Button, Flex } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { ReactComponent as Telescope } from '../../assets/icon-telescope-not-found.svg';

export default function NotFoundWarning(): ReactElement {
  return (
    <Flex flex={1} direction='column' justify='center' align='center'>
      <Telescope width='160px' />
      <Text fontSize='4xl' fontWeight='bold'>
        Page Not Found
      </Text>
      <Button as={ReachLink} size='lg' variant='primary' mt='2.35rem' to='/'>
        Return to Homepage
      </Button>
    </Flex>
  );
}
