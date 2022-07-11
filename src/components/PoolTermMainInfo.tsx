import React, { useMemo, useContext, ReactElement } from 'react';
import { Box, Button, Flex, Link, Text, HStack } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { Zero } from '@ethersproject/constants';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import CountDownInfo from './CountDownInfo';
import { EXTERNAL_LINKS, INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconTicktack } from '../assets/icon-ticktack.svg';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';
import { CHAIN_DISPLAY_INFO } from '../constants';
import { ReactComponent as IconLink } from '../assets/icon-link.svg';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import { Web3Context } from '../context/Web3Context';
import { SelectedChainContext } from '../context/SelectedChainContext';
import useTokenPrice from '../hooks/useTokenPrice';
import useRewardApr from '../hooks/useRewardsApr';
import useFeeApy from '../hooks/useFeeApys';
import useIGainTradingVolume from '../hooks/useIGainTradingVolumes';
import { formatAmount, formatPercentage } from '../utils';
import CommonSkeleton from './common/CommonSkeleton';
import { TermFactoryContext } from '../context/TermFactoryContext';
import { parseUnits } from 'ethers/lib/utils';
import ProtocolType from '../constants/termInfo/protocolType';
import { YEarnPriceContext } from '../context/YEarnPriceContext';
import { TOKEN_PRICE_KEYS } from '../constants/tokenPriceKey';

interface Props {
  termInfo?: IGainTerm;
}
interface InfoItemProps {
  title: string;
  children: React.ReactNode;
}
interface DataTextProps {
  children: React.ReactNode;
}

function InfoItem({ title, children }: InfoItemProps): ReactElement {
  return (
    <Box mb='16px'>
      <Text fontSize='sm' color='primary.100'>
        {title}
      </Text>
      {children}
    </Box>
  );
}

function DataText({ children }: DataTextProps): ReactElement {
  return <Text fontSize='lg'>{children}</Text>;
}

function PoolTermMainInfo({ termInfo }: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const yearnTokenPrices = useContext(YEarnPriceContext);
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const tokenPrices = useTokenPrice(TOKEN_PRICE_KEYS.toString());
  const targetTermData = useMemo(
    () => getParamsByContractId(termInfo?.address || '', selectedChain, iGainTermBaseInfo),
    [termInfo, selectedChain],
  );
  const rewardAprInfo = useRewardApr(targetTermData, tokenPrices, web3Controller);
  const [feeApy, protocolTokenApy] = useFeeApy(targetTermData, web3Controller);
  const tradingVolume = useIGainTradingVolume(targetTermData, web3Controller);
  const decimals = targetTermData?.baseTokenType ? BASE_TOKEN_DATA[targetTermData?.baseTokenType].decimals : 18;
  const termChainName = useMemo(() => {
    if (targetTermData && targetTermData.chainId) {
      return CHAIN_DISPLAY_INFO[targetTermData.chainId].displayName;
    }
    return '-';
  }, [targetTermData]);

  const unitValueBalance = useMemo(() => {
    if (!termInfo) {
      return Zero;
    }
    let calcUnitValueBalance = termInfo.termBaseTokenBalance || Zero;
    if (termInfo.protocolType === ProtocolType.YEARN) {
      const multiplier = yearnTokenPrices?.[termInfo.tradeBaseTokenType] || parseUnits('1', decimals);
      calcUnitValueBalance = calcUnitValueBalance.mul(multiplier).div(parseUnits('1', decimals));
    }
    return calcUnitValueBalance || Zero;
  }, [termInfo]);

  return (
    <Box bg='primary.700' w={{ base: 'full', lg: '352px' }} p='1.5rem' pb='16px' mt='1rem' borderRadius='0.5rem'>
      <Flex justify='space-between' mb='34px'>
        <HStack spacing='10px' align='center' color='accent.500'>
          <IconTicktack />
          {termInfo ? <CountDownInfo countdownTime={termInfo.closeTime * 1000} /> : '-'}
        </HStack>
        <Button
          as={ReachLink}
          size='sm'
          variant='secondary'
          to={`${INTERNAL_PATH.TRADE_DETAIL}/${termInfo?.address}`}
          rightIcon={<IconArrowRight width='14px' height='11px' />}
        >
          Trade
        </Button>
      </Flex>
      <InfoItem title='Total APY'>
        <Flex justify='space-between'>
          <CommonSkeleton isLoaded={!!rewardAprInfo && !!feeApy}>
            <DataText>
              {formatPercentage(
                formatAmount(
                  (rewardAprInfo?.div(10 ** (18 - decimals)) || Zero).add(feeApy || Zero).add(protocolTokenApy || Zero),
                  decimals,
                  2,
                ),
              )}
              %
            </DataText>
          </CommonSkeleton>
          <Flex direction='column' align='end'>
            {targetTermData && !!targetTermData.terms[0].farmAddress && (
              <CommonSkeleton isLoaded={!!rewardAprInfo && !!feeApy}>
                <Text fontSize='sm'>Base APY {formatPercentage(formatAmount(feeApy, decimals, 2))}%</Text>
              </CommonSkeleton>
            )}
            {protocolTokenApy && protocolTokenApy.gt(Zero) && (
              <CommonSkeleton isLoaded={!!rewardAprInfo && !!protocolTokenApy}>
                <Text fontSize='sm'>Yearn APY {formatPercentage(formatAmount(protocolTokenApy, decimals, 2))}%</Text>
              </CommonSkeleton>
            )}
          </Flex>
        </Flex>
      </InfoItem>
      {targetTermData && !!targetTermData.terms[0].farmAddress && (
        <InfoItem title='Reward APY'>
          <Flex justify='space-between'>
            <CommonSkeleton isLoaded={!!rewardAprInfo}>
              <DataText>{formatPercentage(formatAmount(rewardAprInfo, 18, 2))}%</DataText>
            </CommonSkeleton>
            <Link
              fontSize='sm'
              href={`${EXTERNAL_LINKS.HAKKA_FINANCE_FARMS}/${targetTermData.terms[0].farmAddress}`}
              isExternal
              color='#3EBD93'
            >
              <Flex align='center'>
                <Text pr='8px'>HAKKA Farm</Text>
                <IconLink width='18' />
              </Flex>
            </Link>
          </Flex>
        </InfoItem>
      )}
      <InfoItem title='Volume (7d)'>
        <CommonSkeleton isLoaded={!!tradingVolume}>
          <DataText>${formatAmount(tradingVolume, decimals, 2)}</DataText>
        </CommonSkeleton>
      </InfoItem>
      <InfoItem title='Liquidity'>
        <DataText>${formatAmount(unitValueBalance, decimals, 2)}</DataText>
      </InfoItem>
      <InfoItem title='Protocol'>
        <DataText>{termInfo?.protocolType || '-'}</DataText>
      </InfoItem>
      <InfoItem title='Based On'>
        <DataText>{termChainName}</DataText>
      </InfoItem>
    </Box>
  );
}

export default PoolTermMainInfo;
