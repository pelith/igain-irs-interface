import React, { useContext } from 'react';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { useIGainTermsInfo } from '../hooks/useIGainTerms';
import { TermFactoryContext } from './TermFactoryContext';

export interface TermsContextInterface {
  iGainTermsInfo: IGainTerm[] | undefined;
}

const TermsContext = React.createContext({} as TermsContextInterface);

const TermsContextProvider: React.FC = ({ children }) => {
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const iGainTermsInfo = useIGainTermsInfo(iGainTermBaseInfo?.[selectedChain]);

  return <TermsContext.Provider value={{ iGainTermsInfo }}>{children}</TermsContext.Provider>;
};

export { TermsContext };
export default TermsContextProvider;
