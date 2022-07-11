import React, { ReactElement } from 'react';
import { Tab, TabList } from '@chakra-ui/react';

function FixApyTabs(): ReactElement {
  return (
    <TabList justifyContent={{ base: 'space-evenly', lg: 'flex-start' }}>
      <Tab>Lending</Tab>
      <Tab>Borrowing</Tab>
    </TabList>
  );
}

export default FixApyTabs;
