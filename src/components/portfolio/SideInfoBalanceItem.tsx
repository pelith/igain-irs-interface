import React, { ReactElement } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

interface Props {
  token: string;
  balance: string;
  Icon?: React.FunctionComponent;
}

function SideInfoBalanceItem({ token, balance, Icon }: Props): ReactElement {
  return (
    <Box mb='1rem' mr={{ base: '26px', lg: '0' }}>
      <Flex pb='8px'>
        {Icon && <Icon />}
        <Text pl='6px' color='primary.100' fontSize='sm'>
          {token} Balance
        </Text>
      </Flex>
      <Text fontWeight='bold' fontSize='xl'>
        {balance}
      </Text>
    </Box>
  );
}

export default SideInfoBalanceItem;
