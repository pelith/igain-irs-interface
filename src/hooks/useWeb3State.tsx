import { useRef, useEffect, useReducer, useMemo, useContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import debounce from 'lodash.debounce';
import Web3Modal from 'web3modal';
import * as UAuthWeb3Modal from '@uauth/web3modal';

import getProviderOptions from '../utils/getProviderOptions';
import { getChainData } from '../utils/web3Utils';
import { IWeb3State } from '../constants/web3ContextConstants';
import { INITIAL_STATE } from '../constants/web3ContextConstants';
import { SelectedChainContext } from '../context/SelectedChainContext';

const WEB3_ACTION_SET = 'set';
const WEB3_ACTION_SET_BLOCK = 'setBlock';

function initWeb3Provider(provider: any) {
  const web3Provider = new Web3Provider(provider);
  return web3Provider;
}

function web3StateReducer(state: IWeb3State, action: any) {
  switch (action.type) {
    case WEB3_ACTION_SET:
      return { ...state, ...action.payload };
    case WEB3_ACTION_SET_BLOCK: {
      const { chainId, blockNumber } = action.payload;
      if (chainId === state.chainId) {
        if (typeof state.blockNumber !== 'number') return { ...state, blockNumber };
        return {
          ...state,
          blockNumber: Math.max(blockNumber, state.blockNumber),
        };
      }
      return state;
    }
    default:
      throw new Error(`Not support action type: ${action.typ} in this reducer`);
  }
}

function useWeb3State() {
  const { selectedChain } = useContext(SelectedChainContext);
  const [web3State, dispatchWeb3State] = useReducer(web3StateReducer, {
    ...INITIAL_STATE,
  });
  const setWeb3State = (newState: IWeb3State) => dispatchWeb3State({ type: WEB3_ACTION_SET, payload: newState });
  const web3Modal = useRef<any>(null);
  const web3StateRef = useRef<any>(web3State);

  const setBlockNumber = (blockNumber: number) => {
    dispatchWeb3State({
      type: WEB3_ACTION_SET_BLOCK,
      payload: { blockNumber, chainId: web3StateRef.current.chainId },
    });
  };

  const debouncedSetBlockNumber = useMemo(() => debounce(setBlockNumber, 200), []);
  let subscribeProvider: (provider: any) => void;

  const getNetwork = () => {
    try {
      return getChainData(web3State.chainId).network;
    } catch {
      return '';
    }
  };

  const onConnect = async () => {
    dispatchWeb3State({ type: WEB3_ACTION_SET, payload: { connecting: true } });
    try {
      const provider = await web3Modal.current.connect();
      const web3Provider: Web3Provider = initWeb3Provider(provider);
      const signer = web3Provider.getSigner();
      const account = (await signer.getAddress()).toLowerCase();
      const network = await web3Provider.getNetwork();
      const blockNumber = await web3Provider.getBlockNumber();
      const chainId = network.chainId;
      setWeb3State({
        web3Provider,
        provider,
        connected: true,
        account,
        chainId,
        blockNumber,
        connecting: false,
      });

      web3Provider.on('block', debouncedSetBlockNumber);
      return provider;
    } catch (e) {
      dispatchWeb3State({ type: WEB3_ACTION_SET, payload: { connecting: false } });
      throw e;
    }
  };

  const initConnect = async () => {
    if (web3Modal.current.cachedProvider === 'custom-uauth' && !window.localStorage.getItem('username')) {
      web3Modal.current.clearCachedProvider();
    }
    const provider = await onConnect();
    await subscribeProvider(provider);
  };

  const resetApp = async () => {
    window.localStorage.removeItem('username');
    await web3Modal.current.clearCachedProvider();
    setWeb3State({ ...INITIAL_STATE });
    await initConnect();
  };

  subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on('disconnect', resetApp);
    provider.on('accountsChanged', async (accounts: string[]) =>
      dispatchWeb3State({
        type: WEB3_ACTION_SET,
        payload: { account: accounts[0] },
      }),
    );

    provider.on('networkChanged', onConnect);
  };

  useEffect(() => {
    web3Modal.current = new Web3Modal({
      network: getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions(selectedChain),
    });
    UAuthWeb3Modal.registerWeb3Modal(web3Modal.current);
    if (web3Modal.current.cachedProvider) {
      initConnect();
    }
  }, [selectedChain]);

  useEffect(() => {
    web3StateRef.current = web3State;
  }, [web3State]);

  return [web3State, initConnect, resetApp];
}

export default useWeb3State;
