import React, { ReactElement, useContext, useEffect } from 'react';
import { Flex, Text, HStack } from '@chakra-ui/react';
import { Web3Context } from '../context/Web3Context';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { ChainId, CHAIN_DISPLAY_INFO, SWITCH_CHAIN_LIST } from '../constants';
import useRequestNetworkConfig from '../hooks/useRequestNetworkConfig';

const chainBtnStyle = {
  padding: '8px',
  borderRadius: '8px',
  cursor: 'pointer',
  maxHeight: '36px',
};

interface ChainSwitchBtnProps {
  chain: ChainId;
  selectedChain: ChainId;
  onSwitch: () => void;
  isSimpleMode: boolean;
}

function ChainSwitchBtn({ chain, selectedChain, onSwitch, isSimpleMode }: ChainSwitchBtnProps): ReactElement {
  const Logo = CHAIN_DISPLAY_INFO[chain].logo;
  return (
    <Flex
      onClick={onSwitch}
      bgGradient={selectedChain === chain ? CHAIN_DISPLAY_INFO[chain].bg : ''}
      style={chainBtnStyle}
    >
      <HStack spacing='6px'>
        {Logo && <Logo width='20px' height='20px' />}
        {!isSimpleMode && <Text>{CHAIN_DISPLAY_INFO[chain].displayName}</Text>}
      </HStack>
    </Flex>
  );
}
interface Props {
  isSimpleMode: boolean;
  disableTriggerWallet?: boolean;
}

function ChainSwitch({ isSimpleMode, disableTriggerWallet = false }: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { selectedChain, selectChain } = useContext(SelectedChainContext);
  const { chainId } = web3Controller;
  const networkConfig = useRequestNetworkConfig(selectedChain);

  useEffect(() => {
    if (chainId && chainId !== selectedChain && !disableTriggerWallet) {
      window.ethereum?.request(networkConfig);
    }
  }, [selectedChain]);
  return (
    <Flex>
      {SWITCH_CHAIN_LIST.map((chain) => {
        return (
          <ChainSwitchBtn
            key={chain}
            chain={chain}
            selectedChain={selectedChain}
            onSwitch={() => {
              selectChain(chain);
            }}
            isSimpleMode={isSimpleMode}
          />
        );
      })}
    </Flex>
  );
}

export default ChainSwitch;
