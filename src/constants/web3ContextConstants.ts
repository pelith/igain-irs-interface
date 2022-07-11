import { Web3Provider } from '@ethersproject/providers';
import { ChainId } from '../constants';

export interface IWeb3State {
  account: string;
  web3Provider: Web3Provider | null;
  provider: any;
  connected: boolean;
  connecting: boolean;
  chainId: ChainId;
  blockNumber: number;
}

export interface IWeb3Controller {
  account: string;
  web3Provider: Web3Provider | null;
  provider: any;
  connected: boolean;
  connecting: boolean;
  chainId: ChainId;
  blockNumber: number;
  initConnect: () => void;
  resetApp: () => void;
}

export const DEFAULT_CHAIN_ID: ChainId =
  process.env.REACT_APP_ENV === 'development' ? ChainId.FORK_MAIN_NET : ChainId.POLYGON;

export const INITIAL_STATE: IWeb3State = {
  account: '',
  web3Provider: null,
  provider: null,
  connected: false,
  connecting: false,
  chainId: DEFAULT_CHAIN_ID,
  blockNumber: 0,
};
