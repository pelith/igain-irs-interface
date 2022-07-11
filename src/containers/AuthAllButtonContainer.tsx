import { ButtonProps } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { AuthAllCheckButton } from '../components/AuthButton';
import { BlockInteractionState, ExtraApprovalInteractionState } from '../constants/blockActionStatus';
import { Web3Context } from '../context/Web3Context';
import { useIsCorrectNetwork } from '../hoc/useIsCorrectNetwork';
import useTokenApprove from '../hooks/useTokenApprove';
import useProxyApprove from '../hooks/useProxyApprove';
import { AAVE_V3_ADDRESS, ChainId } from '../constants';
import { getYvTokenAddressByAddress } from '../constants/termInfo/yvTokenConfig';
import { PARTIAL_TERMS_INFO } from '../constants/termInfo/termConfigData';
import { ProxyApprovalStatus } from '../constants/proxyApprovalStatus';
import ProtocolType from '../constants/termInfo/protocolType';

interface Props extends ButtonProps {
  mainTermAddress: string;
  targetNetwork: ChainId;
  proxyAddress?: string;
  aggregatedProxyAddress?: string;
  tradeTokenAddress?: string;
  isFarming?: boolean;
  tokenAddress: string;
  requiredAllowance: BigNumber;
  protocolType?: ProtocolType;
}

function AuthAllButtonContainer({
  mainTermAddress,
  targetNetwork,
  proxyAddress,
  aggregatedProxyAddress,
  tradeTokenAddress,
  tokenAddress,
  isFarming,
  requiredAllowance,
  disabled,
  children,
  protocolType,
  ...authButtonProps
}: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { account, initConnect } = web3Controller;
  const isCorrectNetwork = useIsCorrectNetwork(targetNetwork);
  const yEarnPositionTokenAddress = getYvTokenAddressByAddress(targetNetwork, tokenAddress) || '';
  const AAVEPoolAddress = protocolType === ProtocolType.AAVE_V3 ? AAVE_V3_ADDRESS[targetNetwork] : '';
  const farmAddress = PARTIAL_TERMS_INFO[targetNetwork]?.[mainTermAddress]?.farmAddress || '';

  const { approve, approvalState } = useTokenApprove(
    tokenAddress,
    proxyAddress || aggregatedProxyAddress || mainTermAddress,
    requiredAllowance,
    web3Controller,
  );

  const { approve: burnTokenApprove, approvalState: burnTokenApprovalState } = useTokenApprove(
    tradeTokenAddress || '',
    aggregatedProxyAddress || '',
    requiredAllowance,
    web3Controller,
  );

  const { proxyApprove: proxyTokenApprove, proxyApprovalState: proxyTokenApprovalState } = useProxyApprove(
    tokenAddress,
    aggregatedProxyAddress,
    protocolType === ProtocolType.AAVE_V3 ? AAVEPoolAddress : yEarnPositionTokenAddress,
    web3Controller,
  );

  const { proxyApprove: proxyPositionApprove, proxyApprovalState: proxyPositionApprovalState } = useProxyApprove(
    protocolType === ProtocolType.AAVE_V3 ? tokenAddress : yEarnPositionTokenAddress,
    aggregatedProxyAddress,
    mainTermAddress,
    web3Controller,
  );

  const { proxyApprove: proxyFarmApprove, proxyApprovalState: proxyFarmApprovalState } = useProxyApprove(
    mainTermAddress,
    aggregatedProxyAddress,
    farmAddress,
    web3Controller,
  );

  const isProxyTokenApproved =
    !aggregatedProxyAddress || proxyTokenApprovalState !== ExtraApprovalInteractionState.NOT_APPROVED;
  const isProxyPositionApproved =
    !aggregatedProxyAddress || proxyPositionApprovalState !== ExtraApprovalInteractionState.NOT_APPROVED;
  const isBurnTokenApproved =
    !tradeTokenAddress || burnTokenApprovalState !== ExtraApprovalInteractionState.NOT_APPROVED;
  const isProxyFarmApproved = !isFarming || proxyFarmApprovalState !== ExtraApprovalInteractionState.NOT_APPROVED;

  let proxyApprovalStatus: ProxyApprovalStatus | undefined;
  if (!aggregatedProxyAddress) {
    proxyApprovalStatus = undefined;
  } else if (!isProxyTokenApproved) {
    proxyApprovalStatus =
      protocolType === ProtocolType.YEARN
        ? ProxyApprovalStatus.BaseTokenApproveYEarnKey
        : ProxyApprovalStatus.BaseTokenApproveAAVEKey;
  } else if (!isProxyPositionApproved) {
    proxyApprovalStatus = ProxyApprovalStatus.PositionApproveKey;
  } else if (!isBurnTokenApproved) {
    proxyApprovalStatus = ProxyApprovalStatus.TradeTokenApproveKey;
  } else if (!isProxyFarmApproved) {
    proxyApprovalStatus = ProxyApprovalStatus.FarmApproveKey;
  }

  const isPending =
    approvalState === BlockInteractionState.PENDING ||
    proxyTokenApprovalState === BlockInteractionState.PENDING ||
    proxyPositionApprovalState === BlockInteractionState.PENDING ||
    burnTokenApprovalState === BlockInteractionState.PENDING;
  const handleApprove = !isProxyTokenApproved
    ? proxyTokenApprove
    : !isProxyPositionApproved
    ? proxyPositionApprove
    : !isBurnTokenApproved
    ? burnTokenApprove
    : !isProxyFarmApproved
    ? proxyFarmApprove
    : approve;
  return (
    <AuthAllCheckButton
      {...authButtonProps}
      disabled={isPending || disabled}
      isConnected={!!account}
      isCorrectNetwork={isCorrectNetwork}
      targetNetwork={targetNetwork}
      connectWallet={initConnect}
      approvalState={approvalState}
      proxyApprovalStatus={proxyApprovalStatus}
      approveToken={handleApprove}
    >
      {(isPending && 'PENDING') || children}
    </AuthAllCheckButton>
  );
}

export default AuthAllButtonContainer;
