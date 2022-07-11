import React from 'react';
import {
  ApprovalInteractionState,
  BlockInteractionState,
  ExtraApprovalInteractionState,
} from '../../constants/blockActionStatus';
import { ConnectWalletCheckWrapperInterface } from '../withConnectWalletCheckWrapper';

export interface DelegationCheckWrapperCheckWrapperInterface extends ConnectWalletCheckWrapperInterface {
  approveToken?: () => void;
  approvalState?: ApprovalInteractionState;
}

export function withDelegationCheckWrapper<T extends DelegationCheckWrapperCheckWrapperInterface>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithTokenApproval = (props: T & DelegationCheckWrapperCheckWrapperInterface) => {
    const { approveToken, onClick, children, disabled, approvalState } = props;
    const isApproved = approvalState === ExtraApprovalInteractionState.APPROVED;
    const isDisabled = isApproved ? disabled : approvalState === BlockInteractionState.PENDING;
    const handleClick = isApproved ? onClick : approveToken;
    const childrenElement = isApproved ? children : 'Approve Delegation';

    const wrappedComponentProps = {
      ...props,
      onClick: handleClick,
      children: childrenElement,
      disabled: isDisabled,
    };

    return <WrappedComponent {...wrappedComponentProps} />;
  };

  ComponentWithTokenApproval.displayName = `WithDelegationApproval(${displayName})`;

  return ComponentWithTokenApproval;
}

export default withDelegationCheckWrapper;
