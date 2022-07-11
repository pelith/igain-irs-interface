import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { Zero } from '@ethersproject/constants';
import { BackLink } from '../../components/BackLink';
import TradeTermMainInfo from '../../components/TradeTermMainInfo';
import LineChartWrapper, { LineChartOptionsTypes } from '../../components/TermTradeLineChart';
import { useSelectedIGainTermsInfo } from '../../hooks/useIGainTerms';
import { useUserInfoForMultipleAddress } from '../../hooks/useUserInfo';
import { Web3Context } from '../../context/Web3Context';
import { SelectedChainContext } from '../../context/SelectedChainContext';
import { getParamsByContractId } from '../../constants/termInfo/termConfigData';
import { TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import TradeTokenCardContainer from '../TradeTokenCardContainer';
import { CHAIN_DISPLAY_INFO } from '../../constants';
import SideInfo from '../../components/SideInfo';
import SideInfoPageType from '../../constants/sideInfoDisplayType';
import TermExpiredContent from '../../components/TermExpiredContent';
import useFixedApy from '../../hooks/useFixedApys';
import { isTermNeedRefresh } from '../../utils';
import { INTERNAL_PATH } from '../../constants/links';
import LoadingSection from '../../components/LoadingSection';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import { useIndexApy } from '../../hooks/useIndexApy';
import useApyHistoryData from '../../hooks/useApyHistoryData';
import useWindowSize from '../../hooks/useWindowSize';
import { ResponsiveView } from '../../constants/responsive';
import IntroList from '../../components/IntroList';
import PageFrame from '../../components/common/PageFrame';
import { calcMarkPrice } from '../../utils/contractCalc';
import { TermHistoryChartDataType } from '../../constants/data/termHistory';
import { TermFactoryContext } from '../../context/TermFactoryContext';

function TradeTermDetailPage(): ReactElement {
  const history = useHistory();
  const web3Controller = useContext(Web3Context);
  const { selectedChain, selectChain } = useContext(SelectedChainContext);
  const { contractId } = useParams() as { contractId: string };
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const { search } = useLocation();

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

  const termChainName = useMemo(() => {
    if (targetTermData && targetTermData.chainId) {
      return CHAIN_DISPLAY_INFO[targetTermData.chainId].displayName;
    }
    return '-';
  }, [targetTermData]);

  const iGainTermsInfo = useSelectedIGainTermsInfo(termsWithSameBaseToken);
  const userInfo = useUserInfoForMultipleAddress(iGainTermBaseInfo?.[selectedChain], web3Controller);
  const [currentTermInfo, setCurrentTermInfo] = useState<IGainTerm>();
  const apyData = useApyHistoryData(targetTermData?.chainId || selectedChain, currentTermInfo?.address || contractId);
  const [chartData, setChartData] = useState<TermHistoryChartDataType[]>();

  useEffect(() => {
    if (apyData.length > 0 && chartData?.length !== apyData.length) {
      apyData.sort((a, b) => {
        if (a.blockNumber > b.blockNumber) {
          return 1;
        }
        return -1;
      });
      setChartData(apyData);
    }
  }, [apyData]);

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
    if (iGainTermsInfo && iGainTermsInfo.length > 0) {
      const filteredTermInfo = iGainTermsInfo.find((element) => element.address === contractId);
      if (!filteredTermInfo) {
        history.push(INTERNAL_PATH.TRADE);
        return;
      }
      if (isTermNeedRefresh(filteredTermInfo, currentTermInfo)) {
        setCurrentTermInfo(filteredTermInfo);
      }
    }
  }, [iGainTermsInfo]);

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const targetChain = searchParams.get('targetChain');
    if (targetChain && !targetTermData) {
      selectChain(parseInt(targetChain));
    }
  }, [search]);

  const targetUser = userInfo?.find((user) => user.address === currentTermInfo?.address);
  const isRoundClose = (currentTermInfo?.closeTime || 0) * 1000 < Date.now();

  const markLongPrice = useMemo(() => {
    if (!currentTermInfo) {
      return Zero;
    }

    const decimals = currentTermInfo?.decimals || 18;
    const decimalBNUnit = parseUnits('1', decimals);
    return BigNumber.from(calcMarkPrice(currentTermInfo.poolB, currentTermInfo.poolA, decimalBNUnit).toString());
  }, [currentTermInfo]);

  const fixedBorrowApy = useFixedApy(
    targetTermData,
    markLongPrice.isZero() ? undefined : markLongPrice,
    web3Controller,
  );
  const indexApy = useIndexApy(currentTermInfo, web3Controller);
  const windowSize = useWindowSize();

  const defaultChartType = useMemo(() => {
    const openTime = currentTermInfo?.openTime;
    const closeTime = currentTermInfo?.closeTime;
    if (openTime && closeTime) {
      const nowTime = Math.floor(Date.now() / 1000);
      return (nowTime - openTime) / (closeTime - openTime) >= 0.8
        ? LineChartOptionsTypes.PRICE_TREND
        : LineChartOptionsTypes.APY_TREND;
    }
    return LineChartOptionsTypes.APY_TREND;
  }, [currentTermInfo?.openTime]);

  return (
    <PageFrame>
      <Box pt={{ base: '1rem', lg: '24px' }} pb='80px' px={{ base: '1rem', lg: '100px' }}>
        <Box display='inline-block'>
          <BackLink path={INTERNAL_PATH.TRADE} />
        </Box>
        <Flex direction={{ base: 'column', lg: 'row' }} mt='1rem'>
          <Box
            flex={1}
            mb={{ base: '32px', lg: '0' }}
            pr={{ base: '0', lg: '10px' }}
            maxH='100vh'
            position={{ base: 'initial', lg: 'sticky' }}
            top='40px'
            zIndex='3'
          >
            <SideInfo
              iGainTermsInfo={iGainTermsInfo}
              currentTermInfo={currentTermInfo}
              decimals={targetTermData?.baseTokenType ? BASE_TOKEN_DATA[targetTermData?.baseTokenType].decimals : 18}
              userInfo={userInfo}
              page={SideInfoPageType.TRADE}
              setCurrentTermInfo={setCurrentTermInfo}
            />
          </Box>
          <Box flex={2} position='relative' minW='0'>
            {iGainTermsInfo.length === 0 && <LoadingSection />}
            {!isRoundClose ? (
              <>
                <TradeTermMainInfo
                  termInfo={currentTermInfo}
                  termChainName={termChainName}
                  indexApy={indexApy}
                  markApy={fixedBorrowApy}
                />
                <LineChartWrapper chartData={chartData} defaultChartType={defaultChartType} />
                <Grid
                  templateColumns={{ base: 'repeat(1, minmax(0, 1fr))', lg: 'repeat(2, minmax(0, 1fr))' }}
                  gap='8px'
                  py='0.5rem'
                >
                  <TradeTokenCardContainer
                    tokenBalance={targetUser?.longBalance}
                    baseTokenBalance={targetUser?.baseTokenBalance}
                    baseTokenType={currentTermInfo?.tradeBaseTokenType}
                    tokenType={TradeTokenType.LONG}
                    iGainTermInfo={currentTermInfo}
                  />
                  <TradeTokenCardContainer
                    tokenBalance={targetUser?.shortBalance}
                    baseTokenBalance={targetUser?.baseTokenBalance}
                    baseTokenType={currentTermInfo?.tradeBaseTokenType}
                    tokenType={TradeTokenType.SHORT}
                    iGainTermInfo={currentTermInfo}
                  />
                </Grid>
              </>
            ) : (
              <TermExpiredContent
                descriptionContent='This term has expired, please go to Portfolio page to redeem'
                buttonContent='Redeem on Portfolio'
              />
            )}
          </Box>
          {windowSize === ResponsiveView.MOBILE && <IntroList protocolType={currentTermInfo?.protocolType} />}
        </Flex>
      </Box>
    </PageFrame>
  );
}

export default TradeTermDetailPage;
