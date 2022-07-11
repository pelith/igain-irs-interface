import React, { ReactElement, useState, useCallback } from 'react';
import { Box, Center, Flex, Text, Button } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { ChainId } from '../../constants';
import IGainIrsTermParams from '../../constants/termInfo/iGainIrsTermParams';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import { formatAmount, formatBigNumberDisplay, formatPercentage, formatZeroOrUndefined } from '../../utils';
import { AmountInput } from '../common/AmountInput';
import SlippageSettingSelector from '../SlippageSettingSelector';
import { Zero } from '@ethersproject/constants';
import { formatUnits } from 'ethers/lib/utils';
import { CollapseTradingDetail } from '../CollapseTradingDetail';

interface Props {
  chainId: ChainId;
  term?: IGainTerm;
  baseTokenName: string;
  baseTokenBalance: BigNumber;
  inputAmount: string;
  fixedApy: number;
  priceImpact: number;
  requiredBaseToken: BigNumber;
  termParams?: IGainIrsTermParams;
  inputBigNumber: BigNumber;
  isExceedBalance?: boolean;
  estimatedHedgeAmount: string;
  setInputAmount: (input: string) => void;
  renderStepMainButton: () => ReactElement;
}

const FixedApyYearnLendInputArea = ({
  chainId,
  term,
  termParams,
  inputAmount,
  baseTokenName,
  baseTokenBalance,
  isExceedBalance,
  requiredBaseToken,
  estimatedHedgeAmount,
  inputBigNumber,
  fixedApy,
  priceImpact,
  renderStepMainButton,
  setInputAmount,
}: Props): ReactElement => {
  const onChangeInput = useCallback(
    (value) => {
      setInputAmount(value);
    },
    [setInputAmount],
  );

  const decimals = term?.decimals || 18;

  const [isFocusedAmountInput, setIsFocusedAmountInput] = useState(false);

  let priceImpactColor = 'neutral';
  if (priceImpact <= -3 && priceImpact > -5) {
    priceImpactColor = 'secondary.500';
  } else if (priceImpact <= -5) {
    priceImpactColor = 'danger';
  }

  const FAKE_DATA = [
    { name: 'Total Value to buy SHORT', value: `${formatAmount(requiredBaseToken, decimals, 4)} ${baseTokenName}` },
    { name: 'Total Amount of SHORT', value: formatZeroOrUndefined(estimatedHedgeAmount, 4) },
    { name: 'Fixed APY', value: `${formatPercentage(formatZeroOrUndefined(fixedApy, 4))}%` },
    {
      name: 'Price Impact',
      value: <Text color={priceImpactColor}>{`${formatZeroOrUndefined(priceImpact, 4)}%`}</Text>,
    },
  ];

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
            Unavailable for deposit
          </Text>
        </Center>
      )}
      <Box position='relative' w='100%' p='1rem'>
        <Flex justify='space-between' mb='1rem'>
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
          isExceedBalance={isExceedBalance}
          decimals={decimals}
        >
          <Flex align='center'>
            <Text>
              Blance: {formatBigNumberDisplay(baseTokenBalance, decimals, 4)} {baseTokenName}
            </Text>
            <Button
              variant='plain'
              onClick={() => setInputAmount(formatUnits(baseTokenBalance, decimals))}
              ml='0.25rem'
              color='accent.500'
            >
              (MAX)
            </Button>
          </Flex>
        </AmountInput>
        <Box mb='1rem' mt='1rem'>
          <CollapseTradingDetail
            collapseTrigger={requiredBaseToken.gt(Zero)}
            headerTitle='Hedge Position'
            headerContent={`${formatAmount(inputBigNumber.sub(requiredBaseToken), decimals, 4)} ${baseTokenName}`}
            transactionData={FAKE_DATA}
          />
        </Box>
        {renderStepMainButton()}
      </Box>
    </Box>
  );
};

export default FixedApyYearnLendInputArea;
