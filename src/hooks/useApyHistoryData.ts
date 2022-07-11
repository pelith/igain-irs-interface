import useSWR from 'swr';
import { ChainId } from '../constants';
import { TermHistoryChartDataType } from '../constants/data/termHistory';
import { jsonFetcher } from '../utils/fetch';

interface IHistoryApiResult extends TermHistoryChartDataType {
  blockNumber: number;
}

export default function useApyHistoryData(chainId: ChainId, address: string): IHistoryApiResult[] {
  if (!process.env.REACT_APP_CHART_API) {
    return [];
  }
  const { data: chartData } = useSWR(
    `${process.env.REACT_APP_CHART_API}/term/${chainId.toString()}/${address}`,
    jsonFetcher,
    { refreshInterval: 1500 },
  );
  return chartData ? chartData : [];
}
