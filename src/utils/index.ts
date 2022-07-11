import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import JSBI from 'jsbi';
import { IGainTerm } from '../constants/termInfo/iGainTermData';

function floor(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Number(Math.floor(value * multiplier) / multiplier);
}

export function sqrt(x: BigNumber): BigNumber {
  let z = x.div(2).add(1);
  let y = x;
  while (z.lt(y)) {
    y = z;
    z = x.div(z).add(z).div(2);
  }
  return y;
}

export function formatZeroOrUndefined(amount: number | string | undefined, toFixedValue?: number) {
  const processAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (processAmount == null || isNaN(processAmount)) {
    return '-';
  } else if (processAmount === 0) {
    return '0';
  } else {
    return toFixedValue ? processAmount.toFixed(toFixedValue) : processAmount.toString();
  }
}

export function formattedUnitToAmount(formattedBNString: string, displayDecimals: number = 4) {
  const number = parseFloat(formattedBNString);
  return floor(number, displayDecimals).toFixed(displayDecimals);
}

export function formatAmount(amount: BigNumber | undefined, baseDecimals: number, displayDecimals: number = 4) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}'.`);
  }

  if (!amount || amount.isZero()) {
    return '0';
  }

  return formatZeroOrUndefined(formatUnits(amount, baseDecimals), displayDecimals);
}

export function formatPercentage(originPercentage: string, upperBound = 1000) {
  if (parseFloat(originPercentage) > upperBound) {
    return `> ${upperBound}`;
  }

  return originPercentage;
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// transform timestamp for display
export const transformDate = (timeStamp: number) => {
  const date = new Date(timeStamp);
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    ' ' +
    (date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes())
  );
};

export const transformDateYearToDate = (timeStamp: number) => {
  const date = new Date(timeStamp);
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

export const transformDateHoursToMinutes = (timeStamp: number) => {
  const date = new Date(timeStamp);
  return (
    (date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes())
  );
};

export function formatJsbiAmount(amount: JSBI, baseDecimals: number, displayDecimals: number = 4) {
  return formatAmount(BigNumber.from(amount.toString()), baseDecimals, displayDecimals);
}

export function formatBigNumberDisplay(
  amount: BigNumber | undefined,
  baseDecimals: number,
  displayDecimals: number = 4,
) {
  return formatZeroOrUndefined(amount ? formatUnits(amount, baseDecimals) : undefined, displayDecimals);
}

export function getMockInput(decimals = 18): string {
  if (decimals > 10) {
    return (1 / 1e10).toFixed(10);
  }
  return (1 / 1e2).toFixed(2);
}

export function isTermNeedRefresh(term1: IGainTerm | undefined, term2: IGainTerm | undefined): boolean {
  if (!term1 || !term2) {
    if (!term1 && !term2) {
      return false;
    }
    return true;
  }
  if (
    term1.poolA.toString() !== term2.poolA.toString() ||
    term1.lpTotalSupply.toString() !== term2.lpTotalSupply.toString()
  ) {
    return true;
  }
  return false;
}

export const formattedNum = (num: number, decimal: number = 2) => {
  if (!num) {
    return '0';
  }

  if (num > 1000000) {
    return `${(num / 1000000).toFixed(decimal)}M`;
  }

  if (num > 1000) {
    return `${(num / 1000).toFixed(decimal)}K`;
  }

  if (num < 0.0001 && num > 0) {
    return '< 0.0001';
  }

  return num.toFixed(decimal);
};

export const compareCloseTime = (a: IGainTerm, b: IGainTerm) => {
  if (a.closeTime < b.closeTime) {
    return -1;
  }
  return 1;
};

export const checkIsElementsInArray = (materialArray: string[], targetArray: string[]) =>
  targetArray.every((v) => materialArray.includes(v));
