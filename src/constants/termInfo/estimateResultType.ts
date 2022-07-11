type EstimateResultType = {
  estimateAmount: string;
  perTokenPrice: string;
  protocolFee?: string;
  priceImpact?: number;
  hedgeAmount?: string;
  fixedApy?: number;
  correspondAmount?: string;
  protocolTokenName?: string;
};

export default EstimateResultType;
