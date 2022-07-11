import React, { useCallback, ReactElement, useState } from 'react';
import { Box, Flex, Text, Center } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import { formatAmount, formatBigNumberDisplay, formatPercentage, formatZeroOrUndefined } from '../../utils';
import { ChainId } from '../../constants';
import { ReactComponent as IconPlus } from '../../assets/icon-plus.svg';
import SlippageSettingSelector from '../SlippageSettingSelector';
import { AmountInput } from '../common/AmountInput';
import { AmountOutput } from '../common/AmountOutput';
import IGainIrsTermParams from '../../constants/termInfo/iGainIrsTermParams';
import { CollapseTradingDetail } from '../CollapseTradingDetail';
import { PROTOCOL_DATA } from '../../constants/termInfo/protocolType';

interface Props {
  chainId: ChainId;
  term?: IGainTerm;
  baseTokenName: string;
  baseTokenBalance: BigNumber;
  inputAmount: string;
  fixedApy: number;
  priceImpact: number;
  estimatedHedgeAmount: string;
  requiredBaseToken: BigNumber;
  termParams?: IGainIrsTermParams;
  inputBigNumber: BigNumber;
  isExceedBalance?: boolean;
  setInputAmount: (input: string) => void;
  renderStepMainButton: () => ReactElement;
}

function FixedApyAaveLendInputArea({
  chainId,
  term,
  baseTokenName,
  baseTokenBalance,
  inputAmount,
  fixedApy,
  priceImpact,
  estimatedHedgeAmount,
  requiredBaseToken,
  termParams,
  inputBigNumber,
  isExceedBalance,
  setInputAmount,
  renderStepMainButton,
}: Props): ReactElement {
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

  const transactionData = [
    { name: 'Total Value in Lending', value: `${Number(formatAmount(inputBigNumber, decimals, 4))} ${baseTokenName}` },
    { name: 'Total Amount of SHORT', value: formatZeroOrUndefined(estimatedHedgeAmount, 4) },
    { name: 'Estimated Fixed APY', value: `${formatPercentage(formatZeroOrUndefined(fixedApy, 4))}%` },
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
          {`to lend on ${term?.protocolType && PROTOCOL_DATA[term?.protocolType].name} `}
        </AmountInput>
        <Center color='primary.100' py='20px'>
          <IconPlus />
        </Center>
        <AmountOutput amountLabel={baseTokenName} amount={formatBigNumberDisplay(requiredBaseToken, decimals, 4)}>
          to buy SHORT and hedge interests
        </AmountOutput>
        <Box mb='1rem' mt='1rem'>
          <CollapseTradingDetail
            collapseTrigger={requiredBaseToken.gt(Zero)}
            headerTitle='Total'
            headerContent={`${formatAmount(inputBigNumber.add(requiredBaseToken), decimals, 4)} ${baseTokenName}`}
            topSectionFooterContent={`Your Balance: ${formatAmount(baseTokenBalance, decimals, 4)} ${baseTokenName}`}
            transactionData={transactionData}
          />
        </Box>
        {renderStepMainButton()}
      </Box>
    </Box>
  );
}

export default FixedApyAaveLendInputArea;
