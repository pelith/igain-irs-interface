import BaseTokenType from './termInfo/baseTokenType';
import ProtocolType from './termInfo/protocolType';

export interface TradePageDataProps {
  proxyType: ProtocolType;
  baseToken: BaseTokenType;
  expiryTime: number;
  markApy: { apy: string; isExpired: boolean };
  markPrice: string[];
  leverage: number | string;
  balance: (string | undefined)[];
  detailPath: string;
}

export interface PoolPageDataProps {
  proxyType: ProtocolType;
  baseToken: BaseTokenType;
  expiryTime: number;
  apy?: string[];
  volume: string;
  farmingAddress?: string;
  balance?: string;
  detailPath: string;
}
