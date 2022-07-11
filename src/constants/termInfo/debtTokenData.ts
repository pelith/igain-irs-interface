import { ChainId } from '..';
import { DebtToken } from './debtToken';
import ProtocolType from './protocolType';
import BaseTokenType from './baseTokenType';
import { DEV_MULTICALL_CHAIN_ID } from '..';
import { ReactComponent as IconADai } from '../../assets/tokenIcons/icon-adai.svg';
import { ReactComponent as IconAUsdc } from '../../assets/tokenIcons/icon-ausdc.svg';
import { ReactComponent as IconAUsdt } from '../../assets/tokenIcons/icon-ausdt.svg';
import { ReactComponent as IconYDai } from '../../assets/tokenIcons/icon-ydai.svg';
import { ReactComponent as IconYUsdc } from '../../assets/tokenIcons/icon-yusdc.svg';
import { ReactComponent as IconYUsdt } from '../../assets/tokenIcons/icon-yusdt.svg';

const MAINNET_DEBT = {
  [ProtocolType.AAVE]: {
    [BaseTokenType.DAI]: {
      name: 'Aave variable debt bearing DAI',
      address: '0x6C3c78838c761c6Ac7bE9F59fe808ea2A6E4379d',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'Aave variable debt bearing USDC',
      address: '0x619beb58998eD2278e08620f97007e1116D5D25b',
      icon: IconAUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'Aave variable debt bearing USDT',
      address: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
  [ProtocolType.YEARN]: {
    [BaseTokenType.DAI]: {
      name: '',
      address: '',
      icon: IconYDai,
    },
    [BaseTokenType.USDC]: {
      name: '',
      address: '',
      icon: IconYUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: '',
      address: '',
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

const POLYGON_DEBT = {
  [ProtocolType.AAVE]: {
    [BaseTokenType.DAI]: {
      name: 'Aave Matic Market variable debt mDAI',
      address: '0x75c4d1Fb84429023170086f06E682DcbBF537b7d',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'Aave Matic Market variable debt mUSDC',
      address: '0x248960A9d75EdFa3de94F7193eae3161Eb349a12',
      icon: IconAUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'Aave Matic Market variable debt mUSDT',
      address: '0x8038857FD47108A07d1f6Bf652ef1cBeC279A2f3',
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
      name: 'DAI-VariableDebtToken-Polygon',
      address: '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'USDC-VariableDebtToken-Polygon',
      address: '0xFCCf3cAbbe80101232d343252614b6A3eE81C989',
      decimals: 6,
      icon: IconAUsdc,
    },
    [BaseTokenType.USDT]: {
      name: 'USDT-VariableDebtToken-Polygon',
      address: '0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
};

const FANTOM_DEBT = {
  [ProtocolType.AAVE]: {
    [BaseTokenType.DAI]: {
      name: 'Aave Fantom Variable Debt DAI',
      address: '',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'Aave Fantom Variable Debt USDC',
      address: '',
      icon: IconAUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: 'Aave Fantom Variable Debt USDT',
      address: '',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
  [ProtocolType.YEARN]: {
    [BaseTokenType.DAI]: {
      name: '',
      address: '',
      icon: IconYDai,
    },
    [BaseTokenType.USDC]: {
      name: '',
      address: '',
      icon: IconYUsdc,
      decimals: 6,
    },
    [BaseTokenType.USDT]: {
      name: '',
      address: '',
      decimals: 6,
      icon: IconYUsdt,
    },
  },
  [ProtocolType.AAVE_V3]: {
    [BaseTokenType.DAI]: {
      name: 'DAI-VariableDebtToken-Fantom',
      address: '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC',
      icon: IconADai,
    },
    [BaseTokenType.USDC]: {
      name: 'USDC-VariableDebtToken-Fantom',
      address: '0xFCCf3cAbbe80101232d343252614b6A3eE81C989',
      decimals: 6,
      icon: IconAUsdc,
    },
    [BaseTokenType.USDT]: {
      name: 'USDT-VariableDebtToken-Fantom',
      address: '0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7',
      decimals: 6,
      icon: IconAUsdt,
    },
  },
};

export const IGAIN_DEBT: {
  [chainId in ChainId]: { [protocol in ProtocolType]: { [baseToken in BaseTokenType]?: DebtToken } };
} = {
  [ChainId.MAINNET]: MAINNET_DEBT,
  [ChainId.POLYGON]: POLYGON_DEBT,
  [ChainId.FANTOM]: FANTOM_DEBT,
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? POLYGON_DEBT
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? FANTOM_DEBT
      : MAINNET_DEBT,
};
