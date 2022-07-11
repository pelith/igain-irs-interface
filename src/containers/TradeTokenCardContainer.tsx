import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { WeiPerEther } from '@ethersproject/constants';
import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import { Flex, Switch, Text } from '@chakra-ui/react';

import TradeTokenCard from '../components/TradeTokenCard';
import { BlockInteractionState } from '../constants/blockActionStatus';
import BaseTokenType from '../constants/termInfo/baseTokenType';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import TradeCardActionType, { CardActionLabel } from '../constants/termInfo/tradeCardActionType';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import { Web3Context } from '../context/Web3Context';
import { SelectedChainContext } from '../context/SelectedChainContext';
import useBurnToken from '../hooks/useBurnToken';
import useFixedApy from '../hooks/useFixedApys';
import useMinAmount from '../hooks/useMinAmount';
import useMintToken from '../hooks/useMintToken';
import { useTradeTokenPrice } from '../hooks/useTradeTokenPrice';
import { formatAmount, formattedUnitToAmount, getMockInput } from '../utils';
import AuthAllButtonContainer from './AuthAllButtonContainer';
import EstimatedApyType from '../constants/termInfo/estimatedApyType';
import { MAIN_BUTTON_EVENT } from '../constants/dataLayer';
import useProxyFarm from '../hooks/useProxyFarm';
import { TagManagerContext } from '../context/TagManagerContextProvider';
import { TermFactoryContext } from '../context/TermFactoryContext';
import ProtocolType from '../constants/termInfo/protocolType';
import Y_VAULT_TOKEN_DATA, { Y_VAULT_BASE_TOKEN_MAP } from '../constants/termInfo/yvTokenConfig';
import useTermBaseTokenPrice from '../hooks/useTermBaseTokenPrice';

interface TradeTokenCardContainerProps {
  tokenBalance?: BigNumber;
  baseTokenBalance?: BigNumber;
  baseTokenType?: BaseTokenType;
  tokenType: TradeTokenType;
  iGainTermInfo?: IGainTerm;
}

