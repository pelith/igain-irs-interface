import { BigNumber } from '@ethersproject/bignumber';

export interface IFixedApyInfos {
  requiredBaseToken?: BigNumber;
  hedgeBaseToken?: BigNumber;
  fixedApy?: number;
  priceImpact?: number;
}
