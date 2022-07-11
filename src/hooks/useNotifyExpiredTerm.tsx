import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { INTERNAL_PATH } from '../constants/links';
import useParticipatedTermsInfo from './useParticipatedTermsInfo';
import useTermsStageSeparator from './useTermsStageSeparator';
import { Web3Context } from '../context/Web3Context';
import { checkIsElementsInArray, compareCloseTime } from '../utils';

const ToastContent = () => {
  return (
    <Box>
      <Text>Your term has reached maturity!</Text>
      <Flex justify='start' mt='24px'>
        <Button
          as={ReachLink}
          color='primary.100'
          _hover={{ color: 'neutral' }}
          border='1px solid'
          to={INTERNAL_PATH.PORTFOLIO}
        >
          Check your Portfolio
        </Button>
      </Flex>
    </Box>
  );
};

function useNotifyExpiredTerm() {
  const web3Controller = useContext(Web3Context);
  const { account } = web3Controller;
  const [isNeedNotifyExpiredTerm, setIsNeedNotifyExpiredTerm] = useState<boolean>();

  const [, , iGainTermsInfo] = useParticipatedTermsInfo();
  iGainTermsInfo.sort(compareCloseTime);
  const [expiredTerms] = useTermsStageSeparator(iGainTermsInfo);
  const expiredTermAddresses = useMemo(() => expiredTerms.map((term) => term.address), [expiredTerms]);

  const isAllTermsNotified = useMemo(() => {
    const localStorageCheckedTerms = localStorage.getItem(`${account}_notifiedTerms`);
    let prevCheckedTermAddress: string[] = [];
    if (localStorageCheckedTerms != null) {
      prevCheckedTermAddress = JSON.parse(localStorageCheckedTerms);
    }
    return checkIsElementsInArray(prevCheckedTermAddress, expiredTermAddresses);
  }, [expiredTermAddresses]);

  // new expired term update state
  useEffect(() => {
    setIsNeedNotifyExpiredTerm(!isAllTermsNotified);
  }, [isAllTermsNotified]);

  useEffect(() => {
    if (isNeedNotifyExpiredTerm) {
      toast.warning(ToastContent, {
        onClose: () => {
          localStorage.setItem(`${account}_notifiedTerms`, JSON.stringify(expiredTermAddresses));
          setIsNeedNotifyExpiredTerm(false);
        },
        autoClose: false,
        progress: 1,
        style: { paddingTop: '12px' },
      });
    }
  }, [isNeedNotifyExpiredTerm]);
}

export default useNotifyExpiredTerm;
