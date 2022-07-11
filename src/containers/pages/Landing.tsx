import React, { ReactElement, useMemo, useContext } from 'react';
import useSWR from 'swr';
import { parseUnits } from '@ethersproject/units';
import { Web3Context } from '../../context/Web3Context';
import { SelectedChainContext } from '../../context/SelectedChainContext';
import { Box, Heading, Text, Button, HStack, Stack, Flex, Spacer, Link, Center, Image } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import { TermsContext } from '../../context/TermsContext';
import { useFixedApyListWithTerms } from '../../hooks/useFixedApys';
import { ResponsiveView } from '../../constants/responsive';
import { EXTERNAL_LINKS, INTERNAL_PATH } from '../../constants/links';
import { formatPercentage, formatZeroOrUndefined, formattedNum } from '../../utils';
import { jsonFetcher } from '../../utils/fetch';
import FAQsAccordion from './../../components/FAQsAccordion';
import { ReactComponent as IconEarnFixedInterest } from '../../assets/icon-earn-fixed-interest.svg';
import { ReactComponent as IconFarmYield } from '../../assets/icon-farm-yield.svg';
import { ReactComponent as IconHedge } from '../../assets/icon-hedge.svg';
import { ReactComponent as IconArrowRight } from '../../assets/icon-arrow-right.svg';
import { ReactComponent as IconAdvantage1 } from '../../assets/icon-advantage1.svg';
import IconAdvantage2 from '../../assets/icon-advantage2.png';
import { ReactComponent as IconAdvantage3 } from '../../assets/icon-advantage3.svg';
import { ReactComponent as IconUsdt } from '../../assets/tokenIcons/icon-usdt.svg';
import { ReactComponent as IconUsdc } from '../../assets/tokenIcons/icon-usdc.svg';
import { ReactComponent as IconDai } from '../../assets/tokenIcons/icon-dai.svg';
import { ReactComponent as IconLink } from '../../assets/icon-link.svg';
import { ReactComponent as IconShort } from '../../assets/tokenIcons/icon-short.svg';
import { ReactComponent as IconLong } from '../../assets/tokenIcons/icon-long.svg';
import bgLanding1 from '../../assets/bgImages/bg-landing1.svg';
import bgLanding2 from '../../assets/bgImages/bg-landing2.svg';
import bgIGainV1 from '../../assets/bgImages/bg-igainV1.svg';
import EstimatedApyType from '../../constants/termInfo/estimatedApyType';
import bgIGainV1Mobile from '../../assets/bgImages/bg-igainV1-mobile.svg';
import CommonSkeleton from '../../components/common/CommonSkeleton';
import { useTradeTokenStandardPrices } from '../../hooks/useTradeTokenPrice';
import { TradeTokenType } from '../../constants/termInfo/tradeTokenConfig';
import TradeCardActionType from '../../constants/termInfo/tradeCardActionType';
import ProtocolType from '../../constants/termInfo/protocolType';
import { checkTermExpired } from '../../utils/checkTermExpired';
import ChainSwitch from '../../components/ChainSwitch';

interface LandingPageProps {}

interface IntroduceItemProps {
  Icon: React.FunctionComponent;
  title: string;
  content: string;
  btnContent: string;
  btnLinkTo: string;
}

const IntroduceItem = ({ Icon, title, content, btnContent, btnLinkTo }: IntroduceItemProps) => {
  return (
    <Box w='356px' p='40px 32px 32px 32px' bg='primary.700' borderRadius='8px'>
      <Box mb='1.5rem'>
        <Icon />
      </Box>
      <Flex mb={{ base: '1.5rem', lg: '0.5rem', xl: '1.5rem' }} align='center' minH={{ lg: '72px', xl: 'unset' }}>
        <Text fontWeight='bold' fontSize='2xl'>
          {title}
        </Text>
      </Flex>
      <Text h={{ lg: '72px', xl: 'unset' }} mb='1rem'>
        {content}
      </Text>
      <Link
        href={EXTERNAL_LINKS.HAKKA_FINANCE_TUTORIAL_VIDEO_PLAY_LIST}
        isExternal
        variant='primary'
        display='inline-block'
        mb={{ base: '2rem', lg: '0.5rem', xl: '2rem' }}
      >
        <Flex>
          <Text mr='0.5rem'>Tutorial Video</Text>
          <IconLink />
        </Flex>
      </Link>
      <Button as={ReachLink} to={btnLinkTo} variant='secondary' w='full' h='56px'>
        <Flex align='center'>
          <Text fontSize='md' fontWeight='bold' pr='13px'>
            {btnContent}
          </Text>
          <IconArrowRight width='1rem' height='1rem' />
        </Flex>
      </Button>
    </Box>
  );
};

