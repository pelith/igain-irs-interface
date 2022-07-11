import React from 'react';
import { Flex, Text, Box, Button } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import BaseTokenType from '../../constants/termInfo/baseTokenType';
import ProtocolType, { PROTOCOL_DATA } from '../../constants/termInfo/protocolType';
import { formatPercentage, transformDateYearToDate } from '../../utils';
import CountDownInfo from '../CountDownInfo';
import { ReactComponent as IconArrowRight } from '../../assets/icon-arrow-right.svg';
import { ReactComponent as IconHakka } from '../../assets/tokenIcons/icon-hakka.svg';
import { INTERNAL_PATH } from '../../constants/links';
import CommonSkeleton from '../common/CommonSkeleton';

const renderIconTitle = (content: string, Icon?: any) => (
  <Flex align='center'>
    <Icon />
    <Text pl='0.5rem' fontWeight='bold'>
      {content}
    </Text>
  </Flex>
);

const renderPositionValue = (longValue: string, shortValue: string, valuationToken?: string) => (
  <Box fontSize='sm' maxW='140px'>
    <Flex justify='space-between' color={parseFloat(longValue) > 0 ? 'neutral' : 'primary.100'}>
      <Text as='span'>LONG</Text>
      <Box>
        <Text as='span' pr='6px' fontWeight='bold'>
          {longValue}
        </Text>
        <Text as='span' color='primary.100'>
          {valuationToken}
        </Text>
      </Box>
    </Flex>
    <Flex justify='space-between' color={parseFloat(shortValue) > 0 ? 'neutral' : 'primary.100'}>
      <Text as='span'>SHORT</Text>
      <Box>
        <Text as='span' pr='6px' fontWeight='bold'>
          {shortValue}
        </Text>
        <Text as='span' color='primary.100'>
          {valuationToken}
        </Text>
      </Box>
    </Flex>
  </Box>
);

const renderBalanceAmount = (longValue: string, shortValue: string) => {
  const longValueColor = parseFloat(longValue) > 0 ? 'neutral' : 'primary.100';
  const shortValueColor = parseFloat(shortValue) > 0 ? 'neutral' : 'primary.100';
  return (
    <Flex fontSize='sm'>
      <Box pr='1rem'>
        <Text color={longValueColor}>LONG</Text>
        <Text color={shortValueColor}>SHORT</Text>
      </Box>
      <Box fontWeight='bold'>
        <Text color={longValueColor}>{longValue}</Text>
        <Text color={shortValueColor}>{shortValue}</Text>
      </Box>
    </Flex>
  );
};

const renderExpiryTime = (expiryTime: number) => {
  return (
    <div>
      {expiryTime * 1000 < Date.now() ? (
        <Text fontSize='md' fontWeight='bold' color='secondary.500'>
          Expired
        </Text>
      ) : (
        <CountDownInfo countdownTime={expiryTime * 1000} />
      )}
      <Text pt='4px'>{transformDateYearToDate(expiryTime * 1000)}</Text>
    </div>
  );
};

export function BaseTokenCell(props: any) {
  return renderIconTitle(props.cell.value, BASE_TOKEN_DATA[props.cell.value as BaseTokenType].Icon);
}

export function ExpiryCell(props: any) {
  return renderExpiryTime(props.cell.value);
}

export function MarkPriceCell(props: any) {
  return renderPositionValue(props.cell.value[0], props.cell.value[1], props.cell.row.values.baseToken);
}

export function BalanceCell(props: any) {
  return renderBalanceAmount(props.cell.value[0], props.cell.value[1]);
}

export function ProxyIconCell(props: any) {
  const Icon = PROTOCOL_DATA[props.row.original.proxyType as ProtocolType].Icon;
  return <Icon />;
}

export function TableBtnCell(props: any) {
  const isExpiry = props.row.original.expiryTime * 1000 < Date.now();
  return (
    <Button
      as={ReachLink}
      to={isExpiry ? INTERNAL_PATH.PORTFOLIO : props.cell.value}
      variant='iconBtn'
      size='iconBtnLg'
      colorScheme={isExpiry ? 'secondary' : 'accent'}
    >
      <IconArrowRight />
    </Button>
  );
}

export function FarmingCell(props: any) {
  return (
    <Box>
      {props.cell.value && (
        <Flex align='center'>
          <IconHakka />
          <Text pl='8px'>HAKKA</Text>
        </Flex>
      )}
    </Box>
  );
}

export function MarkApyCell(props: any) {
  if (props.cell.value?.isExpired) {
    return <Box />;
  }
  return (
    <CommonSkeleton isLoaded={props.cell.value?.apy !== '-'}>
      <Box>{formatPercentage(props.cell.value?.apy)}%</Box>
    </CommonSkeleton>
  );
}

export function TotalApyCell(props: any) {
  const isExpired = props.row.original.expiryTime * 1000 < Date.now();
  if (isExpired) {
    return <Box />;
  }
  return (
    <CommonSkeleton isLoaded={!!props.cell.value}>
      <Box>
        <Text fontSize='md' fontWeight='bold'>
          {formatPercentage(props.cell.value && props.cell.value[0])}%
        </Text>
        {props.row.original.farmingAddress && props.cell.value && (
          <Text fontSize='xs' fontWeight='bold' maxW='200px'>
            {`(Base ${formatPercentage(props.cell.value[1])}% ${
              parseFloat(props.cell.value[3] || '0') > 0 ? ` + Yearn ${props.cell.value[3]}%` : ''
            } + Reward 
            ${formatPercentage(props.cell.value[2])}%)`}
          </Text>
        )}
      </Box>
    </CommonSkeleton>
  );
}

export function VolumeCell(props: any) {
  if (props.cell.value) {
    return (
      <CommonSkeleton minW='100px' isLoaded={props.cell.value !== '-'}>
        {props.cell.value}
      </CommonSkeleton>
    );
  }
  return <></>;
}
