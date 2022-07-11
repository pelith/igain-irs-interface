import { ChainId, DEV_MULTICALL_CHAIN_ID } from '.';
import BASE_TOKEN_DATA from './baseTokenConfig';
import BaseTokenType from './termInfo/baseTokenType';

type VaultAddressMappingType = {
  [key: string]: string;
};

const MAINNET_VAULT = {
  [BASE_TOKEN_DATA[BaseTokenType.DAI].address[ChainId.MAINNET]]: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
  [BASE_TOKEN_DATA[BaseTokenType.USDC].address[ChainId.MAINNET]]: '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE',
  [BASE_TOKEN_DATA[BaseTokenType.USDT].address[ChainId.MAINNET]]: '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
};

const FANTOM_VAULT = {
  [BASE_TOKEN_DATA[BaseTokenType.DAI].address[ChainId.FANTOM]]: '0x637eC617c86D24E421328e6CAEa1d92114892439',
  [BASE_TOKEN_DATA[BaseTokenType.USDC].address[ChainId.FANTOM]]: '0xEF0210eB96c7EB36AF8ed1c20306462764935607',
  [BASE_TOKEN_DATA[BaseTokenType.USDT].address[ChainId.FANTOM]]: '0x148c05caf1Bb09B5670f00D511718f733C54bC4c',
  [BASE_TOKEN_DATA[BaseTokenType.ETH].address[ChainId.FANTOM]]: '0xCe2Fc0bDc18BD6a4d9A725791A3DEe33F3a23BB7',
};

const YEARN_VAULT: {
  [chainId in ChainId]?: VaultAddressMappingType;
} = {
  [ChainId.MAINNET]: MAINNET_VAULT,
  [ChainId.FANTOM]: FANTOM_VAULT,
  [ChainId.FORK_MAIN_NET]:
    DEV_MULTICALL_CHAIN_ID === ChainId.POLYGON
      ? {}
      : DEV_MULTICALL_CHAIN_ID === ChainId.FANTOM
      ? FANTOM_VAULT
      : MAINNET_VAULT,
};

export default YEARN_VAULT;
