import { ChainId, DEV_MULTICALL_CHAIN_ID } from '..';
import { ReactComponent as IconYDai } from '../../assets/tokenIcons/icon-ydai.svg';
import { ReactComponent as IconYUsdc } from '../../assets/tokenIcons/icon-yusdc.svg';
import { ReactComponent as IconYUsdt } from '../../assets/tokenIcons/icon-yusdt.svg';
import { ReactComponent as IconYEth } from '../../assets/tokenIcons/icon-yeth.svg';
import BaseTokenType from './baseTokenType';
import YvTokenType from './yvTokenType';

export interface YvTokenDataType {
  Icon: any;
  fullName: string;
  name: string;
  decimals: number;
  address: { [chain in ChainId]: string };
  baseTokenAddress: { [chain in ChainId]: string };
}

const Y_VAULT_TOKEN_DATA: {
  [yvTokenType in YvTokenType]: YvTokenDataType;
} = {
  [YvTokenType.Y_DAI]: {
    Icon: IconYDai,
    name: 'yvDAI',
    fullName: 'DAI yVault',
    decimals: 18,
    baseTokenAddress: {
      [ChainId.MAINNET]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'
          : '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    address: {
      [ChainId.MAINNET]: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0x637eC617c86D24E421328e6CAEa1d92114892439',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x637eC617c86D24E421328e6CAEa1d92114892439'
          : '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
    },
  },
  [YvTokenType.Y_USDC]: {
    Icon: IconYUsdc,
    name: 'yvUSDC',
    fullName: 'USDC yVault',
    decimals: 6,
    baseTokenAddress: {
      [ChainId.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75'
          : '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    address: {
      [ChainId.MAINNET]: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0xEF0210eB96c7EB36AF8ed1c20306462764935607',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0xEF0210eB96c7EB36AF8ed1c20306462764935607'
          : '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
    },
  },
  [YvTokenType.Y_USDT]: {
    Icon: IconYUsdt,
    name: 'yvUSDT',
    fullName: 'USDT yVault',
    decimals: 18,
    baseTokenAddress: {
      [ChainId.MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x049d68029688eAbF473097a2fC38ef61633A3C7A'
          : '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    address: {
      [ChainId.MAINNET]: '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0x148c05caf1Bb09B5670f00D511718f733C54bC4c',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x148c05caf1Bb09B5670f00D511718f733C54bC4c'
          : '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
    },
  },
  [YvTokenType.Y_ETH]: {
    Icon: IconYEth,
    name: 'yvETH',
    fullName: 'WETH yVault',
    decimals: 18,
    baseTokenAddress: {
      [ChainId.MAINNET]: '',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x74b23882a30290451A17c44f4F05243b6b58C76d'
          : '',
    },
    address: {
      [ChainId.MAINNET]: '',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '0xCe2Fc0bDc18BD6a4d9A725791A3DEe33F3a23BB7',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? ''
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0xCe2Fc0bDc18BD6a4d9A725791A3DEe33F3a23BB7'
          : '',
    },
  },
};

const Y_VAULT_BASE_TOKEN_MAP: {
  [baseToken in BaseTokenType]?: YvTokenType;
} = {
  [BaseTokenType.DAI]: YvTokenType.Y_DAI,
  [BaseTokenType.USDC]: YvTokenType.Y_USDC,
  [BaseTokenType.USDT]: YvTokenType.Y_USDT,
  [BaseTokenType.ETH]: YvTokenType.Y_ETH,
};

const getBaseTokenAddress: (chainId: ChainId, yvTokenAddress?: string) => string | undefined = (
  chainId,
  yvTokenAddress,
) => {
  if (!yvTokenAddress) {
    return;
  }
  for (const [, tokenInfo] of Object.entries(Y_VAULT_TOKEN_DATA)) {
    if (Object.values(tokenInfo.address).includes(yvTokenAddress)) {
      return tokenInfo.baseTokenAddress[chainId];
    }
  }
};

const getYvTokenAddressByAddress: (chainId: ChainId, baseTokenAddress?: string) => string | undefined = (
  chainId,
  baseTokenAddress,
) => {
  if (!baseTokenAddress) {
    return;
  }
  for (const [, tokenInfo] of Object.entries(Y_VAULT_TOKEN_DATA)) {
    if (Object.values(tokenInfo.baseTokenAddress).includes(baseTokenAddress)) {
      return tokenInfo.address[chainId];
    }
  }
};

const getYvTokenAddressByType: (chainId?: ChainId, baseTokenType?: BaseTokenType) => string | undefined = (
  chainId,
  baseTokenType,
) => {
  if (!baseTokenType || !chainId) {
    return;
  }
  const yvTokenType = Y_VAULT_BASE_TOKEN_MAP[baseTokenType];
  if (!yvTokenType) {
    return;
  }
  return Y_VAULT_TOKEN_DATA?.[yvTokenType].address[chainId];
};

const getYvTokenInfoByType: (chainId?: ChainId, baseTokenType?: BaseTokenType) => YvTokenDataType | undefined = (
  chainId,
  baseTokenType,
) => {
  if (!baseTokenType || !chainId) {
    return;
  }
  const yvTokenType = Y_VAULT_BASE_TOKEN_MAP[baseTokenType];
  if (!yvTokenType) {
    return;
  }
  return Y_VAULT_TOKEN_DATA?.[yvTokenType];
};

export {
  getBaseTokenAddress,
  getYvTokenAddressByType,
  getYvTokenAddressByAddress,
  getYvTokenInfoByType,
  Y_VAULT_BASE_TOKEN_MAP,
};

export default Y_VAULT_TOKEN_DATA;
