import React, { useCallback, ReactElement, useState, useMemo, useEffect, useRef } from 'react';
import { Box, Flex, Text, Center, Collapse, Button, Link, HStack } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Zero } from '@ethersproject/constants';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import { ChainId } from '../../constants';
import IGainIrsTermParams from '../../constants/termInfo/iGainIrsTermParams';
import { BaseTokenDataType } from '../../constants/baseTokenConfig';
import RiskLevelType, { RISK_INFO } from '../../constants/fixedApy/borrowRiskConfig';
import { formatAmount, formatPercentage, formatZeroOrUndefined } from '../../utils';
import SlippageSettingSelector from '../SlippageSettingSelector';
import { AmountInput } from '../common/AmountInput';
import { InfoPair } from '../common/InfoPair';
import SliderInput from './SliderInput';
import { ICollateralStatus } from '../../hooks/useCollateralStatus';
import { parseUnits } from 'ethers/lib/utils';
import { ReactComponent as IconLink } from '../../assets/icon-link.svg';
import BorrowingModal from './BorrowingModal';

interface Props {
  chainId: ChainId;
  term?: IGainTerm;
  baseTokenDataType?: BaseTokenDataType;
  inputAmount: string;
  fixedApy: number;
  priceImpact: number;
  hedgeBaseToken: BigNumber;
  requiredBaseToken: BigNumber;
  termParams?: IGainIrsTermParams;
  inputBigNumber: BigNumber;
  isExceedBalance?: boolean;
  collateralStatus: ICollateralStatus;
  isConnect: boolean;
  setInputAmount: (input: string) => void;
  renderStepMainButton: () => ReactElement;
  modalIsOpen: boolean;
  modalOnClose: () => void;
  borrow: () => Promise<void>;
}

