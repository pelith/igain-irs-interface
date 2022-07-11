import React, { useContext } from 'react';
import { ReferralCodeData, useGetReferralCode } from '../hooks/useGetReferralCode';
import { Web3Context } from './Web3Context';

const ReferralCodeContext = React.createContext({} as ReferralCodeData);

const ReferralCodeContextProvider: React.FC = ({ children }) => {
  const web3Controller = useContext(Web3Context);
  const { referralCode, isNeedRegister } = useGetReferralCode(web3Controller);

  return (
    <ReferralCodeContext.Provider
      value={{
        referralCode,
        isNeedRegister,
      }}
    >
      {children}
    </ReferralCodeContext.Provider>
  );
};

export { ReferralCodeContext };
export default ReferralCodeContextProvider;
