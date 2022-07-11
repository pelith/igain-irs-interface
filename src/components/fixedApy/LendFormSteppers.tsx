import React, { ReactElement, useCallback, useContext, useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import PanelStepper from './PanelStepper';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import FixedApyTermSelector from './FixedApyTermSelector';
import FixedApyAaveLendInputArea from './FixedApyAaveLendInputArea';
import FixedApyYearnLendInputArea from './FixedApyYearnLendInputArea';
import { ChainId } from '../../constants';
import { Web3Context } from '../../context/Web3Context';
import AuthAllButtonContainer from '../../containers/AuthAllButtonContainer';
import { getParamsByContractId } from '../../constants/termInfo/termConfigData';
import useProxyDeposit from '../../hooks/useProxyDeposit';
import { BlockInteractionState } from '../../constants/blockActionStatus';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import { MAIN_BUTTON_EVENT, TRANSACTION_TYPE_DEPOSIT } from '../../constants/dataLayer';
import { TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import { formatUnits } from 'ethers/lib/utils';
import useMinAmount from '../../hooks/useMinAmount';
import { DEFAULT_CHAIN_ID } from '../../constants/web3ContextConstants';
import { PanelFormFrame } from './PanelFormFrame';
import { TagManagerContext } from '../../context/TagManagerContextProvider';
import { TermFactoryContext } from '../../context/TermFactoryContext';
import ProtocolType from '../../constants/termInfo/protocolType';
import { AaveEModeContext } from '../../context/AaveEmodeContext';
import MainButton from '../MainButton';

interface Props {
  chainId: ChainId;
  iGainTermsInfo?: IGainTerm[];
  selectedTerm?: IGainTerm;
  baseTokenBalance: BigNumber;
  inputAmount: string;
  fixedApy: number;
  priceImpact: number;
  inputBigNumber: BigNumber;
  requiredBaseToken: BigNumber;
  decimals: number;
  fixedApyMap: { [key: string]: number | undefined };
  estimatedHedgeAmount: string;
  setSelectedTerm: (term?: IGainTerm) => void;
  setInputAmount: (input: string) => void;
}

function LendFormSteppers({
  chainId,
  iGainTermsInfo,
  selectedTerm,
  baseTokenBalance,
  inputAmount,
  inputBigNumber,
  requiredBaseToken,
  estimatedHedgeAmount,
  decimals,
  fixedApy,
  priceImpact,
  fixedApyMap,
  setSelectedTerm,
  setInputAmount,
}: Props): ReactElement {
  const { tagManager } = useContext(TagManagerContext);
  const web3Controller = useContext(Web3Context);
  const { account } = web3Controller;
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const { userEMode, reservesEmodeInfo } = useContext(AaveEModeContext);

  const termParams = getParamsByContractId(selectedTerm?.address || '', chainId, iGainTermBaseInfo);
  const lendProxyAddress = termParams?.terms[0].lendProxyAddress;
  const { minAmount: minTradeTokenAmount } = useMinAmount(estimatedHedgeAmount, decimals);

  const { depositState, deposit } = useProxyDeposit(
    termParams,
    web3Controller,
    inputBigNumber,
    requiredBaseToken,
    BigNumber.from(minTradeTokenAmount.toString()),
  );

  useEffect(() => {
    if (depositState === BlockInteractionState.SUCCESS) {
      if (tagManager) {
        tagManager.dataLayer({
          dataLayer: {
            event: MAIN_BUTTON_EVENT,
            amount: formatUnits(requiredBaseToken, decimals),
            token: TradeTokenType.SHORT,
            transactionType: TRANSACTION_TYPE_DEPOSIT,
            stablecoin: selectedTerm?.tradeBaseTokenType,
            platform: selectedTerm?.protocolType,
          },
        });
      }
      setInputAmount('');
    }
  }, [depositState, selectedTerm]);

  const isExceedBalance = useMemo(() => {
    if (account && baseTokenBalance) {
      return parseFloat(inputAmount ? inputAmount : '0') > parseFloat(formatUnits(baseTokenBalance, decimals));
    }
    return false;
  }, [baseTokenBalance, inputAmount]);

  const renderMainButton = useCallback(() => {
    const baseTokenAddress = termParams?.baseTokenAddress || '';
    if (
      userEMode !== 0 &&
      reservesEmodeInfo[baseTokenAddress] &&
      reservesEmodeInfo[baseTokenAddress] !== userEMode &&
      termParams?.protocolType === ProtocolType.AAVE_V3
    ) {
      const baseTokenDataType = selectedTerm?.tradeBaseTokenType
        ? BASE_TOKEN_DATA[selectedTerm?.tradeBaseTokenType]
        : undefined;
      return (
        <MainButton variant='secondary'>
          <a
            href={termParams ? baseTokenDataType?.depositLinks[termParams.protocolType]?.[chainId] : ''}
            target='_blank'
            rel='noreferrer'
          >
            CHANGE EMODE SETTING
          </a>
        </MainButton>
      );
    }
    const isNotReached = !inputAmount || parseFloat(inputAmount) <= 0;
    return (
      <AuthAllButtonContainer
        mainTermAddress={selectedTerm?.address || ''}
        protocolType={selectedTerm?.protocolType}
        aggregatedProxyAddress={termParams?.terms?.[0]?.aggregatedProxy || ''}
        targetNetwork={termParams?.chainId || DEFAULT_CHAIN_ID}
        proxyAddress={lendProxyAddress}
        disabled={
          !selectedTerm?.address || isExceedBalance || depositState === BlockInteractionState.PENDING || isNotReached
        }
        tokenAddress={selectedTerm?.tradeBaseTokenAddress || ''}
        requiredAllowance={inputBigNumber}
        onClick={deposit}
      >
        {isNotReached
          ? 'PLEASE INPUT AMOUNT'
          : isExceedBalance
          ? 'INSUFFICIENT BALANCE'
          : depositState === BlockInteractionState.PENDING
          ? 'PENDING'
          : 'DEPOSIT'}
      </AuthAllButtonContainer>
    );
  }, [lendProxyAddress, selectedTerm, termParams, depositState, inputAmount]);

  const baseTokenName = selectedTerm?.tradeBaseTokenType ? BASE_TOKEN_DATA[selectedTerm?.tradeBaseTokenType].name : '';

  return (
    <>
      <PanelFormFrame>
        <Box flex='1' w='100%' minH='0'>
          <PanelStepper stepNumber='1' sideInfoContent={'Select a term'}>
            <FixedApyTermSelector
              iGainTermsInfo={iGainTermsInfo}
              selectedTerm={selectedTerm}
              setSelectedTerm={setSelectedTerm}
              fixedApyMap={fixedApyMap}
            />
          </PanelStepper>
        </Box>
        <Box w='100%'>
          <PanelStepper stepNumber='2' sideInfoContent={'Input an amount and check the estimating result'}>
            {selectedTerm?.protocolType !== ProtocolType.YEARN && (
              <FixedApyAaveLendInputArea
                chainId={chainId}
                term={selectedTerm}
                baseTokenName={baseTokenName}
                baseTokenBalance={baseTokenBalance}
                fixedApy={fixedApy}
                priceImpact={priceImpact}
                inputAmount={inputAmount}
                setInputAmount={setInputAmount}
                renderStepMainButton={renderMainButton}
                estimatedHedgeAmount={estimatedHedgeAmount}
                requiredBaseToken={requiredBaseToken}
                termParams={termParams}
                inputBigNumber={inputBigNumber}
                isExceedBalance={isExceedBalance}
              />
            )}
            {selectedTerm?.protocolType === ProtocolType.YEARN && (
              <FixedApyYearnLendInputArea
                chainId={chainId}
                term={selectedTerm}
                baseTokenName={baseTokenName}
                baseTokenBalance={baseTokenBalance}
                fixedApy={fixedApy}
                priceImpact={priceImpact}
                inputAmount={inputAmount}
                estimatedHedgeAmount={estimatedHedgeAmount}
                setInputAmount={setInputAmount}
                renderStepMainButton={renderMainButton}
                requiredBaseToken={requiredBaseToken}
                termParams={termParams}
                inputBigNumber={inputBigNumber}
                isExceedBalance={isExceedBalance}
              />
            )}
          </PanelStepper>
        </Box>
      </PanelFormFrame>
    </>
  );
}

export default LendFormSteppers;