function TradeTokenCardContainer({
  tokenBalance,
  baseTokenBalance,
  tokenType,
  baseTokenType,
  iGainTermInfo,
}: TradeTokenCardContainerProps): ReactElement {
  const { tagManager } = useContext(TagManagerContext);
  const web3Controller = useContext(Web3Context);
  const { selectedChain } = useContext(SelectedChainContext);
  const [cardTab, setCardTab] = useState(TradeCardActionType.BUY);
  const [isMintProxy, setIsMintProxy] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>('');
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);

  const targetTermParam = useMemo(
    () => getParamsByContractId(iGainTermInfo?.address || '', selectedChain, iGainTermBaseInfo),
    [iGainTermInfo, selectedChain],
  );

  const [decimals, inputBigNumber, decimalBNUnit] = useMemo(() => {
    const termDecimals = iGainTermInfo?.decimals || 18;
    const decimalBigNumberUnit = parseUnits('1', termDecimals);
    return [termDecimals, parseUnits(inputAmount || '0', termDecimals), decimalBigNumberUnit];
  }, [iGainTermInfo, inputAmount]);

  const { exchangeTermToTradeBase, exchangeTradeToTermBase } = useTermBaseTokenPrice(
    decimalBNUnit,
    iGainTermInfo?.protocolType,
    iGainTermInfo?.tradeBaseTokenType,
  );

  const [estimateAmountOri, perTokenTermBasePrice, protocolFee] = useTradeTokenPrice(
    tokenType,
    cardTab,
    inputAmount,
    exchangeTermToTradeBase,
    exchangeTradeToTermBase,
    iGainTermInfo,
  );

  const estimateAmount = parseFloat(estimateAmountOri) > 0 ? formattedUnitToAmount(estimateAmountOri) : '0.0'; // to check
  const [, standardPerTokenTermBasePrice] = useTradeTokenPrice(
    tokenType,
    cardTab,
    getMockInput(iGainTermInfo?.decimals),
    exchangeTermToTradeBase,
    exchangeTradeToTermBase,
    iGainTermInfo,
  );

  const priceImpact = useMemo(
    () =>
      parseFloat(estimateAmountOri) <= 0
        ? 0
        : cardTab === TradeCardActionType.BUY
        ? (parseFloat(standardPerTokenTermBasePrice) / parseFloat(perTokenTermBasePrice) - 1) * 100
        : (parseFloat(perTokenTermBasePrice) / parseFloat(standardPerTokenTermBasePrice) - 1) * 100,
    [standardPerTokenTermBasePrice, perTokenTermBasePrice, estimateAmountOri],
  );

  const hedgeAmount = useMemo(
    () =>
      formatAmount(
        parseUnits(estimateAmountOri, decimals)
          .mul(iGainTermInfo?.leverage || '1')
          .div(WeiPerEther),
        decimals,
      ),
    [estimateAmountOri, iGainTermInfo],
  );

  const perLongPrice = useMemo(() => {
    if (!perTokenTermBasePrice || +perTokenTermBasePrice <= 0) {
      return decimalBNUnit;
    }
    const perBigNumberPrice = parseUnits(perTokenTermBasePrice, decimals);
    return tokenType === TradeTokenType.LONG ? perBigNumberPrice : decimalBNUnit.sub(perBigNumberPrice);
  }, [inputAmount]);

  const fixedApy = useFixedApy(
    targetTermParam,
    perLongPrice,
    web3Controller,
    tokenType === TradeTokenType.LONG ? EstimatedApyType.BORROWING : EstimatedApyType.LENDING,
  );

  const protocolTokenName = useMemo(() => {
    if (!iGainTermInfo?.tradeBaseTokenType) {
      return '';
    }
    if (iGainTermInfo?.protocolType === ProtocolType.YEARN) {
      const yvTokenType = Y_VAULT_BASE_TOKEN_MAP[iGainTermInfo?.tradeBaseTokenType];
      if (!yvTokenType) {
        return '';
      }
      return Y_VAULT_TOKEN_DATA?.[yvTokenType].name;
    }
    return '';
  }, [iGainTermInfo?.protocolType]);

  const estimateResult = useMemo(
    () => ({
      estimateAmount,
      perTokenPrice:
        tokenType !== TradeTokenType.LP
          ? formatUnits(exchangeTermToTradeBase(parseUnits(perTokenTermBasePrice || '0', decimals)), decimals)
          : '',
      protocolFee,
      priceImpact,
      hedgeAmount,
      fixedApy: tokenType !== TradeTokenType.LP && cardTab !== TradeCardActionType.SELL ? fixedApy : undefined,
      correspondAmount: formatUnits(exchangeTermToTradeBase(parseUnits(hedgeAmount, decimals)), decimals),
      protocolTokenName,
    }),
    [
      estimateAmount,
      perTokenTermBasePrice,
      protocolFee,
      priceImpact,
      hedgeAmount,
      fixedApy,
      cardTab,
      protocolTokenName,
    ],
  );
  const { minAmount } = useMinAmount(estimateAmountOri, decimals);

  const transactionCallback = useCallback(
    (success: boolean) => {
      if (!success) {
        return;
      }
      setInputAmount('');
      if (tagManager) {
        tagManager.dataLayer({
          dataLayer: {
            event: MAIN_BUTTON_EVENT,
            amount: inputAmount,
            token: tokenType,
            transactionType: cardTab,
            stablecoin: baseTokenType,
            platform: iGainTermInfo?.protocolType,
          },
        });
      }
    },
    [inputAmount, cardTab],
  );
  const { burnTokenState, burnToken } = useBurnToken(
    iGainTermInfo?.address,
    web3Controller,
    inputBigNumber,
    minAmount.toString(),
    tokenType,
    transactionCallback,
  );

  const { mintTokenState, mintToken } = useMintToken(
    iGainTermInfo?.address,
    web3Controller,
    inputBigNumber,
    minAmount.toString(),
    tokenType,
    transactionCallback,
  );

  const farmProxyAddress = targetTermParam?.terms?.[0]?.farmProxy || targetTermParam?.terms?.[0]?.aggregatedProxy;
  const tradeTokenAddress =
    cardTab === TradeCardActionType.BUY
      ? ''
      : tokenType === TradeTokenType.LP
      ? iGainTermInfo?.address || ''
      : tokenType === TradeTokenType.LONG
      ? targetTermParam?.terms?.[0]?.longTokenAddress
      : targetTermParam?.terms?.[0]?.shortTokenAddress;

  const { depositState, deposit } = useProxyFarm(
    iGainTermInfo?.address,
    web3Controller,
    inputBigNumber,
    minAmount.toString(),
  );

  const onClickMainAction = useCallback(() => {
    if (cardTab === TradeCardActionType.BUY) {
      if (isMintProxy) {
        deposit();
        return;
      }
      mintToken();
      return;
    }
    burnToken();
    return;
  }, [iGainTermInfo, tokenType, minAmount, inputAmount, web3Controller, cardTab, isMintProxy]);

  const isPending = useMemo(
    () => [mintTokenState, burnTokenState, depositState].includes(BlockInteractionState.PENDING),
    [mintTokenState, burnTokenState, depositState],
  );

  const isExceedBalance = useMemo(() => {
    if (baseTokenBalance && tokenBalance) {
      return (
        parseFloat(inputAmount ? inputAmount : '0') >
        parseFloat(formatUnits(cardTab === TradeCardActionType.BUY ? baseTokenBalance : tokenBalance, decimals))
      );
    }
    return false;
  }, [baseTokenBalance, inputAmount, cardTab]);

  const mainActionLabel = useMemo(() => {
    if (isExceedBalance) {
      return 'INSUFFICIENT BALANCE';
    }
    if (isPending) {
      return 'PENDING';
    }
    if (isMintProxy) {
      return `${CardActionLabel[tokenType][cardTab]} AND FARM`;
    }
    return CardActionLabel[tokenType][cardTab];
  }, [isExceedBalance, isPending, isMintProxy, cardTab]);

  const renderActionButton = useCallback(() => {
    const label = mainActionLabel;
    const targetNetwork = targetTermParam?.chainId || selectedChain;
    const mainTermAddress =
      (isMintProxy && !targetTermParam?.terms?.[0]?.aggregatedProxy ? farmProxyAddress : iGainTermInfo?.address) || '';
    const isNotReached = !inputAmount || parseFloat(inputAmount) <= 0;
    return (
      <AuthAllButtonContainer
        tradeTokenAddress={tradeTokenAddress}
        protocolType={iGainTermInfo?.protocolType}
        mainTermAddress={mainTermAddress}
        aggregatedProxyAddress={targetTermParam?.terms?.[0]?.aggregatedProxy || ''}
        targetNetwork={targetNetwork}
        tokenAddress={(cardTab === TradeCardActionType.BUY ? iGainTermInfo?.tradeBaseTokenAddress : '') || ''}
        isFarming={isMintProxy}
        requiredAllowance={inputBigNumber}
        onClick={onClickMainAction}
        disabled={isExceedBalance || isPending || isNotReached}
      >
        {isNotReached ? 'PLEASE INPUT AMOUNT' : label}
      </AuthAllButtonContainer>
    );
  }, [iGainTermInfo, selectedChain, cardTab, inputBigNumber, mainActionLabel]);

  const renderFooterAction = () => {
    if (
      cardTab !== TradeCardActionType.BUY ||
      tokenType !== TradeTokenType.LP ||
      !farmProxyAddress ||
      !iGainTermInfo?.farmAddress
    ) {
      return <></>;
    }
    return (
      <Flex justifyContent='space-between' mt='1.5rem'>
        <Text color='primary.100' fontSize='xs' fontWeight='500'>
          One click to farm and get rewards
        </Text>
        <Switch size='md' onChange={() => setIsMintProxy((switcher) => !switcher)} isChecked={isMintProxy} />
      </Flex>
    );
  };

  return (
    <TradeTokenCard
      tokenType={tokenType}
      cardTab={cardTab}
      setCardTab={setCardTab}
      inputAmount={inputAmount}
      setInputAmount={setInputAmount}
      estimateResult={estimateResult}
      renderActionButton={renderActionButton}
      renderFooterAction={renderFooterAction}
      baseTokenType={baseTokenType}
      tokenBalance={tokenBalance}
      baseTokenBalance={baseTokenBalance}
      isExceedBalance={isExceedBalance}
    />
  );
}

export default TradeTokenCardContainer;
