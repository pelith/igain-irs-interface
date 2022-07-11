import React from 'react';
import { ButtonProps } from '@chakra-ui/react';

export interface ConnectWalletCheckWrapperInterface extends ButtonProps {
  isConnected?: boolean;
  connectWallet?: () => void;
  isOriginText?: boolean;
}

export function withConnectWalletCheckWrapper<T extends ConnectWalletCheckWrapperInterface>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithConnectWallet = (props: T & ConnectWalletCheckWrapperInterface) => {
    const { isConnected, connectWallet, onClick, children, disabled, isOriginText } = props;

    const isDisabled = isConnected && disabled;
    const handleClick = isConnected ? onClick : connectWallet;
    const childrenElement = !isOriginText && !isConnected ? 'Connect Wallet' : children;

    const wrappedComponentProps = {
      ...props,
      onClick: handleClick,
      children: childrenElement,
      disabled: isDisabled,
    };

    return <WrappedComponent {...wrappedComponentProps} />;
  };

  ComponentWithConnectWallet.displayName = `withConnectWallet(${displayName})`;

  return ComponentWithConnectWallet;
}

export default withConnectWalletCheckWrapper;
