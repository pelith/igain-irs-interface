import { formatUnits, parseUnits } from 'ethers/lib/utils';
import JSBI from 'jsbi';
import { useCallback, useContext, useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import TradeCardActionType from '../constants/termInfo/tradeCardActionType';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import { burnLpToken, burnTokenWithRoundData, mintLpToken, mintTokenWithRoundData } from '../utils/contractCalc';
import { calcPerTokenPrice } from '../utils/TokenPriceCalc';
import { getMockInput } from '../utils';
import ProtocolType from '../constants/termInfo/protocolType';
import { YEarnPriceContext } from '../context/YEarnPriceContext';
import { exchangeTermToTradeBaseBN, exchangeTradeToTermBaseBN } from '../utils/exchangeTermTradeBaseTokens';

export const calcMintTokenInfo = (
  tokenType: TradeTokenType,
  inputBigNumber: BigNumber,
  iGainTermInfo: IGainTerm,
  decimals: number,
  exchangeTradeToTermBase: (bn: BigNumber) => BigNumber,
): [string, string] => {
  const termBaseInputBn = exchangeTradeToTermBase(inputBigNumber);
  const mintStringResult = mintTokenWithRoundData(tokenType, termBaseInputBn, iGainTermInfo).toString();
  const [estimateAmount, mintTokenPrice] = calcPerTokenPrice(
    mintStringResult,
    formatUnits(termBaseInputBn, decimals),
    decimals,
  );
  const reciprocal = parseFloat(mintTokenPrice) > 0 ? 1 / parseFloat(mintTokenPrice) : 0;
  return [estimateAmount, reciprocal.toFixed(4)];
};

const calcBurnTokenInfo = (
  tokenType: TradeTokenType,
  inputBigNumber: BigNumber,
  iGainTermInfo: IGainTerm,
  decimals: number,
  decimalJSBIUnit: JSBI,
  inputAmount: string,
  exchangeTermToTradeBase: (bn: BigNumber) => BigNumber,
): [string, string, string] => {
  const burnResult = burnTokenWithRoundData(tokenType, inputBigNumber, iGainTermInfo);
  const protocolFeeBigNumber = JSBI.divide(
    JSBI.multiply(burnResult, JSBI.BigInt(iGainTermInfo?.protocolFee || Math.pow(10, decimals - 2))),
    decimalJSBIUnit,
  );
  const subtractBurResult = JSBI.subtract(burnResult, protocolFeeBigNumber);
  const [estimateAmount, burnTokenPrice] = calcPerTokenPrice(subtractBurResult.toString(), inputAmount, decimals);
  const protocolFee = formatUnits(exchangeTermToTradeBase(BigNumber.from(protocolFeeBigNumber.toString())), decimals);
  return [
    formatUnits(exchangeTermToTradeBase(parseUnits(estimateAmount, decimals)), decimals),
    burnTokenPrice,
    protocolFee,
  ];
};

const calcMintLpTokenInfo = (
  inputBigNumber: BigNumber,
  iGainTermInfo: IGainTerm,
  decimals: number,
  exchangeTradeToTermBase: (bn: BigNumber) => BigNumber,
): [string, string] => {
  const termBaseInputBn = exchangeTradeToTermBase(inputBigNumber);
  const mintResult = mintLpToken(termBaseInputBn, iGainTermInfo);
  const [estimateAmount, mintTokenPrice] = calcPerTokenPrice(
    mintResult.toString(),
    formatUnits(termBaseInputBn, decimals),
    decimals,
  );
  const reciprocal = parseFloat(mintTokenPrice) > 0 ? 1 / parseFloat(mintTokenPrice) : 0;
  return [estimateAmount, reciprocal.toFixed(4)];
};

const calcBurnLpTokenInfo = (
  inputBigNumber: BigNumber,
  iGainTermInfo: IGainTerm,
  decimals: number,
  decimalJSBIUnit: JSBI,
  inputAmount: string,
  exchangeTermToTradeBase: (bn: BigNumber) => BigNumber,
): [string, string, string] => {
  const burnResult = burnLpToken(inputBigNumber, iGainTermInfo);
  const biProtocolFee = JSBI.BigInt(iGainTermInfo.protocolFee.toString() || Math.pow(10, decimals - 2));
  const protocolFeeAmount = JSBI.divide(JSBI.multiply(burnResult, biProtocolFee), decimalJSBIUnit);
  const subtractBurnResult = JSBI.subtract(burnResult, protocolFeeAmount);
  const [estimateAmount, burnTokenPrice] = calcPerTokenPrice(subtractBurnResult.toString(), inputAmount, decimals);
  const protocolFee = formatUnits(exchangeTermToTradeBase(BigNumber.from(protocolFeeAmount.toString())), decimals);
  return [
    formatUnits(exchangeTermToTradeBase(parseUnits(estimateAmount, decimals)), decimals),
    burnTokenPrice,
    protocolFee,
  ];
};

export function useTradeTokenPrice(
  tokenType: TradeTokenType,
  cardTabType: TradeCardActionType,
  inputAmount: string,
  exchangeTermToTradeBase: (bn: BigNumber) => BigNumber,
  exchangeTradeToTermBase: (bn: BigNumber) => BigNumber,
  iGainTermInfo?: IGainTerm,
): [string, string, string?] {
  const decimalVariables = useMemo(() => {
    const decimals = iGainTermInfo?.decimals || 18;
    const inputBigNumber = parseUnits(inputAmount || '0', decimals);
    const decimalUnit = Math.pow(10, decimals);
    const decimalJSBIUnit = JSBI.BigInt(decimalUnit);
    return { decimals, inputBigNumber, decimalJSBIUnit };
  }, [iGainTermInfo, inputAmount]);

  const getMintTokenInfo = useCallback(
    (termInfo): [string, string] => {
      return calcMintTokenInfo(
        tokenType,
        decimalVariables.inputBigNumber,
        termInfo,
        decimalVariables.decimals,
        exchangeTradeToTermBase,
      );
    },
    [tokenType, inputAmount, decimalVariables, exchangeTradeToTermBase],
  );

  const getBurnTokenInfo = useCallback(
    (termInfo): [string, string, string?] => {
      return calcBurnTokenInfo(
        tokenType,
        decimalVariables.inputBigNumber,
        termInfo,
        decimalVariables.decimals,
        decimalVariables.decimalJSBIUnit,
        inputAmount,
        exchangeTermToTradeBase,
      );
    },
    [tokenType, inputAmount, decimalVariables, exchangeTermToTradeBase],
  );

  const getBurnLpTokenInfo = useCallback(
    (termInfo): [string, string, string?] => {
      return calcBurnLpTokenInfo(
        decimalVariables.inputBigNumber,
        termInfo,
        decimalVariables.decimals,
        decimalVariables.decimalJSBIUnit,
        inputAmount,
        exchangeTermToTradeBase,
      );
    },
    [tokenType, inputAmount, decimalVariables, exchangeTermToTradeBase],
  );

  const getMintLpTokenInfo = useCallback(
    (termInfo): [string, string, string?] => {
      return calcMintLpTokenInfo(
        decimalVariables.inputBigNumber,
        termInfo,
        decimalVariables.decimals,
        exchangeTradeToTermBase,
      );
    },
    [tokenType, inputAmount, decimalVariables, exchangeTradeToTermBase],
  );

  return useMemo(() => {
    if (!iGainTermInfo) {
      return ['0', '0'];
    }
    if (tokenType === TradeTokenType.LP) {
      if (cardTabType === TradeCardActionType.BUY) {
        return getMintLpTokenInfo(iGainTermInfo);
      }
      return getBurnLpTokenInfo(iGainTermInfo);
    }
    if (cardTabType === TradeCardActionType.BUY) {
      return getMintTokenInfo(iGainTermInfo);
    }
    return getBurnTokenInfo(iGainTermInfo);
  }, [tokenType, cardTabType, inputAmount, iGainTermInfo]);
}

export function useTradeTokenStandardPrices(
  tokenType: TradeTokenType,
  cardTabType: TradeCardActionType,
  iGainTermInfos?: IGainTerm[],
): [string, string, string?][] {
  const yearnTokenPrices = useContext(YEarnPriceContext);
  return useMemo(() => {
    if (!iGainTermInfos) {
      return [];
    }
    return iGainTermInfos.map((iGainTermInfo) => {
      const decimals = iGainTermInfo?.decimals || 18;
      const inputAmount = getMockInput(decimals);
      const inputBigNumber = parseUnits(inputAmount || '0', decimals);
      const decimalUnit = Math.pow(10, decimals);
      const decimalBNUnit = parseUnits('1', decimals);
      const decimalJSBIUnit = JSBI.BigInt(decimalUnit);
      const termBaseTokenPrice =
        (iGainTermInfo.protocolType === ProtocolType.YEARN && iGainTermInfo.tradeBaseTokenType
          ? yearnTokenPrices[iGainTermInfo.tradeBaseTokenType]
          : undefined) || decimalBNUnit;

      const exchangeTradeToTermBase = (bn: BigNumber) =>
        exchangeTradeToTermBaseBN(bn, termBaseTokenPrice, decimalBNUnit);

      const exchangeTermToTradeBase = (bn: BigNumber) =>
        exchangeTermToTradeBaseBN(bn, termBaseTokenPrice, decimalBNUnit);

      if (tokenType === TradeTokenType.LP) {
        if (cardTabType === TradeCardActionType.BUY) {
          return calcMintLpTokenInfo(inputBigNumber, iGainTermInfo, decimals, exchangeTradeToTermBase);
        }
        return calcBurnLpTokenInfo(
          inputBigNumber,
          iGainTermInfo,
          decimals,
          decimalJSBIUnit,
          inputAmount,
          exchangeTermToTradeBase,
        );
      }
      if (cardTabType === TradeCardActionType.BUY) {
        return calcMintTokenInfo(tokenType, inputBigNumber, iGainTermInfo, decimals, exchangeTradeToTermBase);
      }
      return calcBurnTokenInfo(
        tokenType,
        inputBigNumber,
        iGainTermInfo,
        decimals,
        decimalJSBIUnit,
        inputAmount,
        exchangeTermToTradeBase,
      );
    });
  }, [tokenType, cardTabType, iGainTermInfos]);
}
