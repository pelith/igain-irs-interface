import React, { useMemo } from 'react';
import Chart from 'kaktana-react-lightweight-charts';
import { Box, Center, HStack } from '@chakra-ui/react';
import LineChartLegend from './LineChartLegend';
import { ApyChartDataType } from '../constants/data/termHistory';

interface Props {
  chartData?: ApyChartDataType[];
}

function TermApyTradingView({ chartData }: Props) {
  const [markApyLine, indexApyLine] = useMemo(() => {
    let markApyData: { time: number; value?: number }[] = [];
    let indexApyData: { time: number; value?: number }[] = [];
    chartData?.map((data) => {
      markApyData.push({ time: data.timestamp, value: data.markApy || undefined });
      indexApyData.push({ time: data.timestamp, value: data.indexApy || undefined });
    });

    return [markApyData, indexApyData];
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
          return parseFloat(price).toFixed(2) + '%';
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
        data: markApyLine,
      },
      {
        data: indexApyLine,
      },
    ],
    [markApyLine, indexApyLine],
  );

  return (
    <Box>
      <Chart
        options={options}
        lineSeries={lineSeries}
        autoWidth
        height={340}
        from={markApyLine[0]?.time}
        to={markApyLine[markApyLine.length - 1]?.time}
      />
      <Center mt='1.5rem'>
        <HStack spacing='2rem'>
          <LineChartLegend color='#008FFB' content='Mark Apy' />
          <LineChartLegend color='#00E396' content='Index Apy' />
        </HStack>
      </Center>
    </Box>
  );
}

export default TermApyTradingView;
