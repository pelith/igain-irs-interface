import { BigNumber } from '@ethersproject/bignumber';
import BaseTokenType from './baseTokenType';
import ProtocolType from './protocolType';

interface IGainTerm {
  address: string;
  tradeBaseTokenType: BaseTokenType;
  protocolType: ProtocolType;
  openTime: number;
  closeTime: number;
  initialRate: BigNumber;
  leverage: BigNumber;
  protocolFee: BigNumber;
  poolA: BigNumber;
  poolB: BigNumber;
  bPrice: BigNumber;
  fee: BigNumber;
  lpTotalSupply: BigNumber;
  tradeBaseTokenAddress?: string;
  termBaseTokenBalance?: BigNumber;
  decimals: number;
  farmAddress?: string;
  canBuy: boolean;
}

const BIG_NUMBER_ATTRIBUTE_LIST = [
  'initialRate',
  'protocolFee',
  'poolA',
  'poolB',
  'bPrice',
  'fee',
  'lpTotalSupply',
  'baseTokenBalance',
];

interface ArchiveIGainTerm extends IGainTerm {
  archivedTime?: number;
}
export { BIG_NUMBER_ATTRIBUTE_LIST };
export type { IGainTerm, ArchiveIGainTerm };
