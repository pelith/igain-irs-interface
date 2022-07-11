import { ChainId } from '..';
import { TermConfigType } from './iGainIrsTermConfig';
import ProtocolType from './protocolType';
import BaseTokenType from './baseTokenType';

interface IGainIrsTermParams {
  protocolType: ProtocolType;
  baseTokenAddress: string;
  baseTokenType: BaseTokenType;
  terms: TermConfigType[];
  chainId?: ChainId;
}

export default IGainIrsTermParams;
