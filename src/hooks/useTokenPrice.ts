import useSWR from 'swr';
import { jsonFetcher } from '../utils/fetch';

export default function useTokenPrice(token: string) {
  const { data } = useSWR(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`, jsonFetcher);
  return data || {};
}
