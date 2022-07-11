import { ChainId } from '..';
import { PositionToken } from './positionToken';
import ProtocolType from './protocolType';
import BaseTokenType from './baseTokenType';
import { DEV_MULTICALL_CHAIN_ID } from '..';
import { ReactComponent as IconADai } from '../../assets/tokenIcons/icon-adai.svg';
import { ReactComponent as IconAUsdc } from '../../assets/tokenIcons/icon-ausdc.svg';
import { ReactComponent as IconAUsdt } from '../../assets/tokenIcons/icon-ausdt.svg';
import { ReactComponent as IconYDai } from '../../assets/tokenIcons/icon-ydai.svg';
import { ReactComponent as IconYUsdc } from '../../assets/tokenIcons/icon-yusdc.svg';
import { ReactComponent as IconYUsdt } from '../../assets/tokenIcons/icon-yusdt.svg';
import { ReactComponent as IconYEth } from '../../assets/tokenIcons/icon-yeth.svg';

const MAINNET_POSITION = {
  [ProtocolType.AAVE]: {
    [BaseTokenType.DAI]: {
      name: 'aDAI',
      address: '0x028171bca77440897b824ca71d1c56cac55b68a3',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'aUSDC',
      address: '0xbcca60bb61934080951369a648fb03df4f96263c',
      icon: IconAUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'aUSDT',
      address: '0x3ed3b47dd13ec9a98b44e6204a523e766b225811',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
  [ProtocolType.YEARN]: {
    [BaseTokenType.DAI]: {
      name: 'yvDAI',
      address: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
      icon: IconYDai,
    },
    [BaseTokenType.USDC]: {
      name: 'yvUSDC',
      address: '0x5f18c75abdae578b483e5f43f12a39cf75b973a9',
      icon: IconYUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'yvUSDT',
      address: '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
      decimals: 6,
      icon: IconYUsdt,
    },
  },
  [ProtocolType.AAVE_V3]: {
    [BaseTokenType.DAI]: {
      name: '',
      address: '',
    },
    [BaseTokenType.USDC]: {
      name: '',
      address: '',
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: '',
      address: '',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
};

const POLYGON_POSITION = {
  [ProtocolType.AAVE]: {
    [BaseTokenType.DAI]: {
      name: 'aDAI V2',
      address: '0x27f8d03b3a2196956ed754badc28d73be8830a6e',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'aUSDC V2',
      address: '0x1a13f4ca1d028320a707d99520abfefca3998b7f',
      icon: IconAUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'aUSDT V2',
      address: '0x60d55f02a771d515e077c9c2403a1ef324885cec',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
  [ProtocolType.YEARN]: {
    [BaseTokenType.DAI]: {
      name: '',
      address: '',
    },
    [BaseTokenType.USDC]: {
      name: '',
      address: '',
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: '',
      address: '',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
  [ProtocolType.AAVE_V3]: {
    [BaseTokenType.DAI]: {
      name: 'aDAI V3',
      address: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'aUSDC V3',
      address: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
      decimals: 6,
      icon: IconAUsdc,
    },
    [BaseTokenType.USDT]: {
      name: 'aUSDT V3',
      address: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
};

const FANTOM_POSITION = {
  [ProtocolType.AAVE]: {
    [BaseTokenType.DAI]: {
      name: 'vDAI',
      address: '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'vUSDC',
      address: '0xFCCf3cAbbe80101232d343252614b6A3eE81C989',
      icon: IconAUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'vUSDT',
      address: '0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
  [ProtocolType.YEARN]: {
    [BaseTokenType.DAI]: {
      name: 'yvDAI',
      address: '0x637eC617c86D24E421328e6CAEa1d92114892439',
      icon: IconYDai,
    },
    [BaseTokenType.USDC]: {
      name: 'yvUSDC',
      address: '0xEF0210eB96c7EB36AF8ed1c20306462764935607',
      icon: IconYUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'yvUSDT',
      address: '0x148c05caf1Bb09B5670f00D511718f733C54bC4c',
      decimals: 6,
      icon: IconYUsdt,
    },
    [BaseTokenType.ETH]: {
      name: 'yvETH',
      address: '0xCe2Fc0bDc18BD6a4d9A725791A3DEe33F3a23BB7',
      decimals: 18,
      icon: IconYEth,
    },
  },
  [ProtocolType.AAVE_V3]: {
    [BaseTokenType.DAI]: {
      name: 'aDAI V3',
      address: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'aUSDC V3',
      address: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
      decimals: 6,
      icon: IconAUsdc,
    },
    [BaseTokenType.USDT]: {
      name: 'aUSDT V3',
      address: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
};

export const IGAIN_POSITION: {
  [chainId in ChainId]: { [protocol in ProtocolType]: { [baseToken in BaseTokenType]?: PositionToken } };
} = {
  [ChainId.MAINNET]: MAINNET_POSITION,
  [ChainId.POLYGON]: POLYGON_POSITION,
  [ChainId.FANTOM]: FANTOM_POSITION,
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? POLYGON_POSITION
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? FANTOM_POSITION
      : MAINNET_POSITION,
};
