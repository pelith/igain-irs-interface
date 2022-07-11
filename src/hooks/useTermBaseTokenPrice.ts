import { useCallback, useContext, useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import BaseTokenType from '../constants/termInfo/baseTokenType';
import { YEarnPriceContext } from '../context/YEarnPriceContext';
import ProtocolType from '../constants/termInfo/protocolType';
import { exchangeTradeToTermBaseBN, exchangeTermToTradeBaseBN } from '../utils/exchangeTermTradeBaseTokens';

export type YearnTokenPriceType = {
  [baseTokenType in BaseTokenType]?: BigNumber;
};

export default function useTermBaseTokenPrice(
  decimalBNUnit: BigNumber,
  protocolType?: ProtocolType,
  baseTokenType?: BaseTokenType,
): {
  termBaseTokenPrice: BigNumber;
  exchangeTradeToTermBase: (bn: BigNumber) => BigNumber;
  exchangeTermToTradeBase: (bn: BigNumber) => BigNumber;
} {
  const yearnTokenPrices = useContext(YEarnPriceContext);
  const termBaseTokenPrice = useMemo(
    () =>
      (protocolType === ProtocolType.YEARN && baseTokenType ? yearnTokenPrices[baseTokenType] : undefined) ||
      decimalBNUnit,
    [yearnTokenPrices, baseTokenType],
  );

  const exchangeTradeToTermBase = useCallback(
    (bn) => exchangeTradeToTermBaseBN(bn, termBaseTokenPrice, decimalBNUnit),
    [termBaseTokenPrice],
  );

  const exchangeTermToTradeBase = useCallback(
    (bn) => exchangeTermToTradeBaseBN(bn, termBaseTokenPrice, decimalBNUnit),
    [termBaseTokenPrice],
  );
  return { termBaseTokenPrice, exchangeTradeToTermBase, exchangeTermToTradeBase };
}
