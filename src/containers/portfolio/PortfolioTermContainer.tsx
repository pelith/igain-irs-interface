import { Box, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import React, { ReactElement, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import PortfolioListSection from '../../components/portfolio/PortfolioListSection';
import { ArchiveIGainTerm, BIG_NUMBER_ATTRIBUTE_LIST } from '../../constants/termInfo/iGainTermData';
import { Web3Context } from '../../context/Web3Context';
import { SelectedChainContext } from '../../context/SelectedChainContext';
import useClaimAll from '../../hooks/useClaimAll';
import arrayToAddressMap from '../../utils/arrayToAddressMap';
import RedeemModal from './RedeemModal';
import ConnectWalletGuide from '../../components/guide/ConnectWalletGuide';
import WrongNetworkGuide from '../../components/guide/WrongNetworkGuide';
import { ALLOW_CHAIN_LIST } from '../../constants';
import LoadingSection from '../../components/LoadingSection';
import useParticipatedTermsInfo from '../../hooks/useParticipatedTermsInfo';
import { compareCloseTime } from '../../utils';

function PortfolioTermContainer(): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { connected, chainId, connecting } = web3Controller;
  const { selectedChain } = useContext(SelectedChainContext);
  const { account } = web3Controller;

  const [participateUserInfoTerms, participatedContractIds, iGainTermsInfo] = useParticipatedTermsInfo();
  const userInfoMap = useMemo(() => arrayToAddressMap(participateUserInfoTerms || []), [participateUserInfoTerms]);
  const [cacheUpdateTrigger, setCacheUpdateTrigger] = useState(0);
  const [redeemContractAddress, setRedeemContract] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (redeemContractAddress) {
      onOpen();
    }
  }, [redeemContractAddress]);

  const cacheTermsInfoString = useMemo(
    () => window.localStorage.getItem(`cacheTermsInfo_${selectedChain}_${account}`) || 'null',
    [selectedChain, account, cacheUpdateTrigger],
  );

  const cacheTermsInfo: ArchiveIGainTerm[] = useMemo(() => {
    const parsedData = JSON.parse(cacheTermsInfoString, function (key, val) {
      if (BIG_NUMBER_ATTRIBUTE_LIST.includes(key)) {
        return BigNumber.from(val);
      }
      return val;
    });
    if (Array.isArray(parsedData)) {
      return parsedData;
    }
    return [];
  }, [cacheTermsInfoString]);

  const combinedTermsInfo = useMemo(() => {
    if (iGainTermsInfo.length > 0) {
      const filteredOldTerms = cacheTermsInfo.filter((t) => !participatedContractIds.includes(t.address));
      filteredOldTerms.push(...iGainTermsInfo);
      filteredOldTerms.sort(compareCloseTime);
      return filteredOldTerms;
    }
    return cacheTermsInfo;
  }, [iGainTermsInfo]);

  const redeemTargetTerm = useMemo(() => {
    return combinedTermsInfo.find((term) => term.address === redeemContractAddress);
  }, [redeemContractAddress]);

  const updateArchivedTerm = useCallback(
    (contractId) => {
      const toArchivedGainTerm = combinedTermsInfo.find((iGainTerm) => iGainTerm.address === contractId);
      if (toArchivedGainTerm) {
        toArchivedGainTerm.archivedTime = Date.now();
        cacheTermsInfo.push(toArchivedGainTerm);
        window.localStorage.setItem(`cacheTermsInfo_${selectedChain}_${account}`, JSON.stringify(cacheTermsInfo));
        setCacheUpdateTrigger((t) => t + 1);
      }
    },
    [combinedTermsInfo],
  );

  const { claim, claimState } = useClaimAll(redeemTargetTerm?.address, web3Controller);

  const onClickRedeem = useCallback(
    (contractAddress: string) => {
      setRedeemContract(contractAddress);
      onOpen();
    },
    [setRedeemContract, onOpen],
  );

  const onRedeemDialogClose = useCallback(() => {
    setRedeemContract('');
    onClose();
  }, [setRedeemContract, onClose]);

  const onRedeemConfirm = useCallback(() => {
    claim((contractId: string) => {
      updateArchivedTerm(contractId);
      setRedeemContract('');
      onClose();
    });
  }, [claim, updateArchivedTerm, setRedeemContract, onClose]);

  const isUserInRightChain = useMemo(() => {
    return ALLOW_CHAIN_LIST.includes(chainId);
  }, [chainId]);

  return (
    <Box position='relative'>
      {connecting && <LoadingSection />}
      {!connected ? (
        <ConnectWalletGuide />
      ) : !isUserInRightChain ? (
        <WrongNetworkGuide />
      ) : (
        <PortfolioListSection
          userInfoMap={userInfoMap}
          terms={combinedTermsInfo}
          onClickRedeem={onClickRedeem}
          selectedChain={selectedChain}
        />
      )}
      <RedeemModal
        isOpen={isOpen}
        onClose={onRedeemDialogClose}
        onRedeemConfirm={onRedeemConfirm}
        contractId={redeemTargetTerm?.address}
        userInfo={userInfoMap[redeemContractAddress]}
        claimState={claimState}
      />
    </Box>
  );
}

export default PortfolioTermContainer;
