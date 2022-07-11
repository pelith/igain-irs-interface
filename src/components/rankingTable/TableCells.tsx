import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import RankMedal from '../referral/RankMedal';

export function FontWeightCell(props: any) {
  return <Text fontWeight='bold'>{props.cell.value}</Text>;
}

export function RankMedalCell(props: any) {
  return <RankMedal rank={props.cell.value} size='2.25rem' />;
}

export function MobileInviteesCell(props: any) {
  return (
    <Flex direction='column' align='center'>
      <Text fontWeight='bold'>{props.cell.value}</Text>
      <Text align='center' fontSize='xs' color='primary.100'>
        Referred
        <br />
        People
      </Text>
    </Flex>
  );
}

export function MobileTxVolumeAndAddressCell(props: any) {
  return (
    <Flex direction='column'>
      <Text fontWeight='bold'>{props.cell.value[0]}</Text>
      <Text fontSize='xs' color='primary.100' mb='0.25rem'>
        Volume
      </Text>
      <Text fontSize='sm'>{props.cell.value[1]}</Text>
    </Flex>
  );
}
