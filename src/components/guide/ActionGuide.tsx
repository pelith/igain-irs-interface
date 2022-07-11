import React, { ReactElement } from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';

interface Props {
  Icon: React.FunctionComponent;
  description: string;
  buttonContent: string;
  handleChangeNetwork: () => void;
}

function ActionGuide({ Icon, description, buttonContent, handleChangeNetwork }: Props): ReactElement {
  return (
    <Flex
      direction='column'
      align='center'
      borderRadius='0.5rem'
      bg='primary.700'
      p={{ base: '60px 16px 45px 16px', lg: '103px 0 82px 0' }}
    >
      <Icon />
      <Text align='center' mt='38px' fontSize='sm'>
        {description}
      </Text>
      <Button p='16px 32px' mt='32px' h='56px' variant='primary' onClick={handleChangeNetwork}>
        <Text fontSize='md' fontWeight='bold'>
          {buttonContent}
        </Text>
      </Button>
    </Flex>
  );
}

export default ActionGuide;
