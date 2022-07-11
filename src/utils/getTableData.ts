import { BigNumber } from '@ethersproject/bignumber';
import { Zero, One } from '@ethersproject/constants';
import { parseUnits } from 'ethers/lib/utils';
import JSBI from 'jsbi';
import cloneDeep from 'lodash.clonedeep';
import { formatAmount, formatBigNumberDisplay, formatJsbiAmount, formatZeroOrUndefined } from '.';
import { ChainId } from '../constants';
import { INTERNAL_PATH } from '../constants/links';
import { PoolPageDataProps, TradePageDataProps } from '../constants/tableData';
import { PureBaseTokenTypeKeys } from '../constants/termInfo/baseTokenType';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import ProtocolType from '../constants/termInfo/protocolType';
import { UserInfo } from '../constants/userInfo';
import { YearnTokenPriceType } from '../hooks/useYEarnPrice';
import { calcMarkPrice } from './contractCalc';

const getTradePageTableData = (
  iGainTermsInfo: IGainTerm[] | undefined,
  selectedChain: ChainId,
  userInfos: UserInfo[] | undefined,
  fixedApyMap: { [key: string]: number | undefined },
  yearnTokenPrices: YearnTokenPriceType,
) => {
  const data: TradePageDataProps[] = [];
  const userPositionData: TradePageDataProps[] = [];

  iGainTermsInfo?.forEach((term, index) => {
    const decimalBNUnit = parseUnits('1', term.decimals);
    const JsbiDecimalUnit = JSBI.BigInt(decimalBNUnit.toString());
    let markLongPrice = calcMarkPrice(term.poolB, term.poolA, decimalBNUnit);
    let markShortPrice = calcMarkPrice(term.poolA, term.poolB, decimalBNUnit);

    if (term.protocolType === ProtocolType.YEARN) {
      const multiplier = yearnTokenPrices[term.tradeBaseTokenType] || One;
      markLongPrice = JSBI.divide(JSBI.multiply(markLongPrice, JSBI.BigInt(multiplier.toString())), JsbiDecimalUnit);
      markShortPrice = JSBI.divide(JSBI.multiply(markShortPrice, JSBI.BigInt(multiplier.toString())), JsbiDecimalUnit);
    }

    let tradeTableData: TradePageDataProps = {
      proxyType: term.protocolType,
      baseToken: term.tradeBaseTokenType,
      expiryTime: term.closeTime,
      markApy: {
        apy: formatZeroOrUndefined(fixedApyMap?.[term.address], 2),
        isExpired: term.closeTime * 1000 < Date.now(),
      },
      markPrice: [
        formatJsbiAmount(markLongPrice, term.decimals, 2),
        formatJsbiAmount(markShortPrice, term.decimals, 2),
      ],
      leverage: `${formatAmount(term?.leverage, 18, 0)}x`,
      balance: [
        formatBigNumberDisplay(userInfos?.[index]?.longBalance, term.decimals, 2),
        formatBigNumberDisplay(userInfos?.[index]?.shortBalance, term.decimals, 2),
      ],
      detailPath: `${INTERNAL_PATH.TRADE_DETAIL}/${term.address}?targetChain=${selectedChain}`,
    };
    // remove parts that do not need to be displayed.
    // all we need is active term or user have position.
    if (
      tradeTableData.expiryTime * 1000 > Date.now() ||
      parseFloat(tradeTableData.balance[0] ? tradeTableData.balance[0] : '0') > 0 ||
      parseFloat(tradeTableData.balance[1] ? tradeTableData.balance[1] : '0') > 0
    ) {
      data.push(tradeTableData);
      if (
        parseFloat(tradeTableData.balance[0] ? tradeTableData.balance[0] : '0') > 0 ||
        parseFloat(tradeTableData.balance[1] ? tradeTableData.balance[1] : '0') > 0
      ) {
        userPositionData.push(tradeTableData);
      }
    }
  });

  // Classified data based on baseToken for termFilter
  let filteredData: { [key: string]: TradePageDataProps[] | undefined } = {};
  let filteredUserPositionData: { [key: string]: TradePageDataProps[] | undefined } = {};
  let filterOptions = cloneDeep(PureBaseTokenTypeKeys);
  filterOptions.unshift('All');
  filterOptions.forEach((option) => {
    if (option === 'All') {
      filteredData.All = data;
      filteredUserPositionData.All = userPositionData;
    } else {
      filteredData[option] = data.filter((term) => term.baseToken === option);
      filteredUserPositionData[option] = userPositionData.filter((term) => term.baseToken === option);
    }
  });

  return {
    tableData: filteredData,
    userPositionTableData: filteredUserPositionData,
  };
};

