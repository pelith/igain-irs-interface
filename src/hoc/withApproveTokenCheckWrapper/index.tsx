import { ButtonProps } from '@chakra-ui/react';
import React from 'react';
import {
  ApprovalInteractionState,
  BlockInteractionState,
  ExtraApprovalInteractionState,
} from '../../constants/blockActionStatus';
import { ProxyApprovalStatus, PROXY_APPROVAL_KEY_MAPPING } from '../../constants/proxyApprovalStatus';

export interface ApproveTokenCheckWrapperInterface extends ButtonProps {
  approveToken?: () => void;
  approvalState?: ApprovalInteractionState;
  proxyApprovalStatus?: ProxyApprovalStatus;
}

export function withApproveTokenCheckWrapper<T extends ApproveTokenCheckWrapperInterface>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithTokenApproval = (props: T & ApproveTokenCheckWrapperInterface) => {
    const { approveToken, onClick, children, disabled, approvalState, proxyApprovalStatus } = props;
    const isApproved = approvalState === ExtraApprovalInteractionState.APPROVED;
    const isDisabled = isApproved ? disabled : approvalState === BlockInteractionState.PENDING;
    const handleClick = isApproved && !proxyApprovalStatus ? onClick : approveToken;
    const proxyApprovalDisplay = proxyApprovalStatus && PROXY_APPROVAL_KEY_MAPPING[proxyApprovalStatus];
    const childrenElement = proxyApprovalDisplay || (isApproved ? children : 'Unlock Token');
    const wrappedComponentProps = {
      ...props,
      onClick: handleClick,
      children: childrenElement,
      disabled: isDisabled,
    };

    return <WrappedComponent {...wrappedComponentProps} />;
  };

  ComponentWithTokenApproval.displayName = `WithTokenApproval(${displayName})`;

  return ComponentWithTokenApproval;
}

export default withApproveTokenCheckWrapper;
