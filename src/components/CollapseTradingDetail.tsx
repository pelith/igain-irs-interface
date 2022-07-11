import React from 'react';
import { Box, Collapse, Text } from '@chakra-ui/react';
import { InfoPair, InfoPairProps } from './common/InfoPair';

interface Props {
  collapseTrigger: boolean;
  headerTitle: string;
  headerContent: string;
  topSectionFooterContent?: string;
  transactionData: InfoPairProps[];
}

export const CollapseTradingDetail = ({
  collapseTrigger,
  headerTitle,
  headerContent,
  topSectionFooterContent,
  transactionData,
}: Props) => {
  return (
    <Collapse in={collapseTrigger} transition={{ enter: { duration: 0.5 }, exit: { duration: 0.5 } }}>
      <Box p='1rem' borderRadius='0.5rem' bg='primary.900'>
        <Box mb='1rem'>
          <Text fontWeight='bold' fontSize='xs'>
            {headerTitle}
          </Text>
          <Text fontWeight='bold' fontSize='2xl' color='secondary.500'>
            {headerContent}
          </Text>
          <Text fontWeight='bold' fontSize='xs'>
            {topSectionFooterContent}
          </Text>
        </Box>
        <Box>
          {transactionData.map((data, index) => (
            <InfoPair key={index} name={data.name} value={data.value} />
          ))}
        </Box>
      </Box>
    </Collapse>
  );
};
