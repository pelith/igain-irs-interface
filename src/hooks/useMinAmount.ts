import { useContext, useMemo } from 'react';
import JSBI from 'jsbi';
import { SlippageToleranceContext } from '../context/SlippageToleranceContext';

export default function useMinAmount(estimateAmount: string, decimals: number): { minAmount: JSBI } {
  const { slippageTolerance } = useContext(SlippageToleranceContext);
  const decimalUnit = useMemo(() => Math.pow(10, decimals), [decimals]);
  const { divide, multiply, BigInt } = JSBI;
  const minAmount = useMemo(
    () =>
      divide(
        multiply(
          BigInt(Math.floor(parseFloat(estimateAmount) * decimalUnit)),
          BigInt(Math.floor((1 - parseFloat(slippageTolerance)) * decimalUnit)),
        ),
        BigInt(decimalUnit),
      ),
    [estimateAmount, slippageTolerance, decimalUnit],
  );
  return { minAmount };
}
