import { UnorderedList } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import EstimatedApyType from '../constants/termInfo/estimatedApyType';
import ProtocolType from '../constants/termInfo/protocolType';
import BorrowContent from './BorrowContent';
import LendContent from './LendContent';
import YEearnLendContent from './YEarnLendContent';

interface Props {
  estimatedApyType?: EstimatedApyType;
  protocolType?: ProtocolType;
}

function IntroList({ estimatedApyType, protocolType }: Props): ReactElement {
  return (
    <UnorderedList
      pl='10px'
      mt={{ base: '40px', lg: '0' }}
      maxW='275px'
      fontSize='xs'
      fontWeight='bold'
      color='primary.100'
    >
      {estimatedApyType === EstimatedApyType.BORROWING ? (
        <BorrowContent />
      ) : protocolType === ProtocolType.YEARN ? (
        <YEearnLendContent />
      ) : (
        <LendContent />
      )}
    </UnorderedList>
  );
}

export default IntroList;
