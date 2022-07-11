import React, { ReactElement, useContext } from 'react';
import { ButtonProps } from '@chakra-ui/react';
import { AuthNetworkCheckButton } from '../components/AuthButton';
import { Web3Context } from '../context/Web3Context';
import { useIsCorrectNetwork } from '../hoc/useIsCorrectNetwork';
import { ChainId } from '../constants';

interface Props extends ButtonProps {
  targetNetwork?: ChainId;
  isOriginText?: boolean;
}

function AuthNetworkCheckButtonContainer({ targetNetwork, isOriginText, ...authButtonProps }: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { account, initConnect } = web3Controller;
  const isCorrectNetwork = useIsCorrectNetwork(targetNetwork);

  return (
    <AuthNetworkCheckButton
      isConnected={!!account}
      targetNetwork={targetNetwork}
      isCorrectNetwork={isCorrectNetwork}
      connectWallet={initConnect}
      isOriginText={isOriginText}
      {...authButtonProps}
    />
  );
}

export default AuthNetworkCheckButtonContainer;
