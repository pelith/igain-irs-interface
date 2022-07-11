import React, { ReactElement, useMemo, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import TermApyTradingView from './TermApyTradingView';
import TermPriceTradingView from './TermPriceTradingView';
import { TermHistoryChartDataType } from '../constants/data/termHistory';

export enum LineChartOptionsTypes {
  APY_TREND = 'apyTrend',
  PRICE_TREND = 'priceTrend',
}

interface Props {
  chartData?: TermHistoryChartDataType[];
  defaultChartType: LineChartOptionsTypes;
}

interface ChartSwitchBtnProps {
  lineChartOption: LineChartOptionsTypes;
  setLineChartOption: (input: LineChartOptionsTypes) => void;
  chartDataType: LineChartOptionsTypes;
  content: string;
}

const ChartSwitchBtn = ({ lineChartOption, setLineChartOption, chartDataType, content }: ChartSwitchBtnProps) => {
  return (
    <Box
      onClick={() => setLineChartOption(chartDataType)}
      p='8px 12px'
      borderRadius='8px'
      bg={lineChartOption === chartDataType ? 'primary.300-60' : ''}
      fontWeight={lineChartOption === chartDataType ? '700' : '500'}
      color={lineChartOption === chartDataType ? 'neutral' : ''}
      _hover={{ cursor: 'pointer' }}
    >
      <Text>{content}</Text>
    </Box>
  );
};

function LineChartWrapper({ chartData, defaultChartType }: Props): ReactElement {
  const [lineChartOption, setLineChartOption] = useState<LineChartOptionsTypes>(defaultChartType);
  const filteredApyChartData = useMemo(() => {
    const firstNoneZeroIndex = chartData?.findIndex((dataPoint) => dataPoint.indexApy > 0);
    return chartData?.slice(firstNoneZeroIndex) || [];
  }, [chartData]);
  const filteredPriceChartData = useMemo(() => {
    const firstNoneZeroIndex = chartData?.findIndex((dataPoint) => dataPoint.indexPrice > 0);
    return chartData?.slice(firstNoneZeroIndex) || [];
  }, [chartData]);

  return (
    <Box
      p={{ base: '18px 20px 24px 16px', lg: '24px 24px 24px 32px' }}
      bg='primary.700'
      borderTop='2px solid'
      borderColor='primary.900'
      borderBottomRadius='0.5rem'
    >
      <Flex mb='1.5rem' color='primary.100' fontSize='sm'>
        <ChartSwitchBtn
          lineChartOption={lineChartOption}
          setLineChartOption={setLineChartOption}
          chartDataType={LineChartOptionsTypes.APY_TREND}
          content='APY Trend'
        />
        <ChartSwitchBtn
          lineChartOption={lineChartOption}
          setLineChartOption={setLineChartOption}
          chartDataType={LineChartOptionsTypes.PRICE_TREND}
          content='Price Trend'
        />
      </Flex>
      {lineChartOption === LineChartOptionsTypes.APY_TREND ? (
        <TermApyTradingView chartData={filteredApyChartData} />
      ) : (
        <TermPriceTradingView chartData={filteredPriceChartData} />
      )}
    </Box>
  );
}

export default LineChartWrapper;
