import { Box, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import EstimateResultType from '../constants/termInfo/estimateResultType';
import TradeCardActionType from '../constants/termInfo/tradeCardActionType';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import { formatPercentage, formatZeroOrUndefined } from '../utils';
import { InfoPair } from './common/InfoPair';

interface TradingExtraInfoProps {
  estimateResult: EstimateResultType;
  cardTab: TradeCardActionType;
  tokenType: TradeTokenType;
  baseTokenName?: string;
  tradeTokenName?: string;
}

interface HedgeInfoProps {
  title: string;
  hedgeAmount?: string;
  amountName?: string;
  correspondAmount?: string;
  correspondTokenName?: string;
}

function HedgeInfo({
  title,
  hedgeAmount,
  amountName,
  correspondAmount,
  correspondTokenName,
}: HedgeInfoProps): ReactElement {
  return (
    <Box mb='1rem'>
      <Text fontWeight='bold' fontSize='xs'>
        {title}
      </Text>
      <Text fontWeight='bold' fontSize='2xl' color='secondary.500'>
        {`${formatZeroOrUndefined(hedgeAmount, 4)} ${amountName}`}
      </Text>
      {correspondTokenName !== amountName && (
        <Text fontSize='sm'>
          ≈ {formatZeroOrUndefined(correspondAmount, 4)} {correspondTokenName}
        </Text>
      )}
    </Box>
  );
}

function TradingExtraInfo({
  estimateResult,
  tokenType,
  cardTab,
  baseTokenName,
  tradeTokenName,
}: TradingExtraInfoProps): ReactElement {
  const hedgeTitle = tokenType === TradeTokenType.LONG ? 'Principal to fix interests' : 'Principal to fix interests';
  const perPriceDisplay =
    estimateResult.perTokenPrice &&
    `1 ${tradeTokenName} = ${formatZeroOrUndefined(estimateResult.perTokenPrice, 4)} ${baseTokenName}`;

  const { priceImpact = 0 } = estimateResult;
  let priceImpactColor = 'neutral';
  if (priceImpact <= -3 && priceImpact > -5) {
    priceImpactColor = 'secondary.500';
  } else if (priceImpact <= -5) {
    priceImpactColor = 'danger';
  }

  return (
    <Box p='1rem' borderRadius='0.5rem' bg='primary.900' mb='1rem'>
      {cardTab === TradeCardActionType.BUY && tokenType !== TradeTokenType.LP && (
        <HedgeInfo
          hedgeAmount={estimateResult.hedgeAmount}
          title={hedgeTitle}
          amountName={estimateResult.protocolTokenName || baseTokenName}
          correspondAmount={estimateResult.correspondAmount}
          correspondTokenName={baseTokenName}
        />
      )}
      <Box>
        <InfoPair name='Price' value={perPriceDisplay} />
        <InfoPair
          name='Estimated Fixed APY'
          value={
            typeof estimateResult.fixedApy === 'number'
              ? `${formatPercentage(formatZeroOrUndefined(estimateResult.fixedApy, 4))}%`
              : undefined
          }
        />
        <InfoPair
          name='Price Impact'
          value={<Text color={priceImpactColor}>{`${formatZeroOrUndefined(estimateResult.priceImpact, 4)}%`}</Text>}
        />
        <InfoPair
          name='Protocol Fee'
          value={
            estimateResult.protocolFee && `${formatZeroOrUndefined(estimateResult.protocolFee, 4)} ${baseTokenName}`
          }
        />
      </Box>
    </Box>
  );
}

export default TradingExtraInfo;
