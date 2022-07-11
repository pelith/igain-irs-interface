import React from 'react';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import useWeb3State from '../hooks/useWeb3State';

const Web3Context = React.createContext({} as IWeb3Controller);

const Web3ContextProvider: React.FC = ({ children }) => {
  const [web3State, initConnect, resetApp] = useWeb3State();

  return <Web3Context.Provider value={{ ...web3State, initConnect, resetApp }}>{children}</Web3Context.Provider>;
};

export { Web3Context };
export default Web3ContextProvider;
