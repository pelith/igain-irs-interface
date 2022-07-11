import React, { ReactElement, useContext } from 'react';
import ActionGuide from './ActionGuide';
import { ReactComponent as IconWrong } from '../../assets/icon-wrong.svg';
import { SelectedChainContext } from '../../context/SelectedChainContext';
import { DEFAULT_CHAIN_ID } from '../../constants/web3ContextConstants';
import useRequestNetworkConfig from '../../hooks/useRequestNetworkConfig';

function WrongNetworkGuide(): ReactElement {
  const { selectChain } = useContext(SelectedChainContext);
  const networkConfig = useRequestNetworkConfig(DEFAULT_CHAIN_ID);
  return (
    <ActionGuide
      Icon={IconWrong}
      description='Switch to correct network '
      buttonContent='CHANGE NETWORK'
      handleChangeNetwork={() => {
        window.ethereum?.request(networkConfig);
        selectChain(DEFAULT_CHAIN_ID);
      }}
    />
  );
}

export default WrongNetworkGuide;
