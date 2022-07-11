import React, { useContext } from 'react';
import { TermsConfigMapType } from '../constants/termInfo/termConfigData';
import useBuildTermConfig from '../hooks/useBuildTermConfig';
import { SelectedChainContext } from './SelectedChainContext';

export interface TermsContextInterface {
  iGainTermBaseInfo: TermsConfigMapType | undefined;
}

const TermFactoryContext = React.createContext({} as TermsContextInterface);

const TermFactoryContextProvider: React.FC = ({ children }) => {
  const { selectedChain } = useContext(SelectedChainContext);
  const iGainTermBaseInfo = useBuildTermConfig(selectedChain);
  return <TermFactoryContext.Provider value={{ iGainTermBaseInfo }}>{children}</TermFactoryContext.Provider>;
};

export { TermFactoryContext };
export default TermFactoryContextProvider;
