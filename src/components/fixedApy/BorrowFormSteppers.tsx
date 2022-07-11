import React, { ReactElement, useCallback, useContext, useEffect, useMemo } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import PanelStepper from './PanelStepper';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import FixedApyTermSelector from './FixedApyTermSelector';
import FixedApyBorrowAmountInput from './FixedApyBorrowAmountInput';
import { ChainId } from '../../constants';
import { Web3Context } from '../../context/Web3Context';
import AuthDelegationButtonContainer from '../../containers/AuthDelegationButtonContainer';
import { getParamsByContractId } from '../../constants/termInfo/termConfigData';
import useProxyBorrow from '../../hooks/useProxyBorrow';
import { BlockInteractionState } from '../../constants/blockActionStatus';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import { MAIN_BUTTON_EVENT, TRANSACTION_TYPE_BORROW } from '../../constants/dataLayer';
import { TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import { formatUnits } from 'ethers/lib/utils';
import useMinAmount from '../../hooks/useMinAmount';
import useCollateralStatus from '../../hooks/useCollateralStatus';
import { DEFAULT_CHAIN_ID } from '../../constants/web3ContextConstants';
import { PanelFormFrame } from './PanelFormFrame';
import { TagManagerContext } from '../../context/TagManagerContextProvider';
import { IGAIN_DEBT } from '../../constants/termInfo/debtTokenData';
import MainButton from '../MainButton';
import { TermFactoryContext } from '../../context/TermFactoryContext';
import { AaveEModeContext } from '../../context/AaveEmodeContext';
import ProtocolType from '../../constants/termInfo/protocolType';

interface Props {
  chainId: ChainId;
  iGainTermsInfo?: IGainTerm[];
  selectedTerm?: IGainTerm;
  inputAmount: string;
  fixedApy: number;
  priceImpact: number;
  inputBigNumber: BigNumber;
  requiredBaseToken: BigNumber;
  hedgeBaseToken: BigNumber;
  decimals: number;
  fixedApyMap: { [key: string]: number | undefined };
  estimatedHedgeAmount: string;
  setSelectedTerm: (term?: IGainTerm) => void;
  setInputAmount: (input: string) => void;
}

function BorrowFormSteppers({
  chainId,
  iGainTermsInfo,
  selectedTerm,
  inputAmount,
  inputBigNumber,
  requiredBaseToken,
  hedgeBaseToken,
  estimatedHedgeAmount,
  decimals,
  fixedApy,
  priceImpact,
  fixedApyMap,
  setSelectedTerm,
  setInputAmount,
}: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { account } = web3Controller;
  const { tagManager } = useContext(TagManagerContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const { userEMode, reservesEmodeInfo } = useContext(AaveEModeContext);

  const [termParams, termInfo] = useMemo(() => {
    const targetTerm = getParamsByContractId(selectedTerm?.address || '', chainId, iGainTermBaseInfo);
    return [targetTerm, targetTerm?.terms[0]];
  }, [selectedTerm, chainId]);
  const collateralStatus = useCollateralStatus(termParams, decimals, web3Controller);
  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('totalCollateral', formatUnits(collateralStatus.totalCollateral, decimals));
      console.log('totalDebt', formatUnits(collateralStatus.totalDebt, decimals));
      console.log('ltv', formatUnits(collateralStatus.ltv, 2));
      console.log('availableBorrows', formatUnits(collateralStatus.availableBorrows, decimals));
    }
  }, [collateralStatus]);

  const borrowProxyAddress = termInfo?.borrowProxyAddress;
  const { minAmount: minTradeTokenAmount } = useMinAmount(estimatedHedgeAmount, decimals);
  const { borrowState, borrow } = useProxyBorrow(
    termParams,
    web3Controller,
    inputBigNumber,
    requiredBaseToken,
    BigNumber.from(minTradeTokenAmount.toString()),
  );

  useEffect(() => {
    if (borrowState === BlockInteractionState.SUCCESS) {
      if (tagManager) {
        tagManager.dataLayer({
          dataLayer: {
            event: MAIN_BUTTON_EVENT,
            amount: formatUnits(requiredBaseToken, decimals),
            token: TradeTokenType.LONG,
            transactionType: TRANSACTION_TYPE_BORROW,
            stablecoin: selectedTerm?.tradeBaseTokenType,
            platform: selectedTerm?.protocolType,
          },
        });
      }
      setInputAmount('');
    }
  }, [borrowState, selectedTerm]);

  const isExceedAvailable = useMemo(
    () => collateralStatus.availableBorrows.lt(inputBigNumber) || collateralStatus.availableBorrows.eq(Zero),
    [inputBigNumber, collateralStatus],
  );

  const baseTokenDataType = selectedTerm?.tradeBaseTokenType
    ? BASE_TOKEN_DATA[selectedTerm?.tradeBaseTokenType]
    : undefined;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const renderMainSectionMainButton = useCallback(() => {
    if (!termParams) {
      return <></>;
    }
    if (
      userEMode !== 0 &&
      reservesEmodeInfo[termParams.baseTokenAddress] &&
      reservesEmodeInfo[termParams.baseTokenAddress] !== userEMode &&
      termParams.protocolType === ProtocolType.AAVE_V3
    ) {
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

    if (isExceedAvailable && !!account) {
      return (
        <MainButton variant='secondary'>
          <a
            href={termParams ? baseTokenDataType?.depositLinks[termParams.protocolType]?.[chainId] : ''}
            target='_blank'
            rel='noreferrer'
          >
            ADD COLLATERAL
            <br />
            BEFORE BORROWING
          </a>
        </MainButton>
      );
    }

    const isNotReached = !inputAmount || parseFloat(inputAmount) <= 0;

    return (
      <AuthDelegationButtonContainer
        protocolType={termParams.protocolType}
        mainTermAddress={selectedTerm?.address || ''}
        aggregatedProxyAddress={termInfo?.aggregatedProxy || ''}
        targetNetwork={chainId || DEFAULT_CHAIN_ID}
        proxyAddress={borrowProxyAddress || termInfo?.aggregatedProxy}
        disabled={!selectedTerm?.address || borrowState === BlockInteractionState.PENDING || isNotReached}
        tokenAddress={
          (selectedTerm &&
            termParams?.chainId &&
            IGAIN_DEBT[termParams.chainId][selectedTerm.protocolType][selectedTerm.tradeBaseTokenType]?.address) ||
          ''
        }
        requiredAllowance={inputBigNumber}
        onClick={onOpen}
      >
        {isNotReached ? 'PLEASE INPUT AMOUNT' : borrowState === BlockInteractionState.PENDING ? 'PENDING' : 'BORROW'}
      </AuthDelegationButtonContainer>
    );
  }, [borrowProxyAddress, selectedTerm, termParams, isExceedAvailable, borrowState, inputBigNumber, account]);

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
          <PanelStepper
            stepNumber='2'
            sideInfoContent={'Input an amount or adjust the LTV ratio bar to estimate the result'}
          >
            <FixedApyBorrowAmountInput
              chainId={chainId}
              term={selectedTerm}
              baseTokenDataType={baseTokenDataType}
              fixedApy={fixedApy}
              priceImpact={priceImpact}
              inputAmount={inputAmount}
              setInputAmount={setInputAmount}
              renderStepMainButton={renderMainSectionMainButton}
              hedgeBaseToken={hedgeBaseToken}
              requiredBaseToken={requiredBaseToken}
              termParams={termParams}
              inputBigNumber={inputBigNumber}
              isExceedBalance={isExceedAvailable}
              collateralStatus={collateralStatus}
              isConnect={!!account}
              modalIsOpen={isOpen}
              modalOnClose={onClose}
              borrow={borrow}
            />
          </PanelStepper>
        </Box>
      </PanelFormFrame>
    </>
  );
}

export default BorrowFormSteppers;
