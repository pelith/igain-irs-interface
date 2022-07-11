import React from 'react';
import { VStack, ListItem, Link } from '@chakra-ui/react';
import { EXTERNAL_LINKS } from '../constants/links';

const LendContent = () => {
  return (
    <VStack spacing='20px' alignItems='flex-start'>
      <ListItem>
        Watch
        <Link href={EXTERNAL_LINKS.HAKKA_FINANCE_TUTORIAL_VIDEO_PLAY_LIST} isExternal variant='primary'>
          &nbsp;Tutorial Videos
        </Link>
      </ListItem>
      <ListItem>
        Read
        <Link href={EXTERNAL_LINKS.IGAIN_IRS_USER_GUIDE} isExternal variant='primary'>
          {` User Guide - Aave `}
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
      <ListItem>Borrowing APY is the chosen calculation basis on iGain IRS</ListItem>
    </VStack>
  );
};

export default LendContent;
