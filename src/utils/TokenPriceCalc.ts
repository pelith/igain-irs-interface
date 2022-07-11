import { Zero } from '@ethersproject/constants';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { formatAmount } from '.';

function calcPerTokenPrice(estimateResult: string, inputAmount: string, decimals: number): [string, string] {
  const bigNumberResult = parseUnits(estimateResult, decimals); // To check calc formula
  const bigNumberResultDivided = bigNumberResult.gt(0)
    ? bigNumberResult.div(parseUnits('1', decimals))
    : bigNumberResult;
  const estimateAmount = formatUnits(bigNumberResultDivided, decimals);
  const perTokenPriceBigNumber = parseUnits(inputAmount || '0', decimals).gt(0)
    ? bigNumberResult.div(parseUnits(inputAmount || '1', decimals))
    : Zero;
  const perTokenPrice = formatAmount(perTokenPriceBigNumber, decimals, 6);
  return [estimateAmount, perTokenPrice];
}

export { calcPerTokenPrice };
