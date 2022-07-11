import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { INTERNAL_PATH } from './constants/links';
import TradingBoard from './containers/pages/TradingBoard';
import PoolBoard from './containers/pages/PoolBoard';
import PortfolioPage from './containers/pages/PortfolioPage';
import FixedApyPanelPage from './containers/pages/FixedApyPanelPage';
import { ToastContainer } from 'react-toastify';
import './themes/ReactToastify.css';
import ScrollToTop from './ScrollToTop';
import RankListPage from './containers/pages/RankListPage';

const Landing = lazy(() => import('./containers/pages/Landing'));
const PoolDetailPage = lazy(() => import('./containers/pages/PoolDetailPage'));
const TradeTermDetailPage = lazy(() => import('./containers/pages/TradeTermDetailPage'));
const PageNotFound = lazy(() => import('./containers/pages/PageNotFound'));

export default function Router() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <MainLayout>
          <ToastContainer
            style={{ width: '400px' }}
            enableMultiContainer
            position='bottom-left'
            hideProgressBar={false}
            newestOnTop={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <ScrollToTop />
          <Switch>
            <Route path={`${INTERNAL_PATH.TRADE_DETAIL}/:contractId`}>
              <TradeTermDetailPage />
            </Route>
            <Route path={`${INTERNAL_PATH.POOL_DETAIL}/:contractId`}>
              <PoolDetailPage />
            </Route>
            <Route exact path='/'>
              <Landing />
            </Route>
            <Route exact path={INTERNAL_PATH.TRADE}>
              <TradingBoard />
            </Route>
            <Route exact path={INTERNAL_PATH.POOL}>
              <PoolBoard />
            </Route>
            <Route path={INTERNAL_PATH.PORTFOLIO}>
              <Switch>
                <Route exact path={INTERNAL_PATH.PORTFOLIO}>
                  <PortfolioPage />
                </Route>
                <Route path={INTERNAL_PATH.RANKING}>
                  <RankListPage />
                </Route>
                <Redirect to={INTERNAL_PATH.PORTFOLIO} />
              </Switch>
            </Route>
            <Route exact path={INTERNAL_PATH.FIX_INTEREST}>
              <FixedApyPanelPage />
            </Route>
            <Route path='*' exact={true} component={PageNotFound} />
          </Switch>
        </MainLayout>
      </BrowserRouter>
    </Suspense>
  );
}
