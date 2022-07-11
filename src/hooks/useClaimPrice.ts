import JSBI from 'jsbi';
import { useMemo } from 'react';
import { WeiPerEther } from '@ethersproject/constants';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { UserInfo } from '../constants/userInfo';
import { mockExchangeTransfer } from '../utils/exchangeTermTradeBaseTokens';

export function useClaimPrice(
  userInfo?: UserInfo,
  iGainTerm?: IGainTerm,
): {
  longBaseTokenValue: JSBI;
  shortBaseTokenValue: JSBI;
  lpBaseTokenValue: JSBI;
  combineProtocolFee: JSBI;
  longBaseTokenPrice: JSBI;
  shortBaseTokenPrice: JSBI;
  lpBaseTokenPrice: JSBI;
} {
  const extendJSBIUnit = useMemo(() => {
    const decimals = iGainTerm?.decimals || 18;
    const decimalUnit = Math.pow(10, 18 - decimals);
    return JSBI.BigInt(decimalUnit);
  }, [iGainTerm]);

  // const { exchangeTermToTradeBase } = useTermBaseTokenPrice(
  //   WeiPerEther,
  //   iGainTerm?.protocolType,
  //   iGainTerm?.tradeBaseTokenType,
  // );

  const exchangeTermToTradeBase = mockExchangeTransfer;

  const baseJSBIUnit = useMemo(() => {
    const decimalUnit = Math.pow(10, 18);
    return JSBI.BigInt(decimalUnit);
  }, [iGainTerm]);

  return useMemo(() => {
    const { BigInt } = JSBI;
    const JSBI_ONE = BigInt(1);
    if (!iGainTerm || !userInfo) {
      return {
        longBaseTokenValue: JSBI_ONE,
        shortBaseTokenValue: JSBI_ONE,
        lpBaseTokenValue: JSBI_ONE,
        combineProtocolFee: JSBI_ONE,
        longBaseTokenPrice: JSBI_ONE,
        shortBaseTokenPrice: JSBI_ONE,
        lpBaseTokenPrice: JSBI_ONE,
      };
    }

    const { multiply, add, divide } = JSBI;
    const bPrice = BigInt(exchangeTermToTradeBase(iGainTerm.bPrice));
    const aPrice = BigInt(exchangeTermToTradeBase(WeiPerEther.sub(iGainTerm.bPrice)));

    const longBaseTokenValue = divide(
      multiply(bPrice, multiply(BigInt(userInfo.longBalance), extendJSBIUnit)),
      baseJSBIUnit,
    );
    const shortBaseTokenValue = divide(
      multiply(aPrice, multiply(BigInt(userInfo.shortBalance), extendJSBIUnit)),
      baseJSBIUnit,
    );

    const lpBaseTokenValueWithWei = add(
      multiply(multiply(BigInt(iGainTerm.poolA), extendJSBIUnit), aPrice),
      multiply(multiply(BigInt(iGainTerm.poolB), extendJSBIUnit), bPrice),
    );
    const lpBaseTokenPrice = divide(lpBaseTokenValueWithWei, multiply(BigInt(iGainTerm.lpTotalSupply), extendJSBIUnit));
    const lpBaseTokenValue = divide(
      multiply(multiply(BigInt(userInfo.lpBalance), extendJSBIUnit), lpBaseTokenPrice),
      baseJSBIUnit,
    );
    const combineProtocolFee = divide(add(add(longBaseTokenValue, shortBaseTokenValue), lpBaseTokenValue), BigInt(100));

    return {
      longBaseTokenValue,
      shortBaseTokenValue,
      lpBaseTokenValue,
      combineProtocolFee,
      longBaseTokenPrice: bPrice,
      shortBaseTokenPrice: aPrice,
      lpBaseTokenPrice,
    };
  }, [userInfo, iGainTerm]);
}
