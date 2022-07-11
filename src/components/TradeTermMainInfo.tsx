import React, { ReactElement, ReactNode } from 'react';
import { Box, Button, Flex, Text, HStack } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import CountDownInfo from './CountDownInfo';
import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconTicktack } from '../assets/icon-ticktack.svg';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';
import CommonTooltip from './CommonTooltip';
import { formatBigNumberDisplay, formatPercentage, formatZeroOrUndefined } from '../utils';
import useWindowSize from '../hooks/useWindowSize';
import { ResponsiveView } from '../constants/responsive';
import CommonSkeleton from './common/CommonSkeleton';
import { PROTOCOL_DATA } from '../constants/termInfo/protocolType';

interface Props {
  termInfo: IGainTerm | undefined;
  termChainName: string;
  indexApy: number;
  markApy?: number;
}

interface TermInfoProps {
  title: string;
  content?: ReactNode;
  toolTipsContent?: string;
}

interface ProvideLPBtnProps {
  termInfo: IGainTerm | undefined;
}

const TermInfo = ({ title, content, toolTipsContent }: TermInfoProps) => (
  <Box mr={{ base: '18px', lg: '42px' }} mb='1rem'>
    <Flex align='center'>
      <Text pr='6px' fontSize='sm' color='primary.100'>
        {title}
      </Text>
      {toolTipsContent && <CommonTooltip label={toolTipsContent} />}
    </Flex>
    <Box mt='4px'>{content}</Box>
  </Box>
);

const ProvideLPBtn = ({ termInfo }: ProvideLPBtnProps) => (
  <Button
    as={ReachLink}
    to={`${INTERNAL_PATH.POOL_DETAIL}/${termInfo?.address}`}
    variant='secondary'
    w={{ base: 'full', lg: 'unset' }}
    mt={{ base: '10px', lg: '0' }}
    rightIcon={<IconArrowRight width='14px' height='11px' />}
  >
    Provide Liquidity
  </Button>
);

function TradeTermMainInfo({ termInfo, termChainName, indexApy, markApy }: Props): ReactElement {
  const windowSize = useWindowSize();
  return (
    <Box p={{ base: '24px 24px 26px 24px', lg: '34px 34px 6px 34px' }} bg='primary.700' borderTopRadius='8px'>
      <Flex justify='space-between' mb='24px'>
        <HStack spacing='10px' align='center' color='accent.500'>
          <IconTicktack />
          {termInfo ? <CountDownInfo countdownTime={termInfo.closeTime * 1000} /> : '-'}
        </HStack>
        {windowSize === ResponsiveView.WEB && <ProvideLPBtn termInfo={termInfo} />}
      </Flex>
      <Flex flexWrap='wrap'>
        <TermInfo
          title='Mark APY'
          content={
            <CommonSkeleton isLoaded={markApy !== undefined}>
              {formatPercentage(formatZeroOrUndefined(markApy, 2))}%
            </CommonSkeleton>
          }
          toolTipsContent='Annual rate deduced from the present price of the Long token'
        />
        <TermInfo
          title='Index APY'
          content={`${formatZeroOrUndefined(indexApy, 2)}%`}
          toolTipsContent='Average annual rate calculated from the realized interest rate'
        />
        <TermInfo title='Protocol' content={termInfo?.protocolType && PROTOCOL_DATA[termInfo?.protocolType].name} />
        <TermInfo title='Leverage' content={`${formatBigNumberDisplay(termInfo?.leverage, 18, 0)}x`} />
        <TermInfo title='Based on' content={termChainName} />
      </Flex>
      {windowSize === ResponsiveView.MOBILE && <ProvideLPBtn termInfo={termInfo} />}
    </Box>
  );
}

export default TradeTermMainInfo;
