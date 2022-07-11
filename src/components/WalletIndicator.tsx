import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Box, Button, chakra, Flex, HStack, Text } from '@chakra-ui/react';
import UAuth from '@uauth/js';
import { ReactComponent as WrongChainIcon } from '../assets/netIcons/icon-chain-alarm.svg';
import { Web3Context } from '../context/Web3Context';
import { shortenAddress } from '../utils/web3Utils';
import { CHAIN_DISPLAY_INFO } from '../constants';
import { uauthOptions } from '../utils/getProviderOptions';

const WalletIndicator: React.FC = () => {
  const web3Controller = useContext(Web3Context);
  const { connected, account, initConnect, resetApp, web3Provider, chainId } = web3Controller;
  const [ensName, setEnsName] = useState('');
  useEffect(() => {
    setEnsName('');
    if (web3Provider && account) {
      if (chainId === 1) {
        web3Provider.lookupAddress(account).then((ens) => setEnsName(ens || ''));
      }
      new UAuth(uauthOptions)
        .user()
        .then((user) => {
          setEnsName(user.sub);
        })
        .catch(() => {});
    }
  }, [web3Provider, chainId, account]);

  const renderChainInfo = useMemo(() => {
    const chainInfo = CHAIN_DISPLAY_INFO[chainId];
    const ChainLogo = chainInfo ? chainInfo.logo : WrongChainIcon;
    return (
      <HStack spacing='0.5rem' px={{ base: '0.5rem', lg: '1rem' }}>
        {ChainLogo && <ChainLogo fontSize='xl' />}
      </HStack>
    );
  }, [chainId]);

  return (
    <Box>
      {connected ? (
        <Flex>
          {renderChainInfo}
          <Button
            onClick={resetApp}
            bg='primary.500'
            _hover={{ bg: 'primary.300' }}
            _active={{ bg: 'primary.500', mt: '3px' }}
          >
            <chakra.div w='0.5rem' h='0.5rem' mr='0.75rem' borderRadius='50%' bg='success' />
            <Text fontWeight='bold' lineHeight='20px' fontSize='sm'>
              {ensName || (account && shortenAddress(account))}
            </Text>
          </Button>
        </Flex>
      ) : (
        <Button variant='primary' maxH='2.5rem' onClick={initConnect}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default WalletIndicator;
