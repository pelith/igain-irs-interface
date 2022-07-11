import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { BackLink } from '../../components/BackLink';
import PoolTermMainInfo from '../../components/PoolTermMainInfo';
import { Web3Context } from '../../context/Web3Context';
import { SelectedChainContext } from '../../context/SelectedChainContext';
import { useParams, useHistory } from 'react-router-dom';
import { getParamsByContractId } from '../../constants/termInfo/termConfigData';
import { useSelectedIGainTermsInfo } from '../../hooks/useIGainTerms';
import TradeTokenCardContainer from '../TradeTokenCardContainer';
import { TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import SideInfo from '../../components/SideInfo';
import useUserInfo from '../../hooks/useUserInfo';
import SideInfoPageType from '../../constants/sideInfoDisplayType';
import TermExpiredContent from '../../components/TermExpiredContent';
import { INTERNAL_PATH } from '../../constants/links';
import LoadingSection from '../../components/LoadingSection';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import PageFrame from '../../components/common/PageFrame';
import { isTermNeedRefresh } from '../../utils';
import { TermFactoryContext } from '../../context/TermFactoryContext';

function PoolDetailPage(): ReactElement {
  const history = useHistory();
  const web3Controller = useContext(Web3Context);
  const { selectedChain, selectChain } = useContext(SelectedChainContext);
  const { search } = useLocation();

  const { contractId } = useParams() as { contractId: string };
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);

  const targetTermData = useMemo(
    () => getParamsByContractId(contractId, selectedChain, iGainTermBaseInfo),
    [contractId, selectedChain, iGainTermBaseInfo],
  );
  const termsWithSameBaseToken = useMemo(() => {
    if (!iGainTermBaseInfo) {
      return [];
    }
    return iGainTermBaseInfo[selectedChain]?.filter(
      (element) => element.baseTokenType === targetTermData?.baseTokenType,
    );
  }, [selectedChain, targetTermData]);

  const iGainTermsInfo = useSelectedIGainTermsInfo(termsWithSameBaseToken);
  const [currentTermInfo, setCurrentTermInfo] = useState<IGainTerm>();

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('poolA:', currentTermInfo?.poolA.toString());
      console.log('poolB:', currentTermInfo?.poolB.toString());
      console.log('totalSupply:', currentTermInfo?.lpTotalSupply.toString());
      console.log('initialRate:', currentTermInfo?.initialRate.toString());
      console.log('openTime:', (currentTermInfo?.openTime || 0) * 1000);
      console.log('closeTime:', (currentTermInfo?.closeTime || 0) * 1000);
    }
  }, [currentTermInfo]);

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const targetChain = searchParams.get('targetChain');
    if (targetChain && !targetTermData) {
      selectChain(parseInt(targetChain));
    }
  }, [search]);

  useEffect(() => {
    if (iGainTermsInfo && iGainTermsInfo.length > 0) {
      const filteredTermInfo = iGainTermsInfo.find((element) => element.address === contractId);
      if (!filteredTermInfo) {
        history.push(INTERNAL_PATH.POOL);
        return;
      }
      if (isTermNeedRefresh(filteredTermInfo, currentTermInfo)) {
        setCurrentTermInfo(filteredTermInfo);
      }
    }
  }, [iGainTermsInfo]);

  const userInfo = useUserInfo(targetTermData, web3Controller);
  const targetUser = userInfo?.find((user) => user.address === currentTermInfo?.address);
  const isRoundClose = (currentTermInfo?.closeTime || 0) * 1000 < Date.now();
  return (
    <PageFrame>
      <Box pt='24px' pb='80px' px={{ base: '1rem', lg: '100px' }}>
        <Box display='inline-block'>
          <BackLink path={INTERNAL_PATH.POOL} />
        </Box>
        <Flex direction={{ base: 'column', lg: 'row' }}>
          <Box flex={1} pr='10px' mt='1rem'>
            <SideInfo
              iGainTermsInfo={iGainTermsInfo}
              currentTermInfo={currentTermInfo}
              decimals={targetTermData?.baseTokenType ? BASE_TOKEN_DATA[targetTermData?.baseTokenType].decimals : 18}
              userInfo={userInfo}
              page={SideInfoPageType.POOL}
              setCurrentTermInfo={setCurrentTermInfo}
            />
          </Box>
          <Box flex={2} position='relative'>
            {iGainTermsInfo.length === 0 && <LoadingSection />}
            {!isRoundClose ? (
              <Flex direction={{ base: 'column', lg: 'row' }}>
                <PoolTermMainInfo termInfo={currentTermInfo} />
                <Box w={{ base: 'full', lg: '352px' }} mt='1rem' ml={{ lg: '1rem' }}>
                  <TradeTokenCardContainer
                    tokenBalance={targetUser?.lpBalance}
                    baseTokenBalance={targetUser?.baseTokenBalance}
                    baseTokenType={currentTermInfo?.tradeBaseTokenType}
                    tokenType={TradeTokenType.LP}
                    iGainTermInfo={currentTermInfo}
                  />
                </Box>
              </Flex>
            ) : (
              <TermExpiredContent
                descriptionContent='This term has expired, please go to Portfolio page to redeem'
                buttonContent='Redeem on Portfolio'
              />
            )}
          </Box>
        </Flex>
      </Box>
    </PageFrame>
  );
}

export default PoolDetailPage;
