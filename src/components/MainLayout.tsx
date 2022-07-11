import { Flex } from '@chakra-ui/react';
import React from 'react';
import MainFooter from './layout/MainFooter';
import MainHeader from './layout/MainHeader';
import LoadingModal from './LoadingModal';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout(props: MainLayoutProps) {
  const { children } = props;
  return (
    <Flex direction='column' minH='100vh'>
      <MainHeader />
      <Flex flex='1' direction='column'>
        {children}
      </Flex>
      <MainFooter />
      <LoadingModal />
    </Flex>
  );
}
