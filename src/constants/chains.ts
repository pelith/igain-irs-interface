import { IChainData } from '../constants/types';
import { ChainId } from '../constants';

const supportedChains: { [chainId in ChainId]: IChainData } = {
  [ChainId.MAINNET]: {
    name: 'Ethereum Mainnet',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    rpc_url: 'https://mainnet.infura.io/v3/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  [ChainId.POLYGON]: {
    name: 'Polygon',
    network: 'polygon',
    chain_id: 137,
    network_id: 137,
    rpc_url: 'https://polygon-rpc.com',
    native_currency: {
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  [ChainId.FANTOM]: {
    name: 'Fantom',
    network: 'fantom',
    chain_id: 250,
    network_id: 250,
    rpc_url: 'https://rpc.ankr.com/fantom',
    native_currency: {
      symbol: 'FTM',
      name: 'FTM',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  [ChainId.FORK_MAIN_NET]: {
    name: 'iGain Dev Rpc',
    network: 'mainnet_fork',
    chain_id: 8787,
    network_id: 8787,
    rpc_url: 'http://localhost:8545',
    native_currency: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
};

export default supportedChains;