export const getPoolPageTableData = (
  iGainTermsInfo: IGainTerm[] | undefined,
  selectedChain: ChainId,
  userInfos: UserInfo[] | undefined,
  termVolumes?: BigNumber[],
  feeApy?: BigNumber[],
  rewardAprInfo?: BigNumber[],
  protocolTokenApy?: BigNumber[],
) => {
  // prepare data structure
  const data: PoolPageDataProps[] = [];
  const userPositionData: PoolPageDataProps[] = [];
  iGainTermsInfo?.forEach((term, index) => {
    const volumeValue = formatBigNumberDisplay(termVolumes?.[index], term.decimals, 2);
    let totalApy;
    const isExpired = term.closeTime * 1000 < Date.now();
    if (
      feeApy &&
      rewardAprInfo &&
      protocolTokenApy &&
      feeApy.length === iGainTermsInfo.length &&
      rewardAprInfo.length === iGainTermsInfo.length &&
      protocolTokenApy.length === iGainTermsInfo.length
    ) {
      const termFeeApy = feeApy[index] || Zero;
      const termRewardApy = rewardAprInfo[index] || Zero;
      const termProtocolTokenApy = protocolTokenApy[index] || Zero;
      totalApy = [
        formatAmount(
          termFeeApy.add(termRewardApy.div(10 ** (18 - term.decimals))).add(termProtocolTokenApy),
          term.decimals,
          2,
        ),
        formatAmount(termFeeApy, term.decimals, 2),
        formatAmount(termRewardApy, 18, 2),
        formatAmount(termProtocolTokenApy, term.decimals, 2),
      ];
    }

    let poolTableData: PoolPageDataProps = {
      proxyType: term.protocolType,
      baseToken: term.tradeBaseTokenType,
      expiryTime: term.closeTime,
      apy: totalApy,
      volume: isExpired ? '' : volumeValue,
      farmingAddress: term.farmAddress,
      balance: formatBigNumberDisplay(userInfos?.[index]?.lpBalance, term.decimals, 2),
      detailPath: `${INTERNAL_PATH.POOL_DETAIL}/${term.address}?targetChain=${selectedChain}`,
    };
    // remove parts that do not need to be displayed.
    // all we need is active term or user have position.
    if (
      poolTableData.expiryTime * 1000 > Date.now() ||
      parseFloat(poolTableData.balance ? poolTableData.balance : '0') > 0
    ) {
      data.push(poolTableData);
      if (parseFloat(poolTableData.balance ? poolTableData.balance : '0') > 0) {
        userPositionData.push(poolTableData);
      }
    }
  });

  // Classified data based on baseToken for termFilter
  let filteredData: { [key: string]: PoolPageDataProps[] | undefined } = {};
  let filteredUserPositionData: { [key: string]: PoolPageDataProps[] | undefined } = {};
  let filterOptions = cloneDeep(PureBaseTokenTypeKeys);
  filterOptions.unshift('All');
  filterOptions.forEach((option) => {
    if (option === 'All') {
      filteredData.All = data;
      filteredUserPositionData.All = userPositionData;
    } else {
      filteredData[option] = data.filter((term) => term.baseToken === option);
      filteredUserPositionData[option] = userPositionData.filter((term) => term.baseToken === option);
    }
  });

  return {
    tableData: filteredData,
    userPositionTableData: filteredUserPositionData,
  };
};

export default getTradePageTableData;
