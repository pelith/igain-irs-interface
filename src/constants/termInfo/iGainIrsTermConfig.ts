import BaseTokenType from './baseTokenType';
import IGainIrsTermParams from './iGainIrsTermParams';

export interface PartialTermConfigType {
  deployBlock: number;
  farmAddress?: string;
}
interface TermConfigType extends PartialTermConfigType {
  contractAddress: string;
  longTokenAddress: string;
  shortTokenAddress: string;
  lendProxyAddress?: string;
  borrowProxyAddress?: string;
  farmProxy?: string;
  aggregatedProxy?: string;
}
interface IGainIrsTermConfig extends IGainIrsTermParams {
  baseTokenType: BaseTokenType;
  lendProxyAddress?: string;
  borrowProxyAddress?: string;
}

export type { TermConfigType };
export default IGainIrsTermConfig;
