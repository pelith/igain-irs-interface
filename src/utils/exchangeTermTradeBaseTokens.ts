import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';

export const exchangeTradeToTermBaseBN = (bn: BigNumber, termBaseTokenPrice: BigNumber, decimalBNUnit: BigNumber) => {
  if (termBaseTokenPrice.eq(decimalBNUnit) || bn.eq(Zero)) {
    return bn;
  } else {
    return bn.mul(decimalBNUnit).div(termBaseTokenPrice);
  }
};

export const exchangeTermToTradeBaseBN = (bn: BigNumber, termBaseTokenPrice: BigNumber, decimalBNUnit: BigNumber) => {
  if (termBaseTokenPrice.eq(decimalBNUnit) || bn.eq(Zero)) {
    return bn;
  } else {
    return termBaseTokenPrice.mul(bn).div(decimalBNUnit);
  }
};

export const mockExchangeTransfer = (bn: BigNumber) => bn;
