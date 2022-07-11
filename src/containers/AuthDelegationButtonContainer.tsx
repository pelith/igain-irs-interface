import { ButtonProps } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { AuthDelegationCheckButton } from '../components/AuthButton';
import { BlockInteractionState, ExtraApprovalInteractionState } from '../constants/blockActionStatus';
import { Web3Context } from '../context/Web3Context';
import { useIsCorrectNetwork } from '../hoc/useIsCorrectNetwork';
import useTokenDelegateApprove from '../hooks/useTokenDelegateApprove';
import { ChainId } from '../constants';
import AuthAllButtonContainer from './AuthAllButtonContainer';
import ProtocolType from '../constants/termInfo/protocolType';

interface Props extends ButtonProps {
  mainTermAddress: string;
  targetNetwork: ChainId;
  proxyAddress?: string;
  aggregatedProxyAddress?: string;
  tokenAddress: string;
  requiredAllowance: BigNumber;
  protocolType?: ProtocolType;
}

function AuthDelegationButtonContainer({
  protocolType,
  mainTermAddress,
  targetNetwork,
  proxyAddress,
  aggregatedProxyAddress,
  tokenAddress,
  requiredAllowance,
  disabled,
  children,
  ...authButtonProps
}: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { account, initConnect } = web3Controller;
  const isCorrectNetwork = useIsCorrectNetwork(targetNetwork);
  const { approveDelegation, delegationApprovalState } = useTokenDelegateApprove(
    tokenAddress,
    proxyAddress || mainTermAddress,
    requiredAllowance,
    web3Controller,
  );
  const isPending = delegationApprovalState === BlockInteractionState.PENDING;
  const handleApprove = approveDelegation;

  const isApproved = delegationApprovalState === ExtraApprovalInteractionState.APPROVED;

  if (aggregatedProxyAddress && isApproved) {
    return (
      <AuthAllButtonContainer
        {...authButtonProps}
        protocolType={protocolType}
        mainTermAddress={mainTermAddress}
        aggregatedProxyAddress={aggregatedProxyAddress}
        targetNetwork={targetNetwork}
        tokenAddress={''}
        requiredAllowance={requiredAllowance}
        disabled={disabled}
      >
        {children}
      </AuthAllButtonContainer>
    );
  }

  return (
    <AuthDelegationCheckButton
      {...authButtonProps}
      disabled={isPending || disabled}
      isConnected={!!account}
      isCorrectNetwork={isCorrectNetwork}
      targetNetwork={targetNetwork}
      connectWallet={initConnect}
      approvalState={delegationApprovalState}
      approveToken={handleApprove}
    >
      {(isPending && 'PENDING') || children}
    </AuthDelegationCheckButton>
  );
}

export default AuthDelegationButtonContainer;
