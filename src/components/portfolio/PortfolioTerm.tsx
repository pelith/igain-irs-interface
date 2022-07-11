import React, { ReactElement, useCallback } from 'react';
import { Box, Flex, Button, Text, Link, VStack, HStack } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import TermStatus from '../../constants/termInfo/termStatus';
import BaseTokenType from '../../constants/termInfo/baseTokenType';
import ProtocolType, { PROTOCOL_DATA } from '../../constants/termInfo/protocolType';
import { transformDate, transformDateYearToDate, transformDateHoursToMinutes } from '../../utils';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import CountDownInfo from '../CountDownInfo';
import { ReactComponent as TicktackIcon } from '../../assets/icon-ticktack.svg';
import { ReactComponent as IconArrowRight } from '../../assets/icon-arrow-right.svg';
import { ReactComponent as IconLink } from '../../assets/icon-link.svg';
import { ReactComponent as IconWithdraw } from '../../assets/icon-withdraw.svg';
import { EXTERNAL_LINKS, INTERNAL_PATH } from '../../constants/links';

interface Props {
  baseToken: BaseTokenType;
  termStatus: TermStatus;
  closeDateTime: number;
  archivedTime?: number;
  protocol: ProtocolType;
  long: string;
  short: string;
  lp: string;
  farmLp: string;
  contractAddress: string;
  farmContract?: string;
  depositLink?: string;
  onClickRedeem: (contractAddress: string) => void;
}

const renderInfo = (title: React.ReactNode, content: string) => {
  const titleNode = typeof title === 'string' ? <Text color='primary.100'>{title}</Text> : title;
  return (
    <Flex justify='space-between' fontSize='sm'>
      {titleNode}
      <Text fontWeight='bold' color={parseFloat(content) === 0 ? 'primary.100' : ''}>
        {content}
      </Text>
    </Flex>
  );
};

function PortfolioTerm({
  baseToken,
  depositLink,
  closeDateTime,
  protocol,
  long,
  short,
  lp,
  farmLp,
  termStatus,
  contractAddress,
  archivedTime,
  farmContract,
  onClickRedeem,
}: Props): ReactElement {
  const baseTokenInfo = BASE_TOKEN_DATA?.[baseToken];
  const Icon = baseTokenInfo?.Icon;
  const redeemHandler = useCallback(() => {
    onClickRedeem(contractAddress);
  }, [contractAddress, onClickRedeem]);

  return (
    <Flex
      direction='column'
      bg='primary.700'
      w={{ base: 'full', lg: '352px' }}
      p='26px'
      mr='6px'
      mb='6px'
      borderRadius='0.5rem'
    >
      <Flex>
        {Icon && <Icon width='36px' height='36px' />}
        <Flex flex='1' justify='space-between' align='center' pl='12px'>
          <Box>
            <Text color='primary.100' fontSize='xs' fontWeight='bold'>
              {baseToken}
            </Text>
            <Text fontWeight='bold' fontSize='xl' lineHeight='24px'>
              {transformDateYearToDate(closeDateTime)}
            </Text>
            <Text fontSize='sm'>{transformDateHoursToMinutes(closeDateTime)}</Text>
          </Box>
          {TermStatus.ACTIVE === termStatus && (
            <Button
              as={ReachLink}
              to={`${INTERNAL_PATH.TRADE_DETAIL}/${contractAddress}`}
              variant='iconBtn'
              size='iconBtnSm'
              bg='primary.500'
            >
              <IconArrowRight />
            </Button>
          )}
        </Flex>
      </Flex>
      <VStack
        w='87%'
        ml='42px'
        my='1rem'
        py='1rem'
        spacing='1rem'
        align='flex-start'
        borderTop='2px solid'
        borderBottom='2px solid'
        borderColor='primary.900'
      >
        <Box w='full'>{renderInfo('Protocol', PROTOCOL_DATA[protocol].name)} </Box>
        <Box w='full'>{renderInfo('LONG', long)} </Box>
        <Box w='full'>{renderInfo('SHORT', short)} </Box>
        <Box w='full'>{renderInfo('LP', lp)} </Box>
        {parseFloat(farmLp) > 0 && (
          <Box w='full'>
            {renderInfo(
              <Link
                fontSize='sm'
                href={`${EXTERNAL_LINKS.HAKKA_FINANCE_FARMS}/${farmContract}`}
                isExternal
                color='primary.100'
                _hover={{ color: 'white' }}
              >
                <Flex align='center'>
                  <Text pr='8px'>Staked LP</Text>
                  <IconLink width='18' />
                </Flex>
              </Link>,
              farmLp,
            )}
          </Box>
        )}
      </VStack>
      {TermStatus.ACTIVE === termStatus && (
        <Box mt='auto'>
          <Flex>
            <Box mr='20px' color='primary.100'>
              <TicktackIcon width='20px' height='20px' />
            </Box>
            <Box>
              <CountDownInfo countdownTime={closeDateTime} />
              <Text mt='0.5rem' fontSize='xs' fontWeight='bold' color='primary.100'>
                Tokens can be redeemed after maturity
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      {TermStatus.ACTIVE !== termStatus && (
        <Box mt='auto'>
          <Box>
            <Flex color='primary.100'>
              <TicktackIcon width='20px' height='20px' />
              <Text pl='20px' color='secondary.500' fontWeight='bold'>
                Expired
              </Text>
            </Flex>
            <Box
              my='0.5rem'
              ml='10px'
              pl='30px'
              borderLeft='1px solid'
              borderColor='primary.300'
              fontSize='xs'
              fontWeight='bold'
            >
              <Text>Switch your position to a new term</Text>
              <Button as={ReachLink} to={`${INTERNAL_PATH.TRADE}`} variant='secondary' my='18px' w='full'>
                <HStack align='flex-end' spacing='0.5rem'>
                  <Text fontWeight='bold'>Restart</Text>
                  <IconArrowRight />
                </HStack>
              </Button>
              <Box display='inline-block'>
                <Link href={depositLink} isExternal>
                  <Flex align='center'>
                    <Text pr='6px'>{`Or manage on ${protocol}`}</Text>
                    <IconLink width='16px' height='16px' />
                  </Flex>
                </Link>
              </Box>
            </Box>
          </Box>
          <Flex>
            <Box>
              <IconWithdraw width='22px' height='22px' />
            </Box>
            <Text pl='22px' fontSize='xs' fontWeight='bold'>
              This term has reached maturity. You may now redeem your tokens!
            </Text>
          </Flex>
          <Box mt='1rem' pl='40px'>
            <Button
              disabled={TermStatus.EXPIRED !== termStatus}
              onClick={redeemHandler}
              variant='primary'
              colorScheme='secondary'
              w='full'
            >
              {termStatus === TermStatus.SETTLING ? 'Settling' : 'Redeem All'}
            </Button>
            {archivedTime && (
              <Text mt='1rem' fontSize='xs' fontWeight='bold'>{`Redeemed at ${transformDate(archivedTime)}`}</Text>
            )}
          </Box>
        </Box>
      )}
    </Flex>
  );
}

export default PortfolioTerm;
