import React, { ReactElement, useContext } from 'react';
import ActionGuide from './ActionGuide';
import { ReactComponent as IconWallet } from '../../assets/icon-wallet.svg';
import { Web3Context } from '../../context/Web3Context';

function ConnectWalletGuide(): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { initConnect } = web3Controller;
  return (
    <ActionGuide
      Icon={IconWallet}
      description='Connect wallet to show your positions of fixed APY'
      buttonContent='CONNECT WALLET'
      handleChangeNetwork={initConnect}
    />
  );
}

export default ConnectWalletGuide;
