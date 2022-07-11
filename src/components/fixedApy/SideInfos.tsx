import React, { ReactElement } from 'react';
import { Box, Text, Flex, VStack, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';

import { ReactComponent as ExclamationCircleIcon } from '../../assets/icon-exclamation-circle.svg';
import IntroList from '../IntroList';
import { formatPercentage, formatZeroOrUndefined } from '../../utils';
import { TokenIntro } from './TokenIntro';
import { ResponsiveView } from '../../constants/responsive';
import useWindowSize from '../../hooks/useWindowSize';
import CommonSkeleton from '../common/CommonSkeleton';
import EstimatedApyType from '../../constants/termInfo/estimatedApyType';
import ProtocolType from '../../constants/termInfo/protocolType';

interface FixedApySideInfoProps {
  fixedApy?: number;
  isIncludeSlippage: boolean;
  estimatedApyType: EstimatedApyType;
  protocolType?: ProtocolType;
}

function FixedApySideInfo({
  isIncludeSlippage,
  fixedApy,
  estimatedApyType,
  protocolType,
}: FixedApySideInfoProps): ReactElement {
  const windowSize = useWindowSize();

  return (
    <Flex py='2rem' direction='column' h='100%' alignItems={{ base: 'center', lg: 'start' }}>
      <Text fontSize='xl' fontWeight='bold' color='primary.100'>
        Estimated fixed APY:
      </Text>
      <CommonSkeleton isLoaded={fixedApy !== undefined} minW='120px'>
        <Text fontSize='4xl' as='h1' fontWeight='700'>
          {formatPercentage(formatZeroOrUndefined(fixedApy, 2))}%
        </Text>
      </CommonSkeleton>
      <Box hidden={!isIncludeSlippage}>
        <Tag size='md' color='accent.500' borderRadius='full' my='1rem' bg='rgba(71, 140, 255, 0.2)'>
          <TagLeftIcon boxSize='10px' as={ExclamationCircleIcon} />
          <TagLabel mr='0.25rem' fontSize='xs' fontWeight='bold'>
            Slippage included
          </TagLabel>
        </Tag>
      </Box>
      <VStack mt='auto' spacing='60px' alignItems='start' hidden={windowSize === ResponsiveView.MOBILE}>
        <TokenIntro estimatedApyType={estimatedApyType} />
        <Box ml='1rem'>
          <IntroList estimatedApyType={estimatedApyType} protocolType={protocolType} />
        </Box>
      </VStack>
    </Flex>
  );
}

export default FixedApySideInfo;
