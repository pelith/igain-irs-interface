import React, { ReactElement, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Zero, WeiPerEther } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import { formatUnits } from 'ethers/lib/utils';
import SideInfos from '../components/fixedApy/SideInfos';
import LendFormSteppers from '../components/fixedApy/LendFormSteppers';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import TradeCardActionType from '../constants/termInfo/tradeCardActionType';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import { Web3Context } from '../context/Web3Context';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { TermsContext } from '../context/TermsContext';
import { useTradeTokenPrice } from '../hooks/useTradeTokenPrice';
import useTokenBalance from '../hooks/useTokenBalances';
import useFixedApy, { useFixedApyListWithTerms } from '../hooks/useFixedApys';
import { getMockInput, isTermNeedRefresh } from '../utils';
import { calToMintExactA, mintTokenWithRoundData } from '../utils/contractCalc';
import { calcPerTokenPrice } from '../utils/TokenPriceCalc';
import EstimatedApyType from '../constants/termInfo/estimatedApyType';
import { FixedApyPanelFrame } from '../components/fixedApy/FixedApyPanelFrame';
import { BottomInfo } from '../components/fixedApy/BottomInfo';
import { TermFactoryContext } from '../context/TermFactoryContext';
import useTermBaseTokenPrice from '../hooks/useTermBaseTokenPrice';

