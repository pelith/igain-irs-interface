import ProtocolType from './protocolType';
import { BaseTermInfoType } from './termConfigData';

export type FactoryLengthMap = {
  [protocolType in ProtocolType]?: number;
};

export type BaseTermInfoMap = {
  [contractAddress: string]: BaseTermInfoType;
};
