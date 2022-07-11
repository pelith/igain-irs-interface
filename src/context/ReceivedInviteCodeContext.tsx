import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { INVITE_CODE_URL_PARAMS_KEY } from '../constants';
import { Web3Context } from './Web3Context';

export interface ReceivedInviteCodeContextInterface {
  receivedInviteCode: string;
}

const ReceivedInviteCodeContext = React.createContext({} as ReceivedInviteCodeContextInterface);

const parseReceivedInviteCode = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(INVITE_CODE_URL_PARAMS_KEY);
};

const ReceivedInviteCodeContextProvider: React.FC = ({ children }) => {
  const web3Controller = useContext(Web3Context);
  const paramsInviteCode = useRef<string>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const { account, chainId } = web3Controller;

  useEffect(() => {
    const parsedInviteCode = parseReceivedInviteCode();
    if (parsedInviteCode) {
      paramsInviteCode.current = parsedInviteCode;
    }
  }, []);

  useEffect(() => {
    if (account && chainId) {
      if (paramsInviteCode.current) {
        window.localStorage.setItem(`${account}_${chainId}_${INVITE_CODE_URL_PARAMS_KEY}`, paramsInviteCode.current);
        setInviteCode(paramsInviteCode.current);
      } else {
        const localInviteCode = window.localStorage.getItem(`${account}_${chainId}_${INVITE_CODE_URL_PARAMS_KEY}`);
        setInviteCode(localInviteCode || '');
      }
    }
  }, [account, chainId]);

  const contextValue = useMemo(() => ({ receivedInviteCode: inviteCode }), [inviteCode]);

  return <ReceivedInviteCodeContext.Provider value={contextValue}>{children}</ReceivedInviteCodeContext.Provider>;
};

export { ReceivedInviteCodeContext };
export default ReceivedInviteCodeContextProvider;
