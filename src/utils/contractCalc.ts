import JSBI from 'jsbi';
import { BigNumber } from '@ethersproject/bignumber';
import { WeiPerEther } from '@ethersproject/constants';
import { LENDING_APY_PARAMS_AAVE, YEAR_SECONDS } from '../constants';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import BaseTokenType from '../constants/termInfo/baseTokenType';

const WeiPerEtherJSBIUnit = JSBI.BigInt(Math.pow(10, 18));

function getAmountOut(
  amountIn: BigNumber,
  reserveIn: BigNumber,
  reserveOut: BigNumber,
  fee: BigNumber,
  decimals: number,
) {
  const { multiply, add, BigInt, divide } = JSBI;
  const decimalJSBIUnit = BigInt(Math.pow(10, decimals));
  const amountInWithFee = multiply(BigInt(amountIn), BigInt(fee));
  const numerator = multiply(amountInWithFee, BigInt(reserveOut));
  const denominator = add(multiply(BigInt(reserveIn), decimalJSBIUnit), amountInWithFee);
  return divide(numerator, denominator);
}

function mintToken(
  originalTokenAmount: BigNumber,
  mintPool: BigNumber,
  oppositePool: BigNumber,
  fee: BigNumber,
  decimals: number,
) {
  const { equal, BigInt, add } = JSBI;
  const JSBI_ZERO = BigInt(0);
  if (
    equal(BigInt(originalTokenAmount), JSBI_ZERO) ||
    equal(BigInt(mintPool), JSBI_ZERO) ||
    equal(BigInt(oppositePool), JSBI_ZERO)
  )
    return JSBI_ZERO;

  return add(getAmountOut(originalTokenAmount, oppositePool, mintPool, fee, decimals), BigInt(originalTokenAmount));
}

function mintTokenWithRoundData(type: TradeTokenType, originalTokenAmount: BigNumber, termData?: IGainTerm): JSBI {
  if (!termData) {
    return JSBI.BigInt(0);
  }

  if (type === TradeTokenType.SHORT) {
    return mintToken(originalTokenAmount, termData.poolA, termData.poolB, termData.fee, termData.decimals);
  }
  return mintToken(originalTokenAmount, termData.poolB, termData.poolA, termData.fee, termData.decimals);
}

function ilog2(n: JSBI) {
  const { add, BigInt, greaterThanOrEqual, exponentiate, multiply, subtract } = JSBI;
  let i = BigInt(0);
  while (greaterThanOrEqual(n, exponentiate(BigInt(2), exponentiate(BigInt(2), i)))) {
    i = add(i, BigInt(1));
  }
  let e = BigInt(0);
  let t = BigInt(1);
  while (greaterThanOrEqual(i, BigInt(0))) {
    let b = exponentiate(BigInt(2), i);
    if (greaterThanOrEqual(n, multiply(t, exponentiate(BigInt(2), b)))) {
      t = multiply(t, exponentiate(BigInt(2), b));
      e = add(e, b);
    }
    i = subtract(i, BigInt(1));
  }
  return e;
}

function sqrt(value: JSBI) {
  const { multiply, add, BigInt, divide, exponentiate, greaterThan, lessThan } = JSBI;
  if (lessThan(value, BigInt(0))) {
    throw new Error('square root of negative numbers is not supported');
  }

  let e = ilog2(value);
  if (lessThan(e, BigInt(2))) {
    return BigInt(1);
  }

  let f = add(divide(e, BigInt(4)), BigInt(1));
  let x = multiply(
    add(sqrt(divide(value, exponentiate(BigInt(2), multiply(f, BigInt(2))))), BigInt(1)),
    exponentiate(BigInt(2), f),
  );
  let xprev = add(x, BigInt(1));
  while (greaterThan(xprev, x)) {
    xprev = x;
    x = divide(add(x, divide(value, x)), BigInt(2));
  }
  return xprev;
}

function calcMarkPrice(targetPool: BigNumber, oppositePool: BigNumber, decimalBNUnit: BigNumber) {
  const { add, BigInt, divide, multiply } = JSBI;
  return divide(multiply(BigInt(oppositePool), BigInt(decimalBNUnit)), add(BigInt(targetPool), BigInt(oppositePool)));
}

