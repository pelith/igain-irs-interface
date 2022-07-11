import React, { useMemo } from 'react';
import Chart from 'kaktana-react-lightweight-charts';
import { Box, Center, HStack } from '@chakra-ui/react';
import LineChartLegend from './LineChartLegend';
import { PriceChartDataType } from '../constants/data/termHistory';

interface Props {
  chartData?: PriceChartDataType[];
}

function TermPriceTradingView({ chartData }: Props) {
  const [markPriceLine, indexPriceLine] = useMemo(() => {
    let markPriceData: { time: number; value?: number }[] = [];
    let indexPriceData: { time: number; value?: number }[] = [];
    chartData?.map((data) => {
      markPriceData.push({ time: data.timestamp, value: data.markPrice || undefined });
      indexPriceData.push({ time: data.timestamp, value: data.indexPrice || undefined });
    });

    return [markPriceData, indexPriceData];
  }, [chartData]);

  const options = useMemo(
    () => ({
      priceScale: {
        alignLabels: false,
      },
      localization: {
        dateFormat: 'yyyy/MM/dd',
        locale: 'en-US',
        priceFormatter: (price: any) => {
          return parseFloat(price).toFixed(2);
        },
      },
      layout: {
        backgroundColor: '#131833',
        textColor: '#8491B8',
        fontSize: 12,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: 'rgba(132, 145, 184, 1)',
          style: 1,
          visible: true,
        },
      },
      timeScale: {
        lockVisibleTimeRangeOnResize: true,
      },
    }),
    [],
  );

  const lineSeries = useMemo(
    () => [
      {
        data: markPriceLine,
      },
      {
        data: indexPriceLine,
      },
    ],
    [markPriceLine, indexPriceLine],
  );

  return (
    <Box>
      <Chart
        options={options}
        lineSeries={lineSeries}
        autoWidth
        height={340}
        from={markPriceLine[0]?.time}
        to={markPriceLine[markPriceLine.length - 1]?.time}
      />
      <Center mt='1.5rem'>
        <HStack spacing='2rem'>
          <LineChartLegend color='#008FFB' content='Mark Price(LONG token)' />
          <LineChartLegend color='#00E396' content='Index Price(LONG token)' />
        </HStack>
      </Center>
    </Box>
  );
}

export default TermPriceTradingView;
