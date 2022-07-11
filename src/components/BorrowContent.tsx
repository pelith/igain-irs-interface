import React from 'react';
import { VStack, ListItem, Link } from '@chakra-ui/react';
import { EXTERNAL_LINKS } from '../constants/links';

const BorrowContent = () => (
  <VStack spacing='20px' alignItems='flex-start'>
    <ListItem>
      Watch
      <Link href={EXTERNAL_LINKS.HAKKA_FINANCE_BORROWING_TUTORIAL_VIDEO_PLAY_LIST} isExternal variant='primary'>
        &nbsp;Tutorial Videos
      </Link>
    </ListItem>
    <ListItem>
      Read
      <Link href={EXTERNAL_LINKS.IGAIN_IRS_WHITEPAPER} isExternal variant='primary'>
        {` Whitepaper `}
      </Link>
      to comprehensively understand iGain framework
    </ListItem>
    <ListItem>
      Collateral rates on Aave are not fixed. Read
      <Link href={EXTERNAL_LINKS.IGAIN_IRS_ARTICLE_ABOUT_COLLATERAL_RATES_ON_AAVE} isExternal variant='primary'>
        {` Medium `}
      </Link>
      for more details.
    </ListItem>
    <ListItem>
      Forced liquidation should be taken into consideration because of potential margin calls. Read
      <Link href={EXTERNAL_LINKS.IGAIN_IRS_PROXY_WHITEPAPER} isExternal variant='primary'>
        {` Whitepaper `}
      </Link>
      for more details.
    </ListItem>
  </VStack>
);

export default BorrowContent;