function FixedApyBorrowAmountInput({
  chainId,
  term,
  baseTokenDataType,
  inputAmount,
  fixedApy,
  priceImpact,
  hedgeBaseToken,
  requiredBaseToken,
  termParams,
  inputBigNumber,
  isExceedBalance,
  collateralStatus,
  setInputAmount,
  renderStepMainButton,
  modalIsOpen,
  modalOnClose,
  borrow,
  isConnect,
}: Props): ReactElement {
  const baseTokenName = baseTokenDataType?.name;
  const onChangeInput = useCallback(
    (value) => {
      setInputAmount(value);
    },
    [setInputAmount],
  );

  const decimals = term?.decimals || 18;
  const decimalBNUnit = parseUnits('1', decimals);
  const ltv = useMemo(() => formatUnits(collateralStatus.ltv, 2), [collateralStatus]);
  const totalCollateral = useMemo(() => formatUnits(collateralStatus.totalCollateral, decimals), [collateralStatus]);
  const debtPercentage = useMemo(
    () =>
      parseFloat(
        formatUnits(
          collateralStatus.totalCollateral.gt(Zero)
            ? collateralStatus.totalDebt.mul(decimalBNUnit).div(collateralStatus.totalCollateral)
            : Zero,
          decimals,
        ),
      ) * 100,
    [collateralStatus],
  );
  const [isFocusedAmountInput, setIsFocusedAmountInput] = useState(false);
  const [inputPercentage, setInputPercentage] = useState(0);
  const prevInputAmount = useRef('0');
  const prevInputPercentage = useRef(0);

  useEffect(() => {
    const totalCollateralNumber = parseFloat(totalCollateral);
    if (totalCollateralNumber === 0) {
      return;
    }
    if (prevInputPercentage.current !== inputPercentage) {
      const inputValue = formatZeroOrUndefined(
        (totalCollateralNumber * (inputPercentage - debtPercentage)) / 100 || 0,
        4,
      );
      setInputAmount(inputValue);
      prevInputAmount.current = inputValue;
      prevInputPercentage.current = inputPercentage;
    } else {
      const inputPercentageValue = !inputAmount
        ? debtPercentage || 0
        : parseFloat(((parseFloat(inputAmount) / totalCollateralNumber) * 100).toFixed(2)) + debtPercentage;
      setInputPercentage(inputPercentageValue);
      prevInputPercentage.current = inputPercentageValue;
      prevInputAmount.current = inputAmount;
    }
  }, [inputAmount, totalCollateral, inputPercentage]);

  let priceImpactColor = 'neutral';
  if (priceImpact <= -3 && priceImpact > -5) {
    priceImpactColor = 'secondary.500';
  } else if (priceImpact <= -5) {
    priceImpactColor = 'danger';
  }

  const riskLevel = useMemo(() => {
    if (isExceedBalance) {
      return RiskLevelType.INSUFFICIENT_COLLATERAL;
    }
    return inputPercentage < 20 ? RiskLevelType.LOW : inputPercentage < 40 ? RiskLevelType.MEDIUM : RiskLevelType.HIGH;
  }, [inputPercentage, isExceedBalance]);

  const isSliderDisabled = useMemo(() => !collateralStatus.totalCollateral.gt(Zero), [collateralStatus]);

  const inputPercentageForDisplay = useMemo(() => formatZeroOrUndefined(inputPercentage, 2) + '%', [inputPercentage]);
  const userWillReceiveForDisplay = useMemo(
    () => formatAmount(inputBigNumber.sub(requiredBaseToken), decimals, 4),
    [inputBigNumber, requiredBaseToken, decimals],
  );
  const valueToBuyLongForDisplay = useMemo(
    () => formatAmount(requiredBaseToken, decimals, 4),
    [requiredBaseToken, decimals],
  );
  const longAmountForDisplay = useMemo(() => formatAmount(hedgeBaseToken, decimals, 2), [hedgeBaseToken, decimals]);
  const fixedApyForDisplay = useMemo(() => formatPercentage(formatZeroOrUndefined(fixedApy, 4)) + '%', [fixedApy]);
  const priceImpactForDisplay = useMemo(() => formatZeroOrUndefined(priceImpact, 4) + '%', [priceImpact]);

  return (
    <Box position='relative'>
      {(!term || chainId !== termParams?.chainId) && (
        <Center
          position='absolute'
          w='100%'
          h='100%'
          zIndex='2'
          opacity='0.99'
          backdropFilter='blur(2px)'
          bg='primary.700-60'
        >
          <Text color='primary.100' fontSize='lg'>
            Unavailable for borrowing
          </Text>
        </Center>
      )}
      <Box position='relative' w='100%' pt='1rem'>
        <Flex justify='space-between' mb='1rem' px='0.5rem'>
          <Text fontSize='sm' fontWeight='700' color='primary.100'>
            Amount
          </Text>
          <Box ml='auto'>
            <SlippageSettingSelector />
          </Box>
        </Flex>
        <AmountInput
          isFocusedFromInput={isFocusedAmountInput}
          inputAmount={inputAmount}
          amountLabel={baseTokenName}
          setIsFocusedFromInput={setIsFocusedAmountInput}
          onChangeInput={onChangeInput}
          isExceedBalance={isExceedBalance && isConnect && collateralStatus.totalCollateral.gt(Zero)}
          decimals={decimals}
        />
        <SliderInput
          inputPercentage={inputPercentage}
          setInputPercentage={setInputPercentage}
          lowestValue={debtPercentage}
          isDisabled={isSliderDisabled}
        />
        {!isSliderDisabled && (
          <Flex justify='space-between' align='center' mb='1rem' mt='1rem' px='0.5rem'>
            <Flex align='center'>
              <Text fontWeight='bold' fontSize='xl'>
                {inputPercentageForDisplay}
              </Text>
              <Text fontWeight='bold' fontSize='sm' pl={{ base: '0.5rem ', lg: '1rem' }}>
                (LTV: {ltv} %)
              </Text>
            </Flex>
            <Button
              variant='tertiary'
              onClick={() =>
                setInputAmount(
                  formatZeroOrUndefined((parseFloat(totalCollateral) * (60 - debtPercentage)) / 100, decimals),
                )
              }
              disabled={inputPercentage > 60}
            >
              {inputPercentage > 60 ? 'Exceed MAX Ratio' : 'MAX safe ratio'}
            </Button>
          </Flex>
        )}
        <Box mb='1rem' mt='1rem'>
          <Collapse in={requiredBaseToken.gt(Zero)} transition={{ enter: { duration: 0.5 }, exit: { duration: 0.5 } }}>
            <Box p='1rem' borderRadius='0.5rem' bg='primary.900'>
              <Box mb='1rem'>
                <Flex justify='space-between' align='center'>
                  <Text mb='0.5rem' fontWeight='bold' fontSize='2xl' color={RISK_INFO[riskLevel].color}>
                    {RISK_INFO[riskLevel].content}
                  </Text>
                  <Link
                    href={termParams ? baseTokenDataType?.depositLinks[termParams.protocolType]?.[chainId] : ''}
                    isExternal
                    variant='secondary'
                  >
                    <HStack alignItems='center' spacing='4px' fontSize='xs'>
                      <Text>AAVE</Text>
                      <IconLink width='1rem' />
                    </HStack>
                  </Link>
                </Flex>
                <Text fontWeight='bold' fontSize='sm'>
                  {`will receive: ${userWillReceiveForDisplay} ${baseTokenName}`}
                </Text>
              </Box>
              <Box>
                <InfoPair name='Total Value to Buy LONG' value={`${valueToBuyLongForDisplay} ${baseTokenName}`} />
                <InfoPair name='Total Amount of LONG' value={longAmountForDisplay} />
                <InfoPair name='Fixed APY' value={`${fixedApyForDisplay}`} />
                <InfoPair
                  name='Price Impact'
                  value={<Text color={priceImpactColor}>{`${priceImpactForDisplay}`}</Text>}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>
        {renderStepMainButton()}
        <BorrowingModal
          isOpen={modalIsOpen}
          onClose={modalOnClose}
          borrow={borrow}
          totalBorrowingAmount={inputAmount}
          baseTokenName={baseTokenName}
          inputPercentage={inputPercentageForDisplay}
          riskLevel={riskLevel}
          userWillReceive={userWillReceiveForDisplay}
          valueToBuyLong={valueToBuyLongForDisplay}
          longAmount={longAmountForDisplay}
          fixedApy={fixedApyForDisplay}
          priceImpact={priceImpactForDisplay}
        />
      </Box>
    </Box>
  );
}

export default FixedApyBorrowAmountInput;