function calcLpMarkPrice(poolA: BigNumber, poolB: BigNumber, totalSupply: BigNumber, decimals: number) {
  const { add, BigInt, divide, multiply } = JSBI;
  const decimalJSBIUnit = BigInt(Math.pow(10, decimals));
  const jsbiPoolA = BigInt(poolA);
  const jsbiPoolB = BigInt(poolB);

  return divide(
    multiply(divide(multiply(BigInt(2), multiply(jsbiPoolA, jsbiPoolB)), add(jsbiPoolA, jsbiPoolB)), decimalJSBIUnit),
    BigInt(totalSupply),
  );
}

function swapPartialHelper(
  amountIn: JSBI,
  reserveInPool: JSBI,
  oppositePool: JSBI,
  fee: JSBI,
  devisorDecimal: JSBI,
): JSBI {
  const { multiply, add, BigInt, divide, subtract } = JSBI;
  const r = divide(
    multiply(multiply(multiply(amountIn, BigInt(4)), reserveInPool), fee),
    multiply(devisorDecimal, devisorDecimal),
  );
  let numerator = add(divide(multiply(subtract(oppositePool, amountIn), fee), devisorDecimal), reserveInPool);
  numerator = subtract(
    sqrt(multiply(add(divide(multiply(numerator, numerator), devisorDecimal), r), devisorDecimal)),
    numerator,
  );
  numerator = multiply(numerator, devisorDecimal);
  const denominator = multiply(fee, BigInt(2));
  return divide(numerator, denominator);
}

function calToMintExactA(exactA: BigNumber, termData?: IGainTerm) {
  if (!termData) {
    return JSBI.BigInt(0);
  }
  const { BigInt } = JSBI;
  const amount = swapPartialHelper(
    BigInt(exactA),
    BigInt(termData.poolB),
    BigInt(termData.poolA),
    BigInt(termData.fee),
    BigInt(parseUnits('1', termData.decimals)),
  );

  return amount;
}

function calToMintExactB(exactB: BigNumber, termData?: IGainTerm) {
  if (!termData) {
    return JSBI.BigInt(0);
  }
  const { BigInt } = JSBI;
  const amount = swapPartialHelper(
    BigInt(exactB),
    BigInt(termData.poolA),
    BigInt(termData.poolB),
    BigInt(termData.fee),
    BigInt(parseUnits('1', termData.decimals)),
  );

  return amount;
}

function burnToken(
  burnTokenAmount: BigNumber,
  burnPool: BigNumber,
  oppositePool: BigNumber,
  fee: BigNumber,
  decimals: number,
) {
  const { subtract, BigInt } = JSBI;
  const burnTokenAmountBigInt = BigInt(burnTokenAmount);
  const x = swapPartialHelper(
    burnTokenAmountBigInt,
    BigInt(burnPool),
    BigInt(oppositePool),
    BigInt(fee),
    BigInt(parseUnits('1', decimals)),
  );
  return subtract(burnTokenAmountBigInt, x);
}

function burnTokenWithRoundData(type: TradeTokenType, burnTokenAmount: BigNumber, termData?: IGainTerm): JSBI {
  if (!termData) {
    return JSBI.BigInt(0);
  }
  if (type === TradeTokenType.SHORT) {
    return burnToken(burnTokenAmount, termData.poolA, termData.poolB, termData.fee, termData.decimals);
  }
  return burnToken(burnTokenAmount, termData.poolB, termData.poolA, termData.fee, termData.decimals);
}

function burnLpToken(burnTokenAmount: BigNumber, termData?: IGainTerm): JSBI {
  const { multiply, divide, add, equal, subtract, BigInt, lessThan } = JSBI;
  const lpInputAmount = BigInt(burnTokenAmount.toString());
  if (!termData || equal(lpInputAmount, BigInt(0))) {
    return JSBI.BigInt(0);
  }
  const biTotalSupply = BigInt(termData.lpTotalSupply.toString());
  if (!lessThan(lpInputAmount, biTotalSupply)) {
    return JSBI.BigInt(0);
  }
  const extendJSBIUnit = BigInt(Math.pow(10, 18 - (termData?.decimals || 0)));
  const biPoolA = BigInt(termData.poolA.toString());
  const biPoolB = BigInt(termData.poolB.toString());
  const biFee = multiply(BigInt(termData.fee.toString()), extendJSBIUnit);

  let s, f, amount;
  s = add(biPoolA, biPoolB);
  f = divide(multiply(biFee, lpInputAmount), biTotalSupply);

  amount = divide(multiply(multiply(multiply(biPoolA, biPoolB), BigInt(4)), f), WeiPerEtherJSBIUnit);
  amount = divide(multiply(amount, subtract(multiply(BigInt(2), WeiPerEtherJSBIUnit), f)), WeiPerEtherJSBIUnit);
  amount = sqrt(subtract(multiply(s, s), amount));
  amount = divide(subtract(s, amount), BigInt(2));
  return amount;
}

