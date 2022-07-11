import React, { useContext } from 'react';
import useYEarnPrice, { YearnTokenPriceType } from '../hooks/useYEarnPrice';
import { SelectedChainContext } from './SelectedChainContext';

const YEarnPriceContext = React.createContext({} as YearnTokenPriceType);

const YEarnPriceContextProvider: React.FC = ({ children }) => {
  const { selectedChain } = useContext(SelectedChainContext);
  const { yearnTokenPrices } = useYEarnPrice(selectedChain);

  return <YEarnPriceContext.Provider value={yearnTokenPrices}>{children}</YEarnPriceContext.Provider>;
};

export { YEarnPriceContext };
export default YEarnPriceContextProvider;
