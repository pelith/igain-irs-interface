import React, { useState } from 'react';

export interface SlippageToleranceContextInterface {
  slippageTolerance: string;
  setSlippageTolerance: React.Dispatch<React.SetStateAction<string>>;
}

const SlippageToleranceContext = React.createContext({} as SlippageToleranceContextInterface);

const SlippageToleranceContextProvider: React.FC = ({ children }) => {
  const [slippageTolerance, setSlippageTolerance] = useState('0.001');

  return (
    <SlippageToleranceContext.Provider value={{ slippageTolerance, setSlippageTolerance }}>
      {children}
    </SlippageToleranceContext.Provider>
  );
};

export { SlippageToleranceContext };
export default SlippageToleranceContextProvider;