function mintLpToken(originalTokenAmount: BigNumber, termData?: IGainTerm): JSBI {
  const { multiply, divide, add, equal, subtract, BigInt } = JSBI;

  const lpInputAmount = BigInt(originalTokenAmount.toString());
  if (!termData || equal(lpInputAmount, BigInt(0))) {
    return JSBI.BigInt(0);
  }
  const biTotalSupply = BigInt(termData.lpTotalSupply.toString());

  const biPoolA = BigInt(termData.poolA.toString());
  const biPoolB = BigInt(termData.poolB.toString());
  const biFee = BigInt(termData.fee.toString());
  const decimalJSBIUnit = BigInt(Math.pow(10, termData?.decimals || 18));
  let kInitial,
    kAfterMint,
    estimateAmount = JSBI.BigInt(0);
  if (lpInputAmount && biTotalSupply && biPoolA && biPoolB && biFee) {
    kInitial = sqrt(multiply(biPoolA, biPoolB));
    kAfterMint = sqrt(multiply(add(biPoolA, lpInputAmount), add(biPoolB, lpInputAmount)));

    estimateAmount = divide(
      multiply(
        subtract(divide(multiply(kAfterMint, WeiPerEtherJSBIUnit), kInitial), WeiPerEtherJSBIUnit),
        biTotalSupply,
      ),
      WeiPerEtherJSBIUnit,
    );
    estimateAmount = divide(multiply(estimateAmount, biFee), decimalJSBIUnit);
  }

  return estimateAmount;
}

function calcRatioApy(
  nowRate: BigNumber,
  initialRate: BigNumber,
  leverage: BigNumber,
  closeTime: number,
  avgPrice: BigNumber,
  decimals: number,
): number {
  const decimalBNUnit = parseUnits('1', decimals);
  const currentTime = Date.now();
  const nowRatio = nowRate.mul(decimalBNUnit).div(initialRate);
  const avgRatio = avgPrice.mul(WeiPerEther).div(leverage).add(decimalBNUnit);
  const deltaRatio = parseFloat(
    formatUnits(avgRatio.mul(decimalBNUnit).div(nowRatio.isZero() ? 1 : nowRatio), decimals),
  );
  const apy = (deltaRatio ** (YEAR_SECONDS / (closeTime - currentTime / 1000)) - 1) * 100;
  return apy;
}

function calcApyFromApr(apr: number) {
  return Math.pow(2.718, apr) - 1;
}

function calcLendFixedApy(borrowApy: number, baseTokenType: BaseTokenType) {
  const apyParams = LENDING_APY_PARAMS_AAVE[baseTokenType];
  if (!apyParams) {
    return 0;
  }

  if (borrowApy < 0) {
    return borrowApy;
  }

  if (borrowApy < calcApyFromApr(apyParams.slope1)) {
    return (apyParams.optimal / apyParams.slope1) * borrowApy ** 2 * (1 - apyParams.reserve) * 100;
  }

  return (
    ((1 / apyParams.slope2) * (borrowApy - apyParams.slope1) * (1 - apyParams.optimal) + apyParams.optimal) *
    borrowApy *
    (1 - apyParams.reserve) *
    100
  );
}

export {
  mintToken,
  mintTokenWithRoundData,
  burnTokenWithRoundData,
  calcMarkPrice,
  calcLpMarkPrice,
  calToMintExactA,
  calToMintExactB,
  getAmountOut,
  mintLpToken,
  burnLpToken,
  calcRatioApy,
  calcLendFixedApy,
};
