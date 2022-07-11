import React, { ReactElement } from 'react';
import { Box, Text, Flex, Stack } from '@chakra-ui/react';
import { Zero } from '@ethersproject/constants';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import TermsMenu from './TermsMenu';
import { ReactComponent as LpIcon } from '../assets/tokenIcons/icon-lp.svg';
import { ReactComponent as ShortIcon } from '../assets/tokenIcons/icon-short.svg';
import { ReactComponent as LongIcon } from '../assets/tokenIcons/icon-long.svg';
import { UserInfo } from '../constants/userInfo';
import SideInfoPageType from '../constants/sideInfoDisplayType';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import { transformDateYearToDate, transformDateHoursToMinutes, formatAmount } from '../utils';
import IntroList from './IntroList';
import BalanceItem from './common/BalanceItem';
import useWindowSize from '../hooks/useWindowSize';
import { ResponsiveView } from '../constants/responsive';

interface Props {
  iGainTermsInfo?: IGainTerm[];
  currentTermInfo?: IGainTerm;
  decimals: number;
  userInfo?: UserInfo[];
  page: SideInfoPageType;
  setCurrentTermInfo: (input: IGainTerm) => void;
}

function SideInfo({
  iGainTermsInfo,
  page,
  userInfo,
  currentTermInfo,
  decimals,
  setCurrentTermInfo,
}: Props): ReactElement {
  const windowSize = useWindowSize();
  const currentAddress = currentTermInfo?.address;
  const baseToken = currentTermInfo?.tradeBaseTokenType;
  const closeTime = currentTermInfo?.closeTime;

  const Icon = baseToken ? BASE_TOKEN_DATA[baseToken].Icon : undefined;

  const termsWithoutCurrentTerm = iGainTermsInfo?.filter(
    (e) => e.address !== currentAddress && e.closeTime * 1000 > Date.now(),
  );
  const targetUser = userInfo?.find((user) => user.address === currentAddress);
  const lpBalance = formatAmount(targetUser?.lpBalance || Zero, decimals, 4);
  const shortBalance = formatAmount(targetUser?.shortBalance || Zero, decimals, 4);
  const longBalance = formatAmount(targetUser?.longBalance || Zero, decimals, 4);
  return (
    <Flex height='100%' direction='column' justify='space-between' pb='1rem'>
      <Box>
        <Flex align='center' mb={{ base: '24px', lg: '40px' }} justify={{ base: 'space-between', lg: 'start' }}>
          <Flex align='center' mr='50px'>
            <Box pr='8px'>{baseToken ? <Icon width='36.67px' height='36.67px' /> : '-'}</Box>
            <Box pt='8px'>
              <Text fontSize='xl' fontWeight='bold'>
                {closeTime ? transformDateYearToDate(closeTime * 1000) : '-'}
              </Text>
              <Text fontSize='sm'>{closeTime ? transformDateHoursToMinutes(closeTime * 1000) : '-'}</Text>
            </Box>
          </Flex>
          {termsWithoutCurrentTerm && termsWithoutCurrentTerm.length > 0 && (
            <TermsMenu terms={termsWithoutCurrentTerm} setCurrentTermInfo={setCurrentTermInfo} />
          )}
        </Flex>
        {page === SideInfoPageType.POOL ? (
          <BalanceItem content='LP' balance={lpBalance} Icon={LpIcon} />
        ) : (
          <Stack spacing={{ base: '26px', lg: '18px' }} direction={{ base: 'row', lg: 'column' }} shouldWrapChildren>
            <BalanceItem content='LONG' balance={longBalance} Icon={LongIcon} />
            <BalanceItem content='SHORT' balance={shortBalance} Icon={ShortIcon} />
          </Stack>
        )}
      </Box>
      {windowSize === ResponsiveView.WEB && <IntroList protocolType={currentTermInfo?.protocolType} />}
    </Flex>
  );
}

export default SideInfo;
