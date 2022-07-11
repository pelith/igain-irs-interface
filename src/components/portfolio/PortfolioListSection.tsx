import React, { ReactElement, useCallback } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { Zero } from '@ethersproject/constants';
import PortfolioTerm from './PortfolioTerm';
import { ArchiveIGainTerm } from '../../constants/termInfo/iGainTermData';
import { UserInfo } from '../../constants/userInfo';
import { AddressMapType } from '../../utils/arrayToAddressMap';
import TermStatus from '../../constants/termInfo/termStatus';
import { formatBigNumberDisplay } from '../../utils';
import StartNewTerm from '../../components/StartNewTerm';
import LoadingSection from '../LoadingSection';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import { ChainId } from '../../constants';
import useTermsStageSeparator from '../../hooks/useTermsStageSeparator';

interface Props {
  userInfoMap: AddressMapType<UserInfo>;
  terms: ArchiveIGainTerm[];
  selectedChain: ChainId;
  onClickRedeem: (contractAddress: string) => void;
}

function PortfolioListSection({ userInfoMap, terms, selectedChain, onClickRedeem }: Props): ReactElement {
  let archivedTerms: ArchiveIGainTerm[] = [];
  const nonArchivedTerms = terms.filter((term) => {
    if (term.archivedTime) {
      archivedTerms.push(term);
      return false;
    }
    if (!userInfoMap[term.address]) {
      return false;
    }
    return true;
  });

  const [expiredTerms, activeTerms] = useTermsStageSeparator(nonArchivedTerms);

  const renderPortfolioTermList = useCallback(
    (passTerms: ArchiveIGainTerm[], termStatus: TermStatus) => {
      return passTerms.map((term) => {
        const userInfo = userInfoMap[term.address];
        const depositLink =
          BASE_TOKEN_DATA?.[term.tradeBaseTokenType]?.depositLinks?.[term?.protocolType]?.[selectedChain];
        const isSettling = termStatus === TermStatus.EXPIRED && term?.canBuy;
        return (
          <PortfolioTerm
            key={term.address}
            contractAddress={term.address}
            baseToken={term.tradeBaseTokenType}
            protocol={term?.protocolType || '-'}
            termStatus={isSettling ? TermStatus.SETTLING : termStatus}
            closeDateTime={(term.closeTime || 0) * 1000}
            archivedTime={term.archivedTime}
            long={formatBigNumberDisplay(userInfo?.longBalance || Zero, term.decimals)}
            short={formatBigNumberDisplay(userInfo?.shortBalance || Zero, term.decimals)}
            lp={formatBigNumberDisplay(userInfo?.lpBalance || Zero, term.decimals)}
            farmLp={formatBigNumberDisplay(userInfo?.farmBalance || Zero, term.decimals)}
            farmContract={userInfo?.farmContract}
            onClickRedeem={onClickRedeem}
            depositLink={depositLink}
          />
        );
      });
    },
    [userInfoMap, onClickRedeem],
  );

  return (
    <Box position='relative'>
      {terms.length > 0 && expiredTerms.length === 0 && activeTerms.length === 0 && archivedTerms.length === 0 && (
        <LoadingSection />
      )}
      {expiredTerms.length > 0 && (
        <Box mb='40px'>
          <Text fontSize='sm' fontWeight='bold' mb='1rem'>{`EXPIRED (${expiredTerms.length})`}</Text>
          <Flex flexWrap='wrap'>{renderPortfolioTermList(expiredTerms, TermStatus.EXPIRED)}</Flex>
        </Box>
      )}
      <Box mb='40px'>
        <Text fontSize='sm' fontWeight='bold' mb='1rem'>{`ACTIVE (${activeTerms.length})`}</Text>
        {activeTerms.length > 0 ? (
          <Flex flexWrap='wrap'>{renderPortfolioTermList(activeTerms, TermStatus.ACTIVE)}</Flex>
        ) : (
          <StartNewTerm />
        )}
      </Box>
      {archivedTerms.length > 0 && (
        <Box mb='40px'>
          <Text fontSize='sm' fontWeight='bold' mb='1rem'>{`ARCHIVED (${archivedTerms.length})`}</Text>
          <Flex flexWrap='wrap'>{renderPortfolioTermList(archivedTerms, TermStatus.ARCHIVED)}</Flex>
        </Box>
      )}
    </Box>
  );
}

export default PortfolioListSection;