interface AdvantageItemProps {
  title: JSX.Element;
  content: string;
  Icon: JSX.Element;
  isRowReverse?: boolean;
}

const AdvantageItem = ({ title, content, Icon, isRowReverse }: AdvantageItemProps) => (
  <Flex
    direction={{ base: 'column-reverse', lg: isRowReverse ? 'row-reverse' : 'row' }}
    justify='center'
    align='center'
    w={{ base: 'full', lg: '70%' }}
    maxW='900px'
    mb='60px'
  >
    <Box maxW='438px'>
      <Text
        align={{ base: 'center', lg: 'left' }}
        mb={{ base: '32px', lg: '48px' }}
        fontWeight='bold'
        fontSize={{ base: '2xl', lg: '4xl' }}
      >
        {title}
      </Text>
      <Text align={{ base: 'center', lg: 'left' }} color='primary.100'>
        {content}
      </Text>
    </Box>
    <Spacer />
    {Icon}
  </Flex>
);

interface SupportedInfoProps {
  Icon: JSX.Element;
  tokenName: string;
  content: JSX.Element;
}

const SupportedInfo = ({ Icon, tokenName, content }: SupportedInfoProps) => (
  <Flex>
    {Icon}
    <Box ml='22px'>
      <Text mb='4px' fontSize='2xl' fontWeight='bold'>
        {tokenName}
      </Text>
      <Text fontSize='sm' color='primary.100'>
        {content}
      </Text>
    </Box>
  </Flex>
);

interface TradingStatusItemProps {
  value?: string;
  subTitle: React.ReactNode;
}

const TradingStatusItem = ({ value, subTitle }: TradingStatusItemProps) => (
  <Flex direction='column' alignItems='center' p='1rem' w='216px'>
    <CommonSkeleton isLoaded={value !== '-'} minW='160px'>
      <Text mb='12px' fontSize='4xl' align='center' fontWeight='bold'>
        {value}
      </Text>
    </CommonSkeleton>
    <Text fontSize='lg' align='center'>
      {subTitle}
    </Text>
  </Flex>
);

