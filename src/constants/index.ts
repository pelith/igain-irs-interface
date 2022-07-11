import { ReactComponent as EthChainLogo } from '../assets/netIcons/icon-chain-ethereum.svg';
import { ReactComponent as PolygonChainLogo } from '../assets/netIcons/icon-chain-polygon.svg';
import { ReactComponent as FantomChainLogo } from '../assets/netIcons/icon-chain-fantom.svg';
import { ReactComponent as EthPlainLogo } from '../assets/tokenIcons/icon-logo-eth.svg';
import BaseTokenType from './termInfo/baseTokenType';

export const ETH_BLOCKS_PER_DAY = 6570;
export const POLYGON_BLOCKS_PER_DAY = 43200;
export const FANTOM_BLOCKS_PER_DAY = 86400;

export enum ChainId {
  MAINNET = 1,
  POLYGON = 137,
  FANTOM = 250,
  FORK_MAIN_NET = 8787,
}

export const DEV_MULTICALL_CHAIN_ID = parseInt(process.env.REACT_APP_DEV_MULTICALL_ID || '0');

export const SWITCH_CHAIN_LIST = [ChainId.POLYGON, ChainId.FANTOM];

export const ALLOW_CHAIN_LIST =
  process.env.REACT_APP_ENV === 'development' ? [...SWITCH_CHAIN_LIST, ChainId.FORK_MAIN_NET] : SWITCH_CHAIN_LIST;

export const CHAIN_DISPLAY_INFO: {
  [chainId in ChainId]: {
    fullName: string;
    displayName: string;
    logo?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    plainLogo?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    bg: string;
  };
} = {
  [ChainId.MAINNET]: {
    fullName: 'Ethereum Mainnet',
    displayName: 'Ethereum',
    logo: EthChainLogo,
    plainLogo: EthPlainLogo,
    bg: 'linear(to-br, rgba(98, 126, 234), rgba(98, 126, 234, 0.6)) 60%',
  },
  [ChainId.POLYGON]: {
    fullName: 'Polygon Network',
    displayName: 'Polygon',
    logo: PolygonChainLogo,
    bg: 'linear(to-br, rgba(130, 71, 229), rgba(130, 71, 229, 0.6)) 60%',
  },
  [ChainId.FANTOM]: {
    fullName: 'Fantom',
    displayName: 'Fantom',
    logo: FantomChainLogo,
    bg: 'linear(to-br, rgba(98, 126, 234, 1), rgba(25, 105, 255, 1), rgba(25, 105, 255, 0.6))',
  },
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? {
          fullName: 'Fantom FORKED',
          displayName: 'Fantom fake',
          logo: FantomChainLogo,
          bg: 'linear(to-br, rgba(98, 126, 234, 1), rgba(25, 105, 255, 1), rgba(25, 105, 255, 0.6))',
        }
      : {
          fullName: 'Ethereum Mainnet FORKED',
          displayName: 'Ethereum fake',
          logo: EthChainLogo,
          plainLogo: EthPlainLogo,
          bg: 'linear(to-br, rgba(98, 126, 234), rgba(98, 126, 234, 0.6)) 60%',
        },
};

export const HAKKA_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0E29e5AbbB5FD88e28b2d355774e73BD47dE3bcd',
  [ChainId.POLYGON]: '0x978338A9d2d0aa2fF388d3dc98b9bF25bfF5efB4',
  [ChainId.FANTOM]: '',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0x978338A9d2d0aa2fF388d3dc98b9bF25bfF5efB4'
      : '0x0E29e5AbbB5FD88e28b2d355774e73BD47dE3bcd',
};

export const AAVE_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  [ChainId.POLYGON]: '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf',
  [ChainId.FANTOM]: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf'
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
      : '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
};

export const AAVE_V3_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: '',
  [ChainId.POLYGON]: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
  [ChainId.FANTOM]: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
      : '',
};

export const AAVE_UI_POOL_PROVIDER: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: '',
  [ChainId.POLYGON]: '0x8F1AD487C9413d7e81aB5B4E88B024Ae3b5637D0',
  [ChainId.FANTOM]: '0x1CCbfeC508da8D5242D5C1b368694Ab0066b39f1',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0x8F1AD487C9413d7e81aB5B4E88B024Ae3b5637D0'
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? '0x1CCbfeC508da8D5242D5C1b368694Ab0066b39f1'
      : '',
};

export const AAVE_POOL_ADDRESS_PROVIDER: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: '',
  [ChainId.POLYGON]: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  [ChainId.FANTOM]: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb'
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb'
      : '',
};

export const AAVE_V3_ORACLE_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: '',
  [ChainId.POLYGON]: '0xb023e699F5a33916Ea823A16485e259257cA8Bd1',
  [ChainId.FANTOM]: '0xfd6f3c1845604C8AE6c6E402ad17fb9885160754',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0xb023e699F5a33916Ea823A16485e259257cA8Bd1'
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? '0xfd6f3c1845604C8AE6c6E402ad17fb9885160754'
      : '',
};

export const REGISTER_REFERRAL_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: '',
  [ChainId.POLYGON]: '0xC6D4910f9129feFFdD4416A4e2cD4f44016f16cE',
  [ChainId.FANTOM]: '',
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? '0xd93d22aFcad4DF89238AEbC53d9e9466CCB58065'
      : '0xd93d22aFcad4DF89238AEbC53d9e9466CCB58065',
};

export const LENDING_APY_PARAMS_AAVE: {
  [baseTokenType in BaseTokenType]?: any;
} = {
  [BaseTokenType.DAI]: {
    optimal: 0.8,
    slope1: 0.04,
    slope2: 0.75,
    reserve: 0.1,
  },
  [BaseTokenType.USDC]: {
    optimal: 0.9,
    slope1: 0.04,
    slope2: 0.6,
    reserve: 0.1,
  },
  [BaseTokenType.USDT]: {
    optimal: 0.9,
    slope1: 0.04,
    slope2: 0.6,
    reserve: 0.1,
  },
};

export const YEAR_SECONDS = 31557600; // 365.25*24*60*60

export const INVITE_CODE_URL_PARAMS_KEY = 'invite_code';
