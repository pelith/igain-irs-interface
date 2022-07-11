import React, { useMemo } from 'react';

import useAaveEmodeInfo from '../hooks/useAaveEmodeInfo';

export interface AaveEModeContextInterface {
  userEMode: number;
  reservesEmodeInfo: {
    [key: string]: number;
  };
}

const AaveEModeContext = React.createContext({} as AaveEModeContextInterface);

const AaveEModeContextProvider: React.FC = ({ children }) => {
  const { userEMode, reservesEmodeInfo } = useAaveEmodeInfo();
  const contextValue = useMemo(
    () => ({
      userEMode,
      reservesEmodeInfo,
    }),
    [userEMode, reservesEmodeInfo],
  );
  return <AaveEModeContext.Provider value={contextValue}>{children}</AaveEModeContext.Provider>;
};

export { AaveEModeContext };
export default AaveEModeContextProvider;