export default function Landing({}: LandingPageProps): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { selectedChain } = useContext(SelectedChainContext);
  const { iGainTermsInfo } = useContext(TermsContext);
  const { data: totalNotionalValue } = useSWR(`${process.env.REACT_APP_CHART_API}/totalNotionalValue`, jsonFetcher);
  const { data: txVolume } = useSWR(`${process.env.REACT_APP_CHART_API}/txVolume`, jsonFetcher);
  const { data: tvl } = useSWR(`${process.env.REACT_APP_CHART_API}/tvl`, jsonFetcher);

  const [unexpiredTerms, borrowableTerms] = useMemo(() => {
    const unexpiredTermFiltered = iGainTermsInfo?.filter((term) => !checkTermExpired(term));
    return [
      unexpiredTermFiltered,
      unexpiredTermFiltered?.filter((igainTerm) => igainTerm.protocolType !== ProtocolType.YEARN),
    ];
  }, [iGainTermsInfo]);

  const dryRunPrices = useTradeTokenStandardPrices(TradeTokenType.SHORT, TradeCardActionType.BUY, unexpiredTerms);
  const markLongPrices = useMemo(() => {
    return dryRunPrices?.map((dryRunPrice, index) => {
      const decimals = unexpiredTerms?.[index].decimals || 18;
      return parseUnits('1', decimals).sub(parseUnits(dryRunPrice[1], decimals));
    });
  }, [dryRunPrices]);

  const fixedBorrowApy = useFixedApyListWithTerms(borrowableTerms, markLongPrices, web3Controller, selectedChain);

  const fixedLendingApy = useFixedApyListWithTerms(
    unexpiredTerms,
    markLongPrices,
    web3Controller,
    selectedChain,
    EstimatedApyType.LENDING,
  );
  const windowSize = useWindowSize();
  const compareApysDecrement = (a: number, b: number) => {
    return b - a;
  };
  const bestLendingApy = useMemo(
    () =>
      !fixedLendingApy
        ? '-'
        : formatPercentage(formatZeroOrUndefined(fixedLendingApy?.sort(compareApysDecrement)[0], 2)) + '%',
    [fixedLendingApy],
  );
  const bestBorrowingApy = useMemo(
    () =>
      !fixedBorrowApy
        ? '-'
        : formatPercentage(
            formatZeroOrUndefined(fixedBorrowApy.sort(compareApysDecrement)[fixedBorrowApy.length - 1 || 0], 2),
          ) + '%',
    [fixedBorrowApy],
  );

  return (
    <Box position='relative'>
      <Box
        position='absolute'
        zIndex='-1'
        w='full'
        h={{ base: '124px', sm: '248px', '2xl': '360px' }}
        bgImage={bgLanding1}
        bgRepeat='no-repeat'
        bgPosition={{ base: 'center', sm: 'top' }}
        bgSize={{ base: 'cover', sm: 'contain', xl: 'cover' }}
      />
      <Box px={{ base: '1rem', lg: '100px' }} w='full' maxW='1440px' mx='auto'>
        <Box mt={{ base: 'max(20%, 6.5rem)', lg: '13rem', '2xl': '19rem' }} mb={{ base: '5rem', lg: '10rem' }}>
          <Heading fontSize={{ base: '4xl', lg: '3.75rem' }} mb='1.5rem'>
            {`Trade on `}
            {windowSize === ResponsiveView.MOBILE && <br />}
            <Text as='span' bgGradient='linear(to-r, secondary.300, secondary.500)' bgClip='text'>
              interest rates.
            </Text>
            <Text>{` Without principal.`}</Text>
          </Heading>
          <Text color='primary.100' fontSize='xl'>
            Hedge against APR fluctuations for large gains
          </Text>
          <HStack spacing='1rem' mt='3rem' fontWeight='bold'>
            <Button
              as={ReachLink}
              to={INTERNAL_PATH.FIX_INTEREST}
              variant='primary'
              w={{ base: 'full', lg: '168px' }}
              h='56px'
            >
              <Text fontSize='md'>Launch App</Text>
            </Button>
            <Link href={EXTERNAL_LINKS.IGAIN_IRS_USER_GUIDE} isExternal variant='primary'>
              <Button variant='secondary' w={{ base: 'full', lg: '168px' }} h='56px'>
                <Text fontSize='md'>User Guide</Text>
              </Button>
            </Link>
          </HStack>
        </Box>
        <Text mb={{ base: '2.5rem', lg: '5rem' }} color='primary.100' fontSize={{ base: '2xl', lg: '4xl' }}>
          With iGain IRS, you can...
        </Text>
        <Stack
          justify='center'
          align={{ base: 'center', lg: 'flex-start' }}
          direction={{ base: 'column', lg: 'row' }}
          spacing='8px'
          mb={{ base: '100px', lg: '160px' }}
        >
          <IntroduceItem
            Icon={IconEarnFixedInterest}
            title='Earn Fixed Interest'
            content='Get a stable income by lending on DeFi platforms'
            btnContent='Get Fixed APY'
            btnLinkTo={INTERNAL_PATH.FIX_INTEREST}
          />
          <IntroduceItem
            Icon={IconHedge}
            title='Hedge'
            content='Transfer risks on your existing position'
            btnContent='Trade Now'
            btnLinkTo={INTERNAL_PATH.TRADE}
          />
          <IntroduceItem
            Icon={IconFarmYield}
            title='Farm Yield'
            content='Provide liquidity and earn fees and rewards'
            btnContent='Check Pools'
            btnLinkTo={INTERNAL_PATH.POOL}
          />
        </Stack>
        <Flex direction='column' alignItems='center' mb={{ base: '100px', lg: '200px' }}>
          <Flex direction={{ base: 'column', lg: 'row' }} justify='space-evenly' w='100%' maxW='1080px' mb='56px'>
            <TradingStatusItem
              value={tvl !== undefined ? `$${formattedNum(tvl)}` : '-'}
              subTitle='Total Value Locked'
            />
            <TradingStatusItem
              value={totalNotionalValue ? `$${formattedNum(totalNotionalValue)}` : '-'}
              subTitle='Notional Value'
            />
            <TradingStatusItem
              value={`${txVolume ? `$${formattedNum(txVolume)}` : '-'}`}
              subTitle='Transaction Volume'
            />
          </Flex>
          <Box
            mb='56px'
            w={{ base: '100%', lg: '768px' }}
            maxW='768px'
            p='40px'
            borderRadius='0.5rem'
            border='2px solid'
            borderColor={'primary.300'}
          >
            <Flex justifyContent='center' alignItems='center' mb={{ base: '56px', lg: '56px' }}>
              <ChainSwitch isSimpleMode={false} disableTriggerWallet={true} />
            </Flex>
            <Flex direction='column' alignItems='center'>
              <Flex direction={{ base: 'column', xl: 'row' }} justify='space-evenly' w='100%' maxW='1080px'>
                <TradingStatusItem
                  value={bestLendingApy}
                  subTitle={
                    <>
                      Best
                      <Text as='span' color='secondary.500' fontWeight='bold'>
                        {` Lending APY`}
                      </Text>
                    </>
                  }
                />
                {!!fixedBorrowApy?.length && fixedLendingApy && (
                  <TradingStatusItem
                    value={bestBorrowingApy}
                    subTitle={
                      <>
                        Best
                        <Text as='span' color='secondary.500' fontWeight='bold'>
                          {` Borrowing APY`}
                        </Text>
                      </>
                    }
                  />
                )}
              </Flex>
            </Flex>
          </Box>
          <Flex direction={{ base: 'column', lg: 'row' }} justifyContent='center' alignItems='center'>
            <Flex m='1rem'>
              <IconShort width='24px' height='24px' />
              <Text ml='1rem' maxW='276px' fontSize='sm' color='primary.100'>
                Buy Short tokens to hedge lending positions
              </Text>
            </Flex>
            <Flex m='1rem'>
              <IconLong width='24px' height='24px' />
              <Text ml='1rem' maxW='276px' fontSize='sm' color='primary.100'>
                Buy Long tokens to lock future borrowing costs
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Text textAlign='center' fontSize='4xl' bgGradient='linear(to-r, accent.500, accent.300)' bgClip='text'>
          Why iGain IRS?
        </Text>
        <Flex direction='column' align='center' mt='5rem'>
          <AdvantageItem
            title={<>Secure your Interest</>}
            content='Buy Long or Short Tokens to earn fixed APY and hedge your portfolio against volatility in the crypto
              market'
            Icon={<IconAdvantage1 width={windowSize === ResponsiveView.MOBILE ? '311px' : '346px'} />}
          />
          <AdvantageItem
            title={
              windowSize === ResponsiveView.WEB ? (
                <>
                  Tokenize and <br /> Transfer Risks
                </>
              ) : (
                <>
                  Tokenize and Transfer <br /> Risks
                </>
              )
            }
            content='Trade Long or Short Tokens in the marketplace to shift risks and transform tiny arbitrage profits into large gains'
            Icon={
              <Box>
                <Image src={IconAdvantage2} width={windowSize === ResponsiveView.MOBILE ? '311px' : '346px'} />
              </Box>
            }
            isRowReverse={true}
          />
          <AdvantageItem
            title={<>Without Principal</>}
            content='Boost your capital efficiency by taking benefit from interest rate volatility without requiring principal'
            Icon={<IconAdvantage3 width={windowSize === ResponsiveView.MOBILE ? '311px' : '346px'} />}
          />
        </Flex>
        <Flex justify='center' mb='10rem'>
          <Link href={EXTERNAL_LINKS.IGAIN_IRS_WHITEPAPER} isExternal variant='primary'>
            <Button variant='primary' w='216px' h='56px' fontSize='md' fontWeight='bold'>
              Read Whitepaper
            </Button>
          </Link>
        </Flex>
        <Box mt={{ base: '60px', lg: '120px' }} mb={{ base: '100px', lg: '200px' }}>
          <Center mb='52px' fontWeight='bold' fontSize='2xl'>
            Assets Supported
          </Center>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: '36px', lg: '6%' }}
            justify='center'
            align={{ base: 'center' }}
          >
            <SupportedInfo
              Icon={<IconUsdc width='55px' height='55px' />}
              tokenName='USDC'
              content={
                <>
                  AAVE on Polygon <br /> AAVE/Yearn on Ethereum (coming soon)
                </>
              }
            />
            <SupportedInfo
              Icon={<IconDai width='55px' height='55px' />}
              tokenName='DAI'
              content={
                <>
                  AAVE on Polygon <br /> AAVE/Yearn on Ethereum (coming soon)
                </>
              }
            />
            <SupportedInfo
              Icon={<IconUsdt width='55px' height='55px' />}
              tokenName='USDT'
              content={
                <>
                  AAVE on Polygon <br /> AAVE/Yearn on Ethereum (coming soon)
                </>
              }
            />
          </Stack>
        </Box>
        <Flex direction='column' align='center' mb={{ base: '5rem', lg: '10rem' }}>
          <Text
            mb={{ base: '40px', lg: '80px' }}
            bgGradient='linear(to-r, accent.500, accent.300)'
            bgClip='text'
            fontSize='4xl'
          >
            FAQs
          </Text>
          <Box w='full' maxW='1008px'>
            <FAQsAccordion />
          </Box>
          <Text mt='60px' mb='16px'>
            Any other helps?
          </Text>
          <Link href={EXTERNAL_LINKS.JOIN_DISCORD_COMMUNITY} isExternal variant='primary'>
            <Button variant='secondary' w='278px' h='56px'>
              Join Discord Community
            </Button>
          </Link>
        </Flex>
        <Box mb={{ base: '5rem', lg: '10rem' }}>
          <Text mb={{ base: '2.5rem', lg: '5rem' }} color='primary.100' fontSize={{ base: '2xl', lg: '4xl' }}>
            The iGain Ecosystem
          </Text>
          <Stack spacing='0.5rem' direction={{ base: 'column', lg: 'row' }}>
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              justify={{ base: 'flex-start', lg: 'space-between' }}
              align={{ base: 'flex-start', lg: 'flex-end' }}
              p={{ base: '98px 32px 32px 32px', lg: '128px 60px 48px 60px' }}
              flex={2}
              bgImage={windowSize === ResponsiveView.WEB ? bgIGainV1 : bgIGainV1Mobile}
              bgRepeat='no-repeat'
              bgSize={{ base: 'contain', sm: 'cover' }}
              borderRadius='0.5rem'
              bgColor='primary.700'
            >
              <Box mb={{ base: '2rem', lg: '0' }}>
                <Text fontSize='4xl'>
                  {`iGain `}
                  <Text as='span' fontWeight='bold'>
                    IG
                  </Text>
                </Text>
                <Text fontSize={{ base: 'md', lg: '2xl' }} color='primary.100'>
                  Hedge on
                  <Text as='span' color='secondary.300'>
                    {` Impermanent Loss`}
                  </Text>
                </Text>
              </Box>
              <Link href={EXTERNAL_LINKS.IGAIN_IG} isExternal w={{ base: 'full', lg: '159px' }} variant='primary'>
                <Button variant='secondary' w='full' h='56px'>
                  <Flex align='center'>
                    <Text pr='13px' fontSize='md' fontWeight='bold'>
                      Start Now
                    </Text>
                    <IconArrowRight />
                  </Flex>
                </Button>
              </Link>
            </Flex>
            <Box
              p={{ base: '98px 32px 32px 32px', lg: '98px 32px 48px 32px' }}
              flex={1}
              bg='primary.700'
              borderRadius='0.5rem'
            >
              <Text mb='2rem' fontSize='2xl' lineHeight='2rem' color='primary.100'>
                New Products Coming Soon!
              </Text>
              <Link href={EXTERNAL_LINKS.IGAIN_ECOSYSTEM} variant='primary' display='inline-block'>
                <Flex color='secondary.300' fontWeight='bold'>
                  <Text pr='6px' fontSize='sm'>
                    iGain Ecosystem
                  </Text>
                  <IconLink width='20px' height='20px' />
                </Flex>
              </Link>
            </Box>
          </Stack>
        </Box>
        <Flex
          direction='column'
          align='center'
          textAlign={windowSize === ResponsiveView.MOBILE ? 'center' : 'left'}
          mb={{ base: '60px', lg: '280px', '2xl': '26rem' }}
        >
          <Text
            mb='1.25rem'
            fontSize='4xl'
            fontWeight='bold'
            bgGradient='linear(to-r, accent.500, accent.300)'
            bgClip='text'
          >
            Make {windowSize === ResponsiveView.MOBILE && <br />} a proposal
          </Text>
          <Text mb='3rem' fontSize='2xl'>
            For the next iGain product in the Hakka Finance DAO forum here
          </Text>
          <Link href={EXTERNAL_LINKS.HAKKA_FORUM} isExternal>
            <Button variant='primary' w='160px' h='56px'>
              <Text fontSize='md' fontWeight='bold'>
                Visit forum
              </Text>
            </Button>
          </Link>
        </Flex>
      </Box>
      <Box
        position='absolute'
        bottom='0'
        zIndex='-1'
        w='full'
        h={{ base: '124px', sm: '238px', xl: '280px', '2xl': '360px' }}
        bgImage={bgLanding2}
        bgPosition={{ base: 'center', sm: 'top' }}
        bgRepeat='no-repeat'
        bgSize={{ base: 'cover', sm: 'contain', lg: 'cover' }}
      />
    </Box>
  );
}
