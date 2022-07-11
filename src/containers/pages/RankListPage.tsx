import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import RankingTableContainer from '../RankingTableContainer';
import { BackLink } from '../../components/BackLink';
import PageFrame from '../../components/common/PageFrame';
import { INTERNAL_PATH } from '../../constants/links';

function RankListPage(): ReactElement {
  return (
    <PageFrame>
      <Box pt='24px' pb='80px' px={{ base: '1rem', lg: '100px' }}>
        <Box display='inline-block' mb='1rem'>
          <BackLink path={INTERNAL_PATH.PORTFOLIO} />
        </Box>
        <Stack spacing={{ base: '2.5rem', lg: '5.75rem' }} direction={{ base: 'column', lg: 'row' }}>
          <Box flex={1} maxH='calc(100vh - 1rem)' position={{ base: 'initial', lg: 'sticky' }} top='1rem'>
            <Heading mb={{ base: '0.5rem', lg: '1rem' }} fontWeight='bold' fontSize={{ base: '2xl', lg: '4xl' }}>
              Referral
              <br />
              Ranking
            </Heading>
            <Text color='primary.100' fontSize='sm'>
              Top 10 wallet addresses with the highest trading volume (buy Short tokens on fixed APY page) Ranking
              updated every 6 hours.
            </Text>
          </Box>
          <Flex direction='column' align='flex-start' flex={2}>
            <RankingTableContainer />
          </Flex>
        </Stack>
      </Box>
    </PageFrame>
  );
}
export default RankListPage;
