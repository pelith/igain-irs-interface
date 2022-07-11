import { ChainId, DEV_MULTICALL_CHAIN_ID } from '..';
import ProtocolType from './protocolType';

export type ProtocolFactoryMap = {
  [protocolType in ProtocolType]?: string;
};

export type ProtocolProxyMap = {
  [protocolType in ProtocolType]?: string;
};

const IGAIN_FACTORY: {
  [chainId in ChainId]?: ProtocolFactoryMap;
} = {
  [ChainId.MAINNET]: {
    [ProtocolType.AAVE_V3]: '',
    [ProtocolType.YEARN]: '',
  },
  [ChainId.POLYGON]: {
    [ProtocolType.AAVE_V3]: '0xc28b6ead7145218cb2b98d7b07e07c67f1ddf832',
  },
  [ChainId.FANTOM]: {
    [ProtocolType.AAVE]: '',
    [ProtocolType.YEARN]: '0x6ac0Ad00A7002047c49d289Ac9E87Cf087CE5529',
  },
  [ChainId.FORK_MAIN_NET]: {
    [ProtocolType.AAVE_V3]:
      DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
        ? '0x92942A8A3863b405983D83c7F61F24Bc2926F2D0'
        : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
        ? ''
        : '',
    [ProtocolType.YEARN]:
      DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
        ? ''
        : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
        ? '0x4da7745993E76929Ba11fDa60cAF671e8161F0fa'
        : '0x92942A8A3863b405983D83c7F61F24Bc2926F2D0',
  },
};

const IGAIN_AGGREGATE_PROXY: {
  [chainId in ChainId]?: ProtocolFactoryMap;
} = {
  [ChainId.MAINNET]: {
    [ProtocolType.AAVE_V3]: '',
    [ProtocolType.YEARN]: '',
  },
  [ChainId.POLYGON]: {
    [ProtocolType.AAVE_V3]: '0xb82fD60F6473Db594E44E35F543A639E9531E249',
  },
  [ChainId.FANTOM]: {
    [ProtocolType.YEARN]: '0x6cd37c981ceb1B951f1352E6849a30D567cbe748',
  },
  [ChainId.FORK_MAIN_NET]: {
    [ProtocolType.AAVE_V3]:
      DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
        ? '0x75556cc6e95Cf07E5B75f6eBD4aF67879a98Bf07'
        : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
        ? '0x5Cce059c76d99b088EEa9AA31a6EC19721F52Ccc'
        : '',
    [ProtocolType.YEARN]:
      DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
        ? ''
        : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
        ? '0x8FBC8Ab85ce92Da953cd1d0b4FdA00C9a182B093'
        : '0x1D17dAFF076a31ebb244d372C352F8563b563C45',
  },
};

export { IGAIN_FACTORY, IGAIN_AGGREGATE_PROXY };
