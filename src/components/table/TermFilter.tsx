import React, { ReactElement } from 'react';
import { Flex, Checkbox, Text, Tabs, TabList, Tab } from '@chakra-ui/react';
import { PureBaseTokenTypeKeys } from '../../constants/termInfo/baseTokenType';
import ChainSwitch from '../ChainSwitch';
import useWindowSize from '../../hooks/useWindowSize';
import { ResponsiveView } from '../../constants/responsive';
import cloneDeep from 'lodash.clonedeep';

interface TermFilterProps {
  setSelectedFilterType: (filterType: string) => void;
  isShowPositionOnly: boolean;
  setIsShowPositionOnly: (input: boolean) => void;
}

function TermFilter({
  setSelectedFilterType,
  isShowPositionOnly,
  setIsShowPositionOnly,
}: TermFilterProps): ReactElement {
  let baseTokenArr = cloneDeep(PureBaseTokenTypeKeys);
  baseTokenArr.unshift('All');
  const windowSize = useWindowSize();
  return (
    <Flex justify='space-between'>
      <Flex justify='space-between' direction={{ base: 'column', lg: 'row' }} w='full' pb='1rem'>
        <Tabs
          onChange={(index) => setSelectedFilterType(baseTokenArr[index])}
          variant='baseTokenFilter'
          mb={{ base: '1rem', lg: '0' }}
        >
          <TabList>
            {baseTokenArr.map((baseToken) => (
              <Tab key={baseToken}>{baseToken}</Tab>
            ))}
          </TabList>
        </Tabs>
        <Checkbox
          onChange={() => setIsShowPositionOnly(!isShowPositionOnly)}
          colorScheme=''
          borderColor='primary.500'
          _hover={{ borderColor: 'primary.100' }}
        >
          <Text color='primary.100'>Show your Position Only</Text>
        </Checkbox>
      </Flex>
      {windowSize === ResponsiveView.MOBILE && <ChainSwitch isSimpleMode={true} />}
    </Flex>
  );
}

export default TermFilter;
