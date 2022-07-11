import React from 'react';
import { VStack, ListItem, Link } from '@chakra-ui/react';
import { EXTERNAL_LINKS } from '../constants/links';

const YEearnLendContent = () => {
  return (
    <VStack spacing='20px' alignItems='flex-start'>
      {/* <ListItem>
        Watch
        <Link href={EXTERNAL_LINKS.HAKKA_FINANCE_TUTORIAL_VIDEO_PLAY_LIST} isExternal variant='primary'>
          &nbsp;Tutorial Videos
        </Link>
      </ListItem> */}
      <ListItem>
        Read
        <Link href={EXTERNAL_LINKS.IGAIN_IRS_USER_GUIDE_YEARN} isExternal variant='primary'>
          {` User Guide - Yearn `}
        </Link>
        to learn how iGain IRS works
      </ListItem>
      <ListItem>
        Read
        <Link href={EXTERNAL_LINKS.IGAIN_IRS_WHITEPAPER} isExternal variant='primary'>
          {` Whitepaper `}
        </Link>
        to explore the iGain framework deeper
      </ListItem>
      <ListItem>
        Read the
        <Link href={EXTERNAL_LINKS.IGAIN_IRS_ARTICLE_ABOUT_UNDERLYING_TOKEN} isExternal variant='primary'>
          {` Underlying Token `}
        </Link>
        to understand the differences between protocols
      </ListItem>
    </VStack>
  );
};

export default YEearnLendContent;
