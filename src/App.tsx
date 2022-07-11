import React from 'react';
import Web3ContextProvider from './context/Web3Context';
import TermsContextProvider from './context/TermsContext';
import SlippageToleranceContextProvider from './context/SlippageToleranceContext';
import SelectedChainContextProvider from './context/SelectedChainContext';
import LoadingModalContextProvider from './context/LoadingModalContext';
import TagManagerContextProvider from './context/TagManagerContextProvider';
import ThemeProvider from './themes';
import CoreApp from './CoreApp';
import YEarnPriceContextProvider from './context/YEarnPriceContext';
import TermFactoryContextProvider from './context/TermFactoryContext';

export default function App() {
  return (
    <ThemeProvider>
      <SelectedChainContextProvider>
        <Web3ContextProvider>
          <YEarnPriceContextProvider>
            <TermFactoryContextProvider>
              <TermsContextProvider>
                <SlippageToleranceContextProvider>
                  <LoadingModalContextProvider>
                    <TagManagerContextProvider>
                      <CoreApp />
                    </TagManagerContextProvider>
                  </LoadingModalContextProvider>
                </SlippageToleranceContextProvider>
              </TermsContextProvider>
            </TermFactoryContextProvider>
          </YEarnPriceContextProvider>
        </Web3ContextProvider>
      </SelectedChainContextProvider>
    </ThemeProvider>
  );
}
