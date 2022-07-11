/* eslint-disable react/no-children-prop */
import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { Box, Center, Divider, Flex, VStack, Text, Button, Collapse } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { formatUnits } from 'ethers/lib/utils';
import SlippageSettingSelector from './SlippageSettingSelector';
import TradingExtraInfo from './TradingExtraInfo';
import CommonTooltip from './CommonTooltip';
import { TradeTokenConfig, TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import TradeCardActionType from '../constants/termInfo/tradeCardActionType';
import EstimateResultType from '../constants/termInfo/estimateResultType';
import BaseTokenType from '../constants/termInfo/baseTokenType';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import { formatBigNumberDisplay, formatZeroOrUndefined } from '../utils';
import { ReactComponent as IconArrowDown } from '../assets/icon-arrow-down.svg';
import { AmountInput } from './common/AmountInput';
import { AmountOutput } from './common/AmountOutput';

interface TradeTokenCardProps {
  tokenType: TradeTokenType;
  tokenBalance?: BigNumber;
  baseTokenBalance?: BigNumber;
  baseTokenType?: BaseTokenType;
  cardTab: TradeCardActionType;
  inputAmount?: string;
  estimateResult: EstimateResultType;
  isExceedBalance?: boolean;
  setInputAmount: (input: string) => void;
  setCardTab: (cardTab: TradeCardActionType) => void;
  renderActionButton: () => React.ReactElement;
  renderFooterAction: () => React.ReactElement;
}

function TradeTokenCard({
  tokenType,
  cardTab,
  inputAmount,
  baseTokenType,
  tokenBalance = Zero,
  baseTokenBalance = Zero,
  estimateResult,
  isExceedBalance,
  setCardTab,
  setInputAmount,
  renderActionButton,
  renderFooterAction,
}: TradeTokenCardProps): ReactElement {
  const tokenInfo = TradeTokenConfig[tokenType];
  const { TokenIcon, title, subtitle, tooltips, buyLabel, sellLabel } = tokenInfo;
  const [isFocusedFromInput, setIsFocusedFromInput] = useState(false);

  const baseTokenInfo = useMemo(() => baseTokenType && BASE_TOKEN_DATA[baseTokenType], [baseTokenType]);
  const tradeTokenInfo = useMemo(() => tokenType && TradeTokenConfig[tokenType], [tokenType]);
  const decimals = baseTokenInfo?.decimals || 18;
  const tokensInfo = useMemo(() => {
    const baseTokenBalanceAmount = formatBigNumberDisplay(baseTokenBalance, decimals, 4);
    const tokenBalanceAmount = formatBigNumberDisplay(tokenBalance, decimals, 4);
    const onClickFromMax = () => {
      setInputAmount(
        cardTab === TradeCardActionType.BUY
          ? formatUnits(baseTokenBalance, decimals)
          : formatUnits(tokenBalance, decimals),
      );
    };

    return cardTab === TradeCardActionType.BUY
      ? {
          from: baseTokenInfo?.name,
          fromBalance: formatZeroOrUndefined(baseTokenBalanceAmount, 4),
          onClickFromMax,
          to: tradeTokenInfo.title,
          toBalance: formatZeroOrUndefined(tokenBalanceAmount, 4),
        }
      : {
          from: tradeTokenInfo.title,
          fromBalance: formatZeroOrUndefined(tokenBalanceAmount, 4),
          onClickFromMax,
          to: baseTokenInfo?.name,
          toBalance: formatZeroOrUndefined(baseTokenBalanceAmount, 4),
        };
  }, [cardTab, baseTokenBalance, tokenBalance]);

  const setActiveCardTab = (targetTab: TradeCardActionType) => () => {
    setCardTab(targetTab);
  };

  const onChangeInput = useCallback(
    (input: string) => {
      setInputAmount(input);
    },
    [setInputAmount],
  );

  return (
    <Flex borderRadius='0.5rem' bg='primary.700' direction='column' p='1rem' h='fit-content'>
      <Flex alignItems='center' p='10px' mb='14px'>
        <TokenIcon width='24px' height='24px' />
        <Text mx='10px'>{title}</Text>
        <Box ml='auto' mr='2px' fontSize='xs' fontWeight='bold' color='primary.100'>
          {subtitle}
        </Box>
        <CommonTooltip label={tooltips} />
      </Flex>
      <Box mx='-20px'>
        <Divider borderColor='primary.900' borderWidth='1px' />
      </Box>
      <Flex alignItems='center' borderBottom='2px solid' borderColor='primary.500' mx='-16px'>
        <Box w='1rem' />
        <Button
          borderRadius='none'
          onClick={setActiveCardTab(TradeCardActionType.BUY)}
          color={cardTab === TradeCardActionType.BUY ? 'neutral' : 'primary.100'}
          borderBottom={cardTab === TradeCardActionType.BUY ? '2px solid' : 'none'}
          borderColor='neutral'
          fontWeight={cardTab === TradeCardActionType.BUY ? 'bold' : '500'}
          fontSize='sm'
          p='1rem'
          h='auto'
          mb='-2px'
        >
          {buyLabel.toUpperCase()}
        </Button>
        <Button
          borderRadius='none'
          onClick={setActiveCardTab(TradeCardActionType.SELL)}
          color={cardTab === TradeCardActionType.SELL ? 'neutral' : 'primary.100'}
          fontWeight={cardTab === TradeCardActionType.SELL ? 'bold' : '500'}
          borderBottom={cardTab === TradeCardActionType.SELL ? '2px solid' : 'none'}
          borderColor='neutral'
          fontSize='sm'
          p='1rem'
          h='auto'
          mb='-2px'
        >
          {sellLabel.toUpperCase()}
        </Button>
        <Box ml='auto'>
          <SlippageSettingSelector />
        </Box>
        <Box w='1rem' />
      </Flex>
      <VStack mt='1rem'>
        <AmountInput
          isFocusedFromInput={isFocusedFromInput}
          inputAmount={inputAmount}
          amountLabel={tokensInfo.from}
          setIsFocusedFromInput={setIsFocusedFromInput}
          onChangeInput={onChangeInput}
          decimals={decimals}
          isExceedBalance={isExceedBalance}
        >
          {`Balance: ${tokensInfo.fromBalance} ${tokensInfo.from}`}
          <Button variant='plain' onClick={tokensInfo.onClickFromMax} ml='0.25rem' color='accent.500'>
            (MAX)
          </Button>
        </AmountInput>
        <Center color='primary.100' py='20px'>
          <IconArrowDown />
        </Center>
        <AmountOutput amountLabel={tokensInfo.to} amount={estimateResult.estimateAmount}>
          {`Balance: ${tokensInfo.toBalance} ${tokensInfo.to}`}
        </AmountOutput>
      </VStack>
      <Collapse in={!!inputAmount} transition={{ enter: { duration: 0.5 }, exit: { duration: 0.5 } }}>
        <TradingExtraInfo
          estimateResult={estimateResult}
          cardTab={cardTab}
          tokenType={tokenType}
          baseTokenName={baseTokenInfo?.name}
          tradeTokenName={tradeTokenInfo.title}
        />
      </Collapse>
      <Box mt='auto'>{renderActionButton()}</Box>
      {renderFooterAction()}
    </Flex>
  );
}

export default TradeTokenCard;
