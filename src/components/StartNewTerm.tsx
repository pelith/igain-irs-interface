import { Box, Button, Flex, Text, Stack } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { Link as ReachLink } from 'react-router-dom';
import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconEarnFixedInterest } from '../assets/icon-earn-fixed-interest.svg';
import { ReactComponent as IconFarmYield } from '../assets/icon-farm-yield.svg';
import { ReactComponent as IconHedge } from '../assets/icon-hedge.svg';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';

interface NewTermItemProps {
  Icon: React.FunctionComponent;
  title: string;
  buttonContent: string;
  btnClickLinkTo: string;
}

const NewTermItem = ({ Icon, title, buttonContent, btnClickLinkTo }: NewTermItemProps) => {
  return (
    <Box align='center' pt={{ base: '36px', lg: '0' }} fontWeight='bold' minW='30%' fontSize='md'>
      <Icon />
      <Flex justify='center' align='center' mt='0.5rem' mb='1.5rem'>
        {title}
      </Flex>
      <Button as={ReachLink} to={btnClickLinkTo} height='56px' w='200px' variant='secondary' colorScheme='secondary'>
        <Flex align='center'>
          <Text pr='13px' fontSize='md' fontWeight='bold'>
            {buttonContent}
          </Text>
          <IconArrowRight width='14px' height='11px' />
        </Flex>
      </Button>
    </Box>
  );
};

function StartNewTerm(): ReactElement {
  return (
    <Box textAlign='center' bgColor='primary.700' px='2rem' py='40px' borderRadius='0.5rem' width='100%'>
      <Text pb={{ base: '10px', lg: '48px' }} fontSize='2xl' fontWeight='bold'>
        Start a new term
      </Text>
      <Stack direction={{ base: 'column', md: 'row' }} justify='space-between'>
        <NewTermItem
          Icon={IconEarnFixedInterest}
          title='Earn Fixed Interest'
          buttonContent='Get Fixed APY'
          btnClickLinkTo={INTERNAL_PATH.FIX_INTEREST}
        />
        <NewTermItem Icon={IconHedge} title='Hedge' buttonContent='Trade Now' btnClickLinkTo={INTERNAL_PATH.TRADE} />
        <NewTermItem
          Icon={IconFarmYield}
          title='Farm Yield'
          buttonContent='Check Pools'
          btnClickLinkTo={INTERNAL_PATH.POOL}
        />
      </Stack>
    </Box>
  );
}

export default StartNewTerm;
