import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import JSBI from 'jsbi';
import BaseTokenType from '../../constants/termInfo/baseTokenType';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import ProtocolType from '../../constants/termInfo/protocolType';
import { TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import { calcMintTokenInfo } from '../../hooks/useTradeTokenPrice';
import { calToMintExactA } from '../../utils/contractCalc';
import { exchangeTermToTradeBaseBN, exchangeTradeToTermBaseBN } from '../../utils/exchangeTermTradeBaseTokens';
import {
  sqrt,
  formatZeroOrUndefined,
  formattedUnitToAmount,
  formatAmount,
  formatPercentage,
  escapeRegExp,
  transformDate,
  transformDateYearToDate,
  transformDateHoursToMinutes,
  formatJsbiAmount,
  formatBigNumberDisplay,
  getMockInput,
  isTermNeedRefresh,
} from '../../utils/index';

const WEI_PER_ETHER = '1000000000000000000';

test('sqrt', () => {
  expect(sqrt(BigNumber.from(9))).toEqual(BigNumber.from(3));
  expect(sqrt(BigNumber.from(144))).toEqual(BigNumber.from(12));
  expect(sqrt(BigNumber.from(0))).toEqual(BigNumber.from(0));
  expect(sqrt(BigNumber.from('100'))).toEqual(BigNumber.from(10));
  expect(sqrt(BigNumber.from('100'))).toEqual(BigNumber.from('10'));
  expect(sqrt(BigNumber.from('0'))).toEqual(BigNumber.from(0));
  expect(sqrt(BigNumber.from('0'))).toEqual(BigNumber.from('0'));
});

test('formatZeroOrUndefined', () => {
  expect(formatZeroOrUndefined(undefined)).toBe('-');
  expect(formatZeroOrUndefined(0)).toBe('0');
  expect(formatZeroOrUndefined(5)).toBe('5');
  expect(formatZeroOrUndefined(5.123, 2)).toBe('5.12');
  expect(formatZeroOrUndefined('0')).toBe('0');
  expect(formatZeroOrUndefined('')).toBe('-');
  expect(formatZeroOrUndefined('100')).toBe('100');
  expect(formatZeroOrUndefined('100.12345', 3)).toBe('100.123');
});

test('formattedUnitToAmount', () => {
  expect(formattedUnitToAmount('1000.123456')).toBe('1000.1234');
  expect(formattedUnitToAmount('1000.123456', 2)).toBe('1000.12');
  expect(formattedUnitToAmount('1')).toBe('1.0000');
  // TOTEST
  // expect(formattedUnitToAmount('')).toBe('NaN');
});

test('formatAmount', () => {
  expect(formatAmount(BigNumber.from(10000000), 6)).toBe('10.0000');
  expect(formatAmount(BigNumber.from(10000000), 6, 6)).toBe('10.000000');
  expect(formatAmount(undefined, 18)).toBe('0');
  expect(formatAmount(BigNumber.from(0), 6)).toBe('0');
  // TOTEST
  // expect(formatAmount(BigNumber.from(0), 20, 18)).toThrowError(
  //   "Invalid combination of baseDecimals '20' and displayDecimals '18'.",
  // );
});

test('formatPercentage', () => {
  expect(formatPercentage('0')).toBe('0');
  expect(formatPercentage('1001')).toBe('> 1000');
  expect(formatPercentage('1000.1')).toBe('> 1000');
  expect(formatPercentage('1000.0000000000001')).toBe('> 1000');
  expect(formatPercentage('999.9')).toBe('999.9');
  expect(formatPercentage('999.99999999999999')).toBe('999.99999999999999');
  expect(formatPercentage('101', 100)).toBe('> 100');
  expect(formatPercentage('99', 100)).toBe('99');
  // TOTEST
  // expect(formatPercentage('aaa')).toBe('aaa');
});

test('escapeRegExp', () => {
  expect(escapeRegExp('abc123')).toBe('abc123');
  expect(escapeRegExp('.')).toBe('\\.');
  expect(escapeRegExp('.*+?^${}()|[]\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
});

test('transformDate', () => {
  expect(transformDate(1645372800000)).toBe('2022-2-21 00:00');
});

test('transformDateYearToDate', () => {
  expect(transformDateYearToDate(1645372800000)).toBe('2022-2-21');
});

test('transformDateHoursToMinutes', () => {
  expect(transformDateHoursToMinutes(1645372800000)).toBe('00:00');
  expect(transformDateHoursToMinutes(1644885186000)).toBe('08:33');
});

test('formatJsbiAmount', () => {
  expect(formatJsbiAmount(JSBI.BigInt(1e6), 6)).toBe('1.0000');
  expect(formatJsbiAmount(JSBI.BigInt(1e18), 18, 4)).toBe('1.0000');
  expect(formatJsbiAmount(JSBI.BigInt(1e18), 18, 6)).toBe('1.000000');
  expect(formatJsbiAmount(JSBI.BigInt(WEI_PER_ETHER), 18, 2)).toBe('1.00');
  expect(formatJsbiAmount(JSBI.BigInt(0), 18, 2)).toBe('0');
  expect(formatJsbiAmount(JSBI.BigInt(''), 18, 2)).toBe('0');
});

test('formatBigNumberDisplay', () => {
  expect(formatBigNumberDisplay(BigNumber.from(1e8), 8, 2)).toBe('1.00');
  expect(formatBigNumberDisplay(BigNumber.from(WEI_PER_ETHER), 18, 2)).toBe('1.00');
});

test('getMockInput', () => {
  expect(getMockInput()).toBe('0.0000000001');
  expect(getMockInput(100)).toBe('0.0000000001');
  expect(getMockInput(10000000)).toBe('0.0000000001');
  expect(getMockInput(8)).toBe('0.01');
  expect(getMockInput(0)).toBe('0.01');
  expect(getMockInput(-5)).toBe('0.01');
  expect(getMockInput(0.014)).toBe('0.01');
});

test('isTermNeedRefresh', () => {
  const testIGainTerm: IGainTerm = {
    address: '0x123',
    tradeBaseTokenType: BaseTokenType.DAI,
    protocolType: ProtocolType.AAVE,
    openTime: 1645459200000,
    closeTime: 1645545600000,
    initialRate: BigNumber.from(100),
    leverage: BigNumber.from(100),
    protocolFee: BigNumber.from(100),
    poolA: BigNumber.from(0),
    poolB: BigNumber.from(0),
    bPrice: BigNumber.from(100),
    fee: BigNumber.from(2),
    lpTotalSupply: BigNumber.from(0),
    decimals: 18,
    canBuy: true,
  };

  expect(isTermNeedRefresh(testIGainTerm, testIGainTerm)).toBe(false);
  expect(isTermNeedRefresh(undefined, undefined)).toBe(false);
  expect(isTermNeedRefresh(testIGainTerm, undefined)).toBe(true);
  expect(isTermNeedRefresh(testIGainTerm, Object.assign({}, testIGainTerm, { poolA: BigNumber.from(100) }))).toBe(true);
  expect(
    isTermNeedRefresh(testIGainTerm, Object.assign({}, testIGainTerm, { lpTotalSupply: BigNumber.from(100) })),
  ).toBe(true);
});

test('validate cal Yearn proxy', () => {
  const testIGainTerm: IGainTerm = {
    address: '0x123',
    tradeBaseTokenType: BaseTokenType.DAI,
    protocolType: ProtocolType.YEARN,
    openTime: 1645459200000,
    closeTime: 1645545600000,
    initialRate: BigNumber.from(0),
    leverage: BigNumber.from('10000000000000000000'),
    protocolFee: BigNumber.from(0),
    poolA: BigNumber.from('200000000000000000000000'),
    poolB: BigNumber.from('100000000000000000000000'),
    bPrice: BigNumber.from(0),
    fee: BigNumber.from('997000000000000000'),
    lpTotalSupply: BigNumber.from(0),
    decimals: 18,
    canBuy: true,
  };

  const termBaseTokenPrice = BigNumber.from('1027884215313491223');
  const WeiPerEther = BigNumber.from(WEI_PER_ETHER);
  const inputBigNumber = BigNumber.from('1680').mul(BigNumber.from(WEI_PER_ETHER));
  const exchangeTradeToTermBase = (bn: BigNumber) => exchangeTradeToTermBaseBN(bn, termBaseTokenPrice, WeiPerEther);
  const exchangeTermToTradeBase = (bn: BigNumber) => exchangeTermToTradeBaseBN(bn, termBaseTokenPrice, WeiPerEther);
  const hedgeBaseToken = exchangeTradeToTermBase(inputBigNumber).mul(WeiPerEther).div(testIGainTerm.leverage);
  const requiredBaseToken = exchangeTermToTradeBase(
    parseUnits(calToMintExactA(hedgeBaseToken, testIGainTerm).toString(), 0),
  );

  const [actualShortResult] = calcMintTokenInfo(
    TradeTokenType.SHORT,
    requiredBaseToken,
    testIGainTerm,
    18,
    exchangeTradeToTermBase,
  );

  const calcIsAffordableDeviation = (expect: number, actual: number) => {
    return Math.abs(1 - actual / expect) < 0.0000001;
  };

  expect(
    calcIsAffordableDeviation(1634.4253321251965, parseFloat(formatUnits(exchangeTradeToTermBase(inputBigNumber)))),
  ).toBe(true);
  expect(
    calcIsAffordableDeviation(
      1579.815516407459,
      parseFloat(formatUnits(exchangeTradeToTermBase(inputBigNumber.sub(requiredBaseToken)))),
    ),
  ).toBe(true);
  expect(calcIsAffordableDeviation(163.44253321251966, parseFloat(formatUnits(hedgeBaseToken)))).toBe(true);
  expect(calcIsAffordableDeviation(163.44253321248132, parseFloat(actualShortResult))).toBe(true);
});