function FixApyLendContainer(): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermsInfo: oriIGainTermsInfo } = useContext(TermsContext);
  const { account } = web3Controller;
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);

  const iGainTermsInfo = useMemo(
    () => oriIGainTermsInfo?.filter((termData) => termData.closeTime * 1000 > Date.now()),
    [oriIGainTermsInfo],
  );

  const [selectedTerm, setSelectedTerm] = useState<IGainTerm | undefined>(undefined);
  const [inputAmount, setInputAmount] = useState<string>('');
  const baseTokenBalance = useTokenBalance(selectedTerm?.tradeBaseTokenAddress, account, web3Controller);

  const [decimals, decimalBNUnit] = useMemo(() => {
    const termDecimals = selectedTerm?.decimals || 18;
    return [termDecimals, parseUnits('1', termDecimals)];
  }, [selectedTerm]);

  const inputBigNumber = parseUnits(inputAmount || '0', decimals);

  const { exchangeTermToTradeBase, exchangeTradeToTermBase } = useTermBaseTokenPrice(
    decimalBNUnit,
    selectedTerm?.protocolType,
    selectedTerm?.tradeBaseTokenType,
  );

  const hedgeBaseToken = useMemo(
    () => (selectedTerm ? exchangeTradeToTermBase(inputBigNumber).mul(WeiPerEther).div(selectedTerm.leverage) : Zero),
    [selectedTerm, inputAmount],
  );

  const requiredBaseToken = exchangeTermToTradeBase(
    parseUnits(calToMintExactA(hedgeBaseToken, selectedTerm).toString(), 0),
  );

  const [estimatedHedgeAmount, perShortTokenTermBasePrice] = useTradeTokenPrice(
    TradeTokenType.SHORT,
    TradeCardActionType.BUY,
    formatUnits(requiredBaseToken, decimals),
    exchangeTermToTradeBase,
    exchangeTradeToTermBase,
    selectedTerm,
  );

  const [, standardShortTokenTermBasePrice] = useTradeTokenPrice(
    TradeTokenType.SHORT,
    TradeCardActionType.BUY,
    getMockInput(decimals),
    exchangeTermToTradeBase,
    exchangeTradeToTermBase,
    selectedTerm,
  );

  const priceImpact = useMemo(
    () =>
      parseFloat(perShortTokenTermBasePrice) <= 0
        ? 0
        : (parseFloat(standardShortTokenTermBasePrice) / parseFloat(perShortTokenTermBasePrice) - 1) * 100,
    [standardShortTokenTermBasePrice, perShortTokenTermBasePrice],
  );

  const targetTermData = useMemo(
    () => getParamsByContractId(selectedTerm?.address || '', selectedChain, iGainTermBaseInfo),
    [selectedTerm, selectedChain, web3Controller],
  );

  const isIncludeSlippage = useMemo(() => parseFloat(inputAmount || '0') > 0, [inputAmount]);

  const longPerTokenPrice = useMemo(() => {
    const currentShortTokenPrice = isIncludeSlippage ? perShortTokenTermBasePrice : standardShortTokenTermBasePrice;
    return decimalBNUnit.sub(
      parseUnits(
        parseFloat(currentShortTokenPrice) <= 1 ? currentShortTokenPrice : standardShortTokenTermBasePrice,
        decimals,
      ),
    );
  }, [perShortTokenTermBasePrice, standardShortTokenTermBasePrice]);

  const fixedApy = useFixedApy(targetTermData, longPerTokenPrice, web3Controller, EstimatedApyType.LENDING);

  const safeSetSelectedTerm = useCallback(
    (term?: IGainTerm) => {
      if (term && selectedTerm && selectedTerm.decimals > term.decimals && !!inputAmount) {
        setInputAmount(
          formatUnits(
            parseUnits(inputAmount, selectedTerm.decimals).div(parseUnits('1', selectedTerm.decimals - term.decimals)),
            term.decimals,
          ),
        );
      }
      setSelectedTerm(term);
    },
    [setSelectedTerm, setInputAmount, inputAmount, selectedTerm],
  );

  useEffect(() => {
    if (selectedTerm) {
      const filteredTermInfo = iGainTermsInfo?.find((element) => element.address === selectedTerm.address);
      if (isTermNeedRefresh(filteredTermInfo, selectedTerm)) {
        safeSetSelectedTerm(filteredTermInfo);
      }
    } else if (!selectedTerm && iGainTermsInfo && iGainTermsInfo.length > 0) {
      safeSetSelectedTerm(iGainTermsInfo[0]);
    }
  }, [iGainTermsInfo]);

  const longPrices = useMemo(() => {
    return iGainTermsInfo?.map((iGainTermInfo) => {
      const termDecimals = iGainTermInfo?.decimals || 18;
      const mockInput = getMockInput(termDecimals);
      const mintStringResult = mintTokenWithRoundData(
        TradeTokenType.SHORT,
        parseUnits(mockInput || '0', termDecimals),
        iGainTermInfo,
      ).toString();
      const [, mintTokenPrice] = calcPerTokenPrice(mintStringResult, mockInput, termDecimals);
      const perShort = parseFloat(mintTokenPrice) > 0 ? 1 / parseFloat(mintTokenPrice) : 0;
      return parseUnits((1 - perShort).toFixed(4), termDecimals);
    });
  }, [iGainTermsInfo]);

  const fixedApyList = useFixedApyListWithTerms(
    iGainTermsInfo,
    longPrices,
    web3Controller,
    selectedChain,
    EstimatedApyType.LENDING,
  );

  const fixedApyMap: { [key: string]: number | undefined } = {};
  iGainTermsInfo?.forEach((termData, index) => {
    fixedApyMap[termData.address] = fixedApyList?.[index];
  });
  const candidateApy = selectedTerm?.address ? fixedApyMap[selectedTerm?.address] : undefined;

  return (
    <FixedApyPanelFrame
      sideInfo={
        <SideInfos
          isIncludeSlippage={isIncludeSlippage}
          fixedApy={inputBigNumber.gt(Zero) ? fixedApy : candidateApy}
          estimatedApyType={EstimatedApyType.LENDING}
          protocolType={selectedTerm?.protocolType}
        />
      }
      mainInfoPanel={
        <LendFormSteppers
          chainId={selectedChain}
          iGainTermsInfo={iGainTermsInfo}
          selectedTerm={selectedTerm}
          baseTokenBalance={baseTokenBalance || Zero}
          inputAmount={inputAmount}
          fixedApy={fixedApy !== undefined && fixedApy > 0 ? fixedApy : 0}
          fixedApyMap={fixedApyMap}
          setSelectedTerm={safeSetSelectedTerm}
          setInputAmount={setInputAmount}
          priceImpact={priceImpact}
          inputBigNumber={inputBigNumber}
          requiredBaseToken={requiredBaseToken}
          estimatedHedgeAmount={estimatedHedgeAmount}
          decimals={decimals}
        />
      }
      bottomInfo={<BottomInfo estimatedApyType={EstimatedApyType.LENDING} protocolType={selectedTerm?.protocolType} />}
    />
  );
}

export default FixApyLendContainer;
