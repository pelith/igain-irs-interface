import React, { ReactElement, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Zero, WeiPerEther } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import { formatUnits } from 'ethers/lib/utils';
import SideInfos from '../components/fixedApy/SideInfos';
import BorrowFormSteppers from '../components/fixedApy/BorrowFormSteppers';
import { TradeTokenType } from '../constants/termInfo/tradeTokenConfig';
import TradeCardActionType from '../constants/termInfo/tradeCardActionType';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import { Web3Context } from '../context/Web3Context';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { TermsContext } from '../context/TermsContext';
import { useTradeTokenPrice } from '../hooks/useTradeTokenPrice';
import useFixedApy, { useFixedApyListWithTerms } from '../hooks/useFixedApys';
import { getMockInput, isTermNeedRefresh } from '../utils';
import { calToMintExactB, mintTokenWithRoundData } from '../utils/contractCalc';
import { calcPerTokenPrice } from '../utils/TokenPriceCalc';
import EstimatedApyType from '../constants/termInfo/estimatedApyType';
import { FixedApyPanelFrame } from '../components/fixedApy/FixedApyPanelFrame';
import { BottomInfo } from '../components/fixedApy/BottomInfo';
import { TermFactoryContext } from '../context/TermFactoryContext';
import ProtocolType from '../constants/termInfo/protocolType';
import { mockExchangeTransfer } from '../utils/exchangeTermTradeBaseTokens';

function FixApyBorrowContainer(): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermsInfo: oriIGainTermsInfo } = useContext(TermsContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);

  const iGainTermsInfo = useMemo(
    () =>
      oriIGainTermsInfo?.filter(
        (termData) => termData.closeTime * 1000 > Date.now() && termData.protocolType !== ProtocolType.YEARN,
      ),
    [oriIGainTermsInfo],
  );

  const [selectedTerm, setSelectedTerm] = useState<IGainTerm | undefined>(undefined);
  const [inputAmount, setInputAmount] = useState<string>('');

  const decimals = useMemo(() => {
    return selectedTerm?.decimals || 18;
  }, [selectedTerm]);

  const inputBigNumber = parseUnits(inputAmount || '0', decimals);

  // need to recalculate for borrowing
  const hedgeBaseToken = useMemo(
    () => (selectedTerm ? inputBigNumber.mul(WeiPerEther).div(selectedTerm.leverage) : Zero),
    [selectedTerm, inputAmount],
  );

  // need to recalculate for borrowing
  const requiredBaseToken = parseUnits(calToMintExactB(hedgeBaseToken, selectedTerm).toString(), 0);
  const [estimatedHedgeAmount, longPerTokenPrice] = useTradeTokenPrice(
    TradeTokenType.LONG,
    TradeCardActionType.BUY,
    formatUnits(requiredBaseToken, decimals),
    mockExchangeTransfer,
    mockExchangeTransfer,
    selectedTerm,
  );

  const [, standardPerLongTokenPrice] = useTradeTokenPrice(
    TradeTokenType.LONG,
    TradeCardActionType.BUY,
    getMockInput(decimals),
    mockExchangeTransfer,
    mockExchangeTransfer,
    selectedTerm,
  );

  const priceImpact = useMemo(
    () =>
      parseFloat(longPerTokenPrice) <= 0
        ? 0
        : (parseFloat(standardPerLongTokenPrice) / parseFloat(longPerTokenPrice) - 1) * 100,
    [standardPerLongTokenPrice, longPerTokenPrice],
  );

  const targetTermData = useMemo(
    () => getParamsByContractId(selectedTerm?.address || '', selectedChain, iGainTermBaseInfo),
    [selectedTerm, selectedChain, web3Controller],
  );

  const isIncludeSlippage = useMemo(() => parseFloat(inputAmount || '0') > 0, [inputAmount]);
  const longPerTokenPriceBigNumber = useMemo(
    () => parseUnits(parseFloat(longPerTokenPrice) > 0 ? longPerTokenPrice : standardPerLongTokenPrice, decimals),
    [inputAmount, standardPerLongTokenPrice],
  );

  const fixedApy = useFixedApy(targetTermData, longPerTokenPriceBigNumber, web3Controller, EstimatedApyType.BORROWING);

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
        TradeTokenType.LONG,
        parseUnits(mockInput || '0', termDecimals),
        iGainTermInfo,
      ).toString();
      const [, mintTokenPrice] = calcPerTokenPrice(mintStringResult, mockInput, termDecimals);
      const perLong = parseFloat(mintTokenPrice) > 0 ? 1 / parseFloat(mintTokenPrice) : 0;
      return parseUnits(perLong.toFixed(4), termDecimals);
    });
  }, [iGainTermsInfo]);

  const fixedApyList = useFixedApyListWithTerms(
    iGainTermsInfo,
    longPrices,
    web3Controller,
    selectedChain,
    EstimatedApyType.BORROWING,
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
          estimatedApyType={EstimatedApyType.BORROWING}
        />
      }
      mainInfoPanel={
        <BorrowFormSteppers
          chainId={selectedChain}
          iGainTermsInfo={iGainTermsInfo}
          selectedTerm={selectedTerm}
          inputAmount={inputAmount}
          fixedApy={fixedApy !== undefined && fixedApy > 0 ? fixedApy : 0}
          fixedApyMap={fixedApyMap}
          setSelectedTerm={safeSetSelectedTerm}
          setInputAmount={setInputAmount}
          priceImpact={priceImpact}
          inputBigNumber={inputBigNumber}
          requiredBaseToken={requiredBaseToken}
          estimatedHedgeAmount={estimatedHedgeAmount}
          hedgeBaseToken={hedgeBaseToken}
          decimals={decimals}
        />
      }
      bottomInfo={<BottomInfo estimatedApyType={EstimatedApyType.BORROWING} />}
    />
  );
}

export default FixApyBorrowContainer;
