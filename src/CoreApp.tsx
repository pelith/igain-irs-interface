import React from 'react';
import useNotifyExpiredTerm from './hooks/useNotifyExpiredTerm';
import Router from './Router';

const CoreApp = () => {
  useNotifyExpiredTerm();
  return <Router />;
};

export default CoreApp;
