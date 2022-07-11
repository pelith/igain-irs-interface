import { useContext, useMemo } from 'react';
import { Zero } from '@ethersproject/constants';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { useUserInfoForMultipleAddress } from './useUserInfo';
import { getParamsByContractIds } from '../constants/termInfo/termConfigData';
import { Web3Context } from '../context/Web3Context';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { useSelectedIGainTermsInfo } from './useIGainTerms';
import { UserInfo } from '../constants/userInfo';
import { TermFactoryContext } from '../context/TermFactoryContext';

export default function useParticipatedTermsInfo(): [UserInfo[] | undefined, string[], IGainTerm[]] {
  const web3Controller = useContext(Web3Context);
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const userInfos = useUserInfoForMultipleAddress(iGainTermBaseInfo?.[selectedChain], web3Controller);

  const participateUserInfoTerms = useMemo(
    () =>
      userInfos?.filter(
        (userTermInfo) =>
          userTermInfo.longBalance.gt(Zero) ||
          userTermInfo.shortBalance.gt(Zero) ||
          userTermInfo.lpBalance.gt(Zero) ||
          userTermInfo.farmBalance?.gt(Zero),
      ),
    [userInfos],
  );

  const participatedContractIds = useMemo(
    () => participateUserInfoTerms?.map((userTermInfo) => userTermInfo.address) || [],
    [participateUserInfoTerms],
  );

  const targetTermParams = useMemo(
    () => getParamsByContractIds(participatedContractIds || [], selectedChain, iGainTermBaseInfo),
    [participatedContractIds, selectedChain],
  );

  const iGainTermsInfo = useSelectedIGainTermsInfo(targetTermParams || []);

  return [participateUserInfoTerms, participatedContractIds, iGainTermsInfo];
}
