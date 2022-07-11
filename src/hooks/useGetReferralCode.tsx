import { useEffect, useState, useMemo, useRef } from 'react';
import { Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';

import { IWeb3Controller } from '../constants/web3ContextConstants';
import debounce from 'lodash.debounce';
import { ChainId, DEV_MULTICALL_CHAIN_ID } from '../constants';
import REFERRAL_CODE from '../constants/abis/ReferralCode.json';
import { REGISTER_REFERRAL_ADDRESS } from '../constants';

export interface ReferralCodeData {
  referralCode?: string;
  isNeedRegister: boolean;
}

export function useGetReferralCode(web3Controller: IWeb3Controller): ReferralCodeData {
  const { web3Provider, chainId: walletChainId, blockNumber, connecting, account } = web3Controller;
  const prevAccount = useRef(account);
  const [referralCode, setReferralCode] = useState<string>();
  const [isNeedRegister, setIsNeedRegister] = useState<boolean>(false);

  const fetchMultiCall = async (ethcallProvider: MulticallProvider) => {
    const referralContract = new MulticallContract(REGISTER_REFERRAL_ADDRESS[walletChainId], REFERRAL_CODE);
    const referralData = await ethcallProvider.all([referralContract.id(account)]);
    return referralData;
  };

  const fetchReferralCode = async (provider?: Provider) => {
    if (!connecting && provider && walletChainId && account) {
      try {
        const multicallChainId =
          walletChainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : walletChainId;
        const ethcallProvider = new MulticallProvider(provider, multicallChainId);
        const referralData = await fetchMultiCall(ethcallProvider);
        const fetchedReferralCode = referralData[0] as BigNumber;
        const fetchedIsNeedRegister = !fetchedReferralCode.gt(0);
        setReferralCode(fetchedReferralCode.toString());
        setIsNeedRegister(fetchedIsNeedRegister);
        return;
      } catch (e) {
        console.log(e);
        console.log('fetch referral code error.');
      }
    }
    setReferralCode(undefined);
  };

  const debouncedFetchReferralCode = useMemo(() => debounce(fetchReferralCode, 200), [fetchReferralCode]);

  useEffect(() => {
    if (account && prevAccount.current !== account) {
      setReferralCode(undefined);
      setIsNeedRegister(false);
    }
  }, [account]);

  useEffect(() => {
    if (account && !parseInt(referralCode || '0')) {
      debouncedFetchReferralCode(web3Provider as Provider);
    }
  }, [web3Provider, blockNumber, referralCode, account]);

  return { referralCode, isNeedRegister };
}
