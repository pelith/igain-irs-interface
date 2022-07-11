import { Box, Flex, Text, Image } from '@chakra-ui/react';
import React from 'react';
import shortIcon from '../../assets/tokenIcons/icon-short.svg';
import longIcon from '../../assets/tokenIcons/icon-long.svg';
import EstimatedApyType from '../../constants/termInfo/estimatedApyType';

const TOKEN_INFO = {
  [EstimatedApyType.BORROWING]: {
    iconSrc: longIcon,
    description: 'Borrow from Aave and secure interest rates by buying LONG token',
  },
  [EstimatedApyType.LENDING]: {
    iconSrc: shortIcon,
    description: 'Lend to other platforms and secure interest rate by buying SHORT token',
  },
};
interface TokenIntroProps {
  estimatedApyType: EstimatedApyType;
}

export const TokenIntro = ({ estimatedApyType }: TokenIntroProps) => {
  return (
    <Flex>
      <Box w='1px' borderRadius='5px' bg='primary.100' mr='1rem' />
      <Box pl='5px'>
        <Image src={TOKEN_INFO[estimatedApyType].iconSrc} w='20px' h='20px' alt='short token' />
        <Text fontSize='xs' fontWeight='bold' mt='0.5rem'>
          {TOKEN_INFO[estimatedApyType].description}
        </Text>
      </Box>
    </Flex>
  );
};
