import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import PageFrame from '../../components/common/PageFrame';
import FixApyTabs from '../../components/fixedApy/FixApyTabs';
import FixApyLendContainer from '../FixApyLendContainer';
import FixApyBorrowContainer from '../FixApyBorrowContainer';
import EstimatedApyType from '../../constants/termInfo/estimatedApyType';
import AaveEModeContextProvider from '../../context/AaveEmodeContext';

const BORROWING_TAB = EstimatedApyType.BORROWING.toLowerCase();

function FixedApyPanelPage(): ReactElement {
  const [selectedTab, setSelectedTab] = useState(0);
  const { search } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    if (searchParams.get('tab')?.toLowerCase() === BORROWING_TAB) {
      setSelectedTab(1);
    }
  }, [search]);

  const onChangeTab = useCallback(
    (tabIndex) => {
      setSelectedTab(tabIndex);
    },
    [setSelectedTab],
  );

  return (
    <AaveEModeContextProvider>
      <PageFrame>
        <Tabs
          variant='mainTab'
          flex='1'
          display='flex'
          flexDirection='column'
          onChange={onChangeTab}
          index={selectedTab}
        >
          <FixApyTabs />
          <TabPanels flex='1' display='flex' flexDirection='column'>
            <TabPanel flex='1' display='flex' flexDirection='column' p='0'>
              <FixApyLendContainer />
            </TabPanel>
            <TabPanel flex='1' display='flex' flexDirection='column' p='0'>
              <FixApyBorrowContainer />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </PageFrame>
    </AaveEModeContextProvider>
  );
}

export default FixedApyPanelPage;
