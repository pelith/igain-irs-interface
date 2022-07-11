import { ButtonProps } from '@chakra-ui/react';
import React from 'react';
import useRequestNetworkConfig from '../../hooks/useRequestNetworkConfig';
import { ChainId } from '../../constants';
import { DEFAULT_CHAIN_ID } from '../../constants/web3ContextConstants';

export interface WrongNetworkCheckWrapperInterface extends ButtonProps {
  isCorrectNetwork?: boolean;
  targetNetwork?: ChainId;
  isOriginText?: boolean;
}

export function withWrongNetworkCheckWrapper<T extends WrongNetworkCheckWrapperInterface>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWrongNetworkChecker = (props: T & WrongNetworkCheckWrapperInterface) => {
    const { isCorrectNetwork, targetNetwork, onClick, disabled, children, isOriginText } = props;
    const networkConfig = useRequestNetworkConfig(targetNetwork || DEFAULT_CHAIN_ID);
    const isDisabled = isCorrectNetwork ? disabled : false;
    const handleClick = isCorrectNetwork ? onClick : () => window.ethereum?.request(networkConfig);
    const childrenElement = !isOriginText && !isCorrectNetwork ? 'Change Network' : children;

    const wrappedComponentProps = {
      ...props,
      children: childrenElement,
      disabled: isDisabled,
      onClick: handleClick,
    };

    return <WrappedComponent {...wrappedComponentProps} />;
  };

  ComponentWrongNetworkChecker.displayName = `withWrongNetworkChecker(${displayName})`;

  return ComponentWrongNetworkChecker;
}

export default withWrongNetworkCheckWrapper;
