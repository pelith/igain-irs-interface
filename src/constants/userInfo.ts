import { BigNumber } from '@ethersproject/bignumber';
import ProtocolType from './termInfo/protocolType';

interface UserInfo {
  address: string;
  protocolType: ProtocolType;
  lpBalance: BigNumber;
  longBalance: BigNumber;
  shortBalance: BigNumber;
  decimals: BigNumber;
  baseTokenBalance: BigNumber;
  longContract: string;
  shortContract: string;
  farmBalance?: BigNumber;
  farmContract?: string;
}

export type { UserInfo };
