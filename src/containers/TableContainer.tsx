import React, { ReactElement, useState, useContext, useMemo } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { useLocation } from 'react-router';
import TermFilter from '../components/table/TermFilter';
import TermInfoTable from '../components/table/TermInfoTable';
import { Web3Context } from '../context/Web3Context';
import { TermsContext } from '../context/TermsContext';
import { useUserInfoForMultipleAddress } from '../hooks/useUserInfo';
import TABLE_COLUMNS from '../components/table/tableColumns';
import { INTERNAL_PATH } from '../constants/links';
import getTradePageTableData, { getPoolPageTableData } from '../utils/getTableData';
import { useIGainTradingVolumes } from '../hooks/useIGainTradingVolumes';
import { useFeeApys } from '../hooks/useFeeApys';
import useTokenPrice from '../hooks/useTokenPrice';
import { useRewardsApr } from '../hooks/useRewardsApr';
import { ReactComponent as IconOops } from '../assets/icon-oops.svg';
import LoadingSection from '../components/LoadingSection';
import { calcMarkPrice } from '../utils/contractCalc';
import { parseUnits } from 'ethers/lib/utils';
import { useFixedApyListWithTerms } from '../hooks/useFixedApys';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { TermFactoryContext } from '../context/TermFactoryContext';
import { YEarnPriceContext } from '../context/YEarnPriceContext';
import { checkTermExpired } from '../utils/checkTermExpired';
import { TOKEN_PRICE_KEYS } from '../constants/tokenPriceKey';

function TableContainer(): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermsInfo } = useContext(TermsContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const expiredTermAddress = iGainTermsInfo?.filter((term) => checkTermExpired(term)).map((term) => term.address);
  const yearnTokenPrices = useContext(YEarnPriceContext);

  const userInfos = useUserInfoForMultipleAddress(iGainTermBaseInfo?.[selectedChain], web3Controller);
  const [selectedFilterType, setSelectedFilterType] = useState<string>('All');
  const [isShowPositionOnly, setIsShowPositionOnly] = useState<boolean>(false);
  const location = useLocation();
  const termVolumes = useIGainTradingVolumes(iGainTermBaseInfo?.[selectedChain], web3Controller, expiredTermAddress);
  const [feeApy, protocolTokenApy] = useFeeApys(iGainTermBaseInfo?.[selectedChain], web3Controller);
  const tokenPrices = useTokenPrice(TOKEN_PRICE_KEYS.toString());
  const rewardAprInfo = useRewardsApr(
    iGainTermBaseInfo?.[selectedChain],
    tokenPrices,
    web3Controller,
    expiredTermAddress,
  );

  const markLongPrices = useMemo(() => {
    return iGainTermsInfo?.map((iGainTermInfo) => {
      const decimals = iGainTermInfo?.decimals || 18;
      const decimalBNUnit = parseUnits('1', decimals);
      return BigNumber.from(calcMarkPrice(iGainTermInfo.poolB, iGainTermInfo.poolA, decimalBNUnit).toString());
    });
  }, [iGainTermsInfo, selectedChain]);
  const fixedApyList = useFixedApyListWithTerms(iGainTermsInfo, markLongPrices, web3Controller, selectedChain);
  const fixedApyMap: { [key: string]: number | undefined } = {};
  iGainTermsInfo?.forEach((termData, index) => {
    fixedApyMap[termData.address] = fixedApyList?.[index];
  });

  const tableData = useMemo(() => {
    let data;
    if (location.pathname === INTERNAL_PATH.TRADE) {
      data = getTradePageTableData(iGainTermsInfo, selectedChain, userInfos, fixedApyMap, yearnTokenPrices);
    } else if (location.pathname === INTERNAL_PATH.POOL) {
      data = getPoolPageTableData(
        iGainTermsInfo,
        selectedChain,
        userInfos,
        termVolumes,
        feeApy,
        rewardAprInfo,
        protocolTokenApy,
      );
    }
    return data;
  }, [iGainTermsInfo, userInfos, location, termVolumes, feeApy, rewardAprInfo, fixedApyList, selectedChain]);

  const displayTermAmount = isShowPositionOnly
    ? tableData?.userPositionTableData[selectedFilterType]?.length
    : tableData?.tableData[selectedFilterType]?.length;

  return (
    <Box position='relative'>
      <TermFilter
        setSelectedFilterType={setSelectedFilterType}
        isShowPositionOnly={isShowPositionOnly}
        setIsShowPositionOnly={setIsShowPositionOnly}
      />
      {!iGainTermsInfo && <LoadingSection />}
      {displayTermAmount && displayTermAmount > 0 ? (
        <TermInfoTable
          data={
            isShowPositionOnly
              ? tableData?.userPositionTableData[selectedFilterType]
              : tableData?.tableData[selectedFilterType]
          }
          columns={TABLE_COLUMNS[location.pathname]}
        />
      ) : (
        <Flex
          direction='column'
          align='center'
          justify='center'
          h='332px'
          mt='1rem'
          borderRadius='0.5rem'
          bg='primary.700'
        >
          <IconOops />
          <Text pt='12px'>No terms for now</Text>
        </Flex>
      )}
    </Box>
  );
}

export default TableContainer;
