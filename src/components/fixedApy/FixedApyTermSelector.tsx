import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Box, Flex, Tabs, TabList, Tab, Text, Center } from '@chakra-ui/react';
import BaseTokenType, { PureBaseTokenTypeKeys } from '../../constants/termInfo/baseTokenType';
import { IGainTerm } from '../../constants/termInfo/iGainTermData';
import { PROTOCOL_DATA } from '../../constants/termInfo/protocolType';
import BASE_TOKEN_DATA from '../../constants/baseTokenConfig';
import ChainSwitch from '../ChainSwitch';
import FixedApyTermItem from './FixedApyTermItem';
import { ReactComponent as IconOops } from '../../assets/icon-oops.svg';
import { formatPercentage, formatZeroOrUndefined } from '../../utils';
import LoadingSection from '../LoadingSection';
import CommonSkeleton from '../common/CommonSkeleton';
import cloneDeep from 'lodash.clonedeep';

interface Props {
  iGainTermsInfo?: IGainTerm[];
  selectedTerm?: IGainTerm;
  fixedApyMap: { [key: string]: number | undefined };
  setSelectedTerm: (term?: IGainTerm) => void;
}

function FixedApyTermSelector({ iGainTermsInfo, selectedTerm, fixedApyMap, setSelectedTerm }: Props): ReactElement {
  const [selectedBaseToken, setSelectedBaseToken] = useState<string>('All');
  let baseTokenArr = cloneDeep(PureBaseTokenTypeKeys);
  baseTokenArr.unshift('All');
  const baseTokenTerms = useMemo(() => {
    const baseTokenList = PureBaseTokenTypeKeys.map((key) => BaseTokenType[key as keyof typeof BaseTokenType]);
    let baseTokenToTerms: { [key: string]: IGainTerm[] | undefined } = {};
    baseTokenList.forEach((baseToken) => {
      const filteredSameBaseTokenTerms = iGainTermsInfo?.filter((term) => {
        return term.tradeBaseTokenType === baseToken;
      });
      baseTokenToTerms[baseToken] = filteredSameBaseTokenTerms;
    });
    return baseTokenToTerms;
  }, [iGainTermsInfo]);

  const termsListForDisplay = useMemo(() => {
    return baseTokenTerms[selectedBaseToken] || iGainTermsInfo;
  }, [selectedBaseToken, iGainTermsInfo]);

  useEffect(() => {
    if (selectedTerm?.tradeBaseTokenType !== selectedBaseToken && selectedBaseToken !== 'All') {
      setSelectedTerm(termsListForDisplay?.[0]);
    }
  }, [selectedBaseToken, termsListForDisplay]);

  return (
    <Flex position='relative' direction='column' h='100%'>
      {termsListForDisplay ? (
        <Box>
          <Flex justify='space-between' w='100%'>
            <Tabs onChange={(index) => setSelectedBaseToken(baseTokenArr[index])} variant='baseTokenFilter'>
              <TabList>
                {baseTokenArr.map((baseToken) => (
                  <Tab key={baseToken}>{baseToken}</Tab>
                ))}
              </TabList>
            </Tabs>
            <ChainSwitch isSimpleMode={true} />
          </Flex>
          <Box mt='0.5rem' flex='1' minH='0' overflow='auto' maxH='20rem'>
            {iGainTermsInfo && termsListForDisplay?.length ? (
              termsListForDisplay.map((term, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedTerm(term)}
                  bg={selectedTerm?.address === term.address ? 'primary.300' : ''}
                  borderRadius='0.5rem'
                  cursor='pointer'
                >
                  <FixedApyTermItem
                    expiryTime={term.closeTime}
                    apy={
                      <CommonSkeleton isLoaded={fixedApyMap?.[term.address] !== undefined}>{`${formatPercentage(
                        formatZeroOrUndefined(fixedApyMap?.[term.address], 2),
                      )}%`}</CommonSkeleton>
                    }
                    protocolName={PROTOCOL_DATA[term.protocolType].name}
                    proxyIcon={PROTOCOL_DATA[term.protocolType].Shape}
                    baseTokenIcon={BASE_TOKEN_DATA[term.tradeBaseTokenType].Icon}
                  />
                </Box>
              ))
            ) : (
              <Center borderRadius='0.5rem' h='20rem'>
                <Box align='center'>
                  <IconOops />
                  <Text pt='12px'>No terms for now</Text>
                </Box>
              </Center>
            )}
          </Box>
        </Box>
      ) : (
        <Box h='120px'>
          <LoadingSection />
        </Box>
      )}
    </Flex>
  );
}

export default FixedApyTermSelector;
