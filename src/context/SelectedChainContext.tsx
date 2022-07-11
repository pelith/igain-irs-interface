import React, { useState, useMemo } from 'react';
import { DEFAULT_CHAIN_ID } from '../constants/web3ContextConstants';
import { ChainId } from '../constants';

export interface SelectedChainContextInterface {
  selectedChain: ChainId;
  selectChain: (chainId: ChainId) => any;
}

const SelectedChainContext = React.createContext({} as SelectedChainContextInterface);

const SelectedChainContextProvider: React.FC = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState(0);
  const selectChain = (chainId: ChainId) => {
    localStorage.setItem('selectedChain', chainId.toString());
    setSelectedChain(chainId);
  };
  const currentChain = useMemo(() => {
    const localStorageSelectedChain = localStorage.getItem('selectedChain');
    if (localStorageSelectedChain) {
      return parseInt(localStorageSelectedChain);
    } else {
      return DEFAULT_CHAIN_ID;
    }
  }, [selectedChain]);

  return (
    <SelectedChainContext.Provider value={{ selectedChain: currentChain, selectChain }}>
      {children}
    </SelectedChainContext.Provider>
  );
};

export { SelectedChainContext };
export default SelectedChainContextProvider;
