import BaseTokenType from './termInfo/baseTokenType';
import ProtocolType from './termInfo/protocolType';
import { ReactComponent as IconUsdc } from '../assets/tokenIcons/icon-usdc.svg';
import { ReactComponent as IconUsdt } from '../assets/tokenIcons/icon-usdt.svg';
import { ReactComponent as IconDai } from '../assets/tokenIcons/icon-dai.svg';
import { ReactComponent as IconEth } from '../assets/tokenIcons/icon-eth.svg';
import { ChainId, DEV_MULTICALL_CHAIN_ID } from '.';
import { CoinGeckoApiId } from './tokenPriceKey';

export interface BaseTokenDataType {
  Icon: any;
  fullName: string;
  name: string;
  decimals: number;
  coinGeckoApiId: CoinGeckoApiId;
  address: { [chain in ChainId]: string };
  oracle: { [chain in ChainId]: string };
  depositLinks: { [protocolType in ProtocolType]?: { [chain in ChainId]: string } };
}

const BASE_TOKEN_DATA: {
  [baseToken in BaseTokenType]: BaseTokenDataType;
} = {
  [BaseTokenType.USDT]: {
    Icon: IconUsdt,
    name: 'USDT',
    fullName: 'USD Tether',
    decimals: 6,
    coinGeckoApiId: CoinGeckoApiId.USDT,
    address: {
      [ChainId.MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [ChainId.POLYGON]: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      [ChainId.FANTOM]: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x049d68029688eAbF473097a2fC38ef61633A3C7A'
          : '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    oracle: {
      [ChainId.MAINNET]: '0xee9f2375b4bdf6387aa8265dd4fb8f16512a1d46',
      [ChainId.POLYGON]: '0xf9d5aac6e5572aefa6bd64108ff86a222f69b64d',
      [ChainId.FANTOM]: '',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? '0xf9d5aac6e5572aefa6bd64108ff86a222f69b64d'
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? ''
          : '0xee9f2375b4bdf6387aa8265dd4fb8f16512a1d46',
    },
    depositLinks: {
      [ProtocolType.AAVE]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon',
        [ChainId.FANTOM]: '',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? ''
            : '',
      },
      [ProtocolType.AAVE_V3]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon_v3',
        [ChainId.FANTOM]: 'https://app.aave.com/?marketName=proto_fantom_v3',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon_v3'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? 'https://app.aave.com/?marketName=proto_fantom_v3'
            : '',
      },
      [ProtocolType.YEARN]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: '',
        [ChainId.FORK_MAIN_NET]: 'https://yearn.finance/#/vault/0x148c05caf1Bb09B5670f00D511718f733C54bC4c',
        [ChainId.FANTOM]: 'https://yearn.finance/#/vault/0x148c05caf1Bb09B5670f00D511718f733C54bC4c',
      },
    },
  },
  [BaseTokenType.USDC]: {
    Icon: IconUsdc,
    name: 'USDC',
    fullName: 'USD Coin',
    decimals: 6,
    coinGeckoApiId: CoinGeckoApiId.USDC,
    address: {
      [ChainId.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [ChainId.POLYGON]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75'
          : '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    oracle: {
      [ChainId.MAINNET]: '0x986b5e1e1755e3c2440e960477f25201b0a8bbd4',
      [ChainId.POLYGON]: '0xefb7e6be8356ccc6827799b6a7348ee674a80eae',
      [ChainId.FANTOM]: '',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? '0xefb7e6be8356ccc6827799b6a7348ee674a80eae'
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? ''
          : '0x986b5e1e1755e3c2440e960477f25201b0a8bbd4',
    },
    depositLinks: {
      [ProtocolType.AAVE]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon',
        [ChainId.FANTOM]: '',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? ''
            : '',
      },
      [ProtocolType.AAVE_V3]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon_v3',
        [ChainId.FANTOM]: 'https://app.aave.com/?marketName=proto_fantom_v3',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon_v3'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? 'https://app.aave.com/?marketName=proto_fantom_v3'
            : '',
      },
      [ProtocolType.YEARN]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: '',
        [ChainId.FORK_MAIN_NET]: 'https://yearn.finance/#/vault/0xEF0210eB96c7EB36AF8ed1c20306462764935607',
        [ChainId.FANTOM]: 'https://yearn.finance/#/vault/0xEF0210eB96c7EB36AF8ed1c20306462764935607',
      },
    },
  },
  [BaseTokenType.DAI]: {
    Icon: IconDai,
    name: 'DAI',
    fullName: 'Dai Stablecoin',
    decimals: 18,
    coinGeckoApiId: CoinGeckoApiId.DAI,
    address: {
      [ChainId.MAINNET]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [ChainId.POLYGON]: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      [ChainId.FANTOM]: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'
          : '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    oracle: {
      [ChainId.MAINNET]: '0x773616e4d11a78f511299002da57a0a94577f1f4',
      [ChainId.POLYGON]: '0xfc539a559e170f848323e19dfd66007520510085',
      [ChainId.FANTOM]: '',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
          ? '0xfc539a559e170f848323e19dfd66007520510085'
          : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
          ? ''
          : '0x773616e4d11a78f511299002da57a0a94577f1f4',
    },
    depositLinks: {
      [ProtocolType.AAVE]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon',
        [ChainId.FANTOM]: '',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? ''
            : '',
      },
      [ProtocolType.AAVE_V3]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon_v3',
        [ChainId.FANTOM]: 'https://app.aave.com/?marketName=proto_fantom_v3',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon_v3'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? 'https://app.aave.com/?marketName=proto_fantom_v3'
            : '',
      },
      [ProtocolType.YEARN]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: '',
        [ChainId.FORK_MAIN_NET]: 'https://yearn.finance/#/vault/0x637eC617c86D24E421328e6CAEa1d92114892439',
        [ChainId.FANTOM]: 'https://yearn.finance/#/vault/0x637eC617c86D24E421328e6CAEa1d92114892439',
      },
    },
  },
  [BaseTokenType.ETH]: {
    Icon: IconEth,
    name: 'ETH',
    fullName: 'Wrapped Ethereum',
    decimals: 18,
    coinGeckoApiId: CoinGeckoApiId.ETH,
    address: {
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
    oracle: {
      [ChainId.MAINNET]: '',
      [ChainId.POLYGON]: '',
      [ChainId.FANTOM]: '',
      [ChainId.FORK_MAIN_NET]:
        DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON ? '' : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM ? '' : '',
    },
    depositLinks: {
      [ProtocolType.AAVE]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon',
        [ChainId.FANTOM]: '',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? ''
            : '',
      },
      [ProtocolType.AAVE_V3]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: 'https://app.aave.com/?marketName=proto_polygon_v3',
        [ChainId.FANTOM]: 'https://app.aave.com/?marketName=proto_fantom_v3',
        [ChainId.FORK_MAIN_NET]:
          DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
            ? 'https://app.aave.com/?marketName=proto_polygon_v3'
            : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
            ? 'https://app.aave.com/?marketName=proto_fantom_v3'
            : '',
      },
      [ProtocolType.YEARN]: {
        [ChainId.MAINNET]: '',
        [ChainId.POLYGON]: '',
        [ChainId.FORK_MAIN_NET]: 'https://yearn.finance/#/vault/0xCe2Fc0bDc18BD6a4d9A725791A3DEe33F3a23BB7',
        [ChainId.FANTOM]: 'https://yearn.finance/#/vault/0xCe2Fc0bDc18BD6a4d9A725791A3DEe33F3a23BB7',
      },
    },
  },
};

const getBaseTokenType: (baseTokenAddress?: string) => BaseTokenType | undefined = (baseTokenAddress) => {
  if (!baseTokenAddress) {
    return;
  }
  for (const [tokenType, tokenInfo] of Object.entries(BASE_TOKEN_DATA)) {
    if (
      Object.values(tokenInfo.address)
        .map((address) => address.toLowerCase())
        .includes(baseTokenAddress.toLowerCase())
    ) {
      return tokenType as BaseTokenType;
    }
  }
};
export { getBaseTokenType };
export default BASE_TOKEN_DATA;
