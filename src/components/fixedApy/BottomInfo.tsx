import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import { ResponsiveView } from '../../constants/responsive';
import EstimatedApyType from '../../constants/termInfo/estimatedApyType';
import ProtocolType from '../../constants/termInfo/protocolType';
import useWindowSize from '../../hooks/useWindowSize';
import IntroList from '../IntroList';
import { TokenIntro } from './TokenIntro';

interface Props {
  estimatedApyType: EstimatedApyType;
  protocolType?: ProtocolType;
}

export const BottomInfo = ({ estimatedApyType, protocolType }: Props) => {
  const windowSize = useWindowSize();
  return (
    <VStack
      maxW='343px'
      my='2.5rem'
      spacing='40px'
      alignItems='start'
      alignSelf='center'
      hidden={windowSize === ResponsiveView.WEB}
    >
      <TokenIntro estimatedApyType={estimatedApyType} />
      <Box ml='1rem'>
        <IntroList estimatedApyType={estimatedApyType} protocolType={protocolType} />
      </Box>
    </VStack>
  );
};
