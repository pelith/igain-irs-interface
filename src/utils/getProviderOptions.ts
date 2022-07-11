import WalletConnectProvider from '@walletconnect/web3-provider';
import * as UAuthWeb3Modal from '@uauth/web3modal';
import UAuthSPA from '@uauth/js';
import WalletconnectLogo from '../assets/icon-walletconnect.svg';
import ImTokenLogo from '../assets/icon-imToken.svg';
import MetamaskLogo from '../assets/icon-metamask.svg';
import { ChainId } from '../constants';
import { IUAuthOptions } from '@uauth/web3modal';

export const uauthOptions: IUAuthOptions = {
  clientID: process.env.REACT_APP_UAUTH_CLIENT_ID || 'client_id',
  redirectUri: process.env.REACT_APP_ENV === 'production' ? 'https://igain.finance' : 'http://localhost:3000',
  scope: 'openid wallet',
};

function getProviderOptions(selectedChain: ChainId) {
  const providerOptions = {
    injected: {
      display: {
        logo: window?.ethereum?.isImToken ? ImTokenLogo : MetamaskLogo,
        name: window?.ethereum?.isImToken ? 'imToken' : 'MetaMask',
        description: `Connect to your ${window?.ethereum?.isImToken ? 'imToken' : 'MetaMask'} Wallet`,
      },
      package: null,
    },
    'custom-walletconnect': {
      package: WalletConnectProvider,
      display: {
        logo: WalletconnectLogo,
        name: 'WalletConnect',
        description: 'Scan with WalletConnect to connect',
      },
      options: {
        chainId: selectedChain,
        rpc: {
          [ChainId.MAINNET]: process.env.REACT_APP_NETWORK_URL,
          [ChainId.POLYGON]: process.env.REACT_APP_POLYGON_NETWORK_URL,
          [ChainId.FANTOM]: process.env.REACT_APP_FANTOM_NETWORK_URL,
        },
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
        pollingInterval: 15000,
      },
      connector: async (ProviderPackage: any, options: any) => {
        const provider = new ProviderPackage(options);
        await provider.enable();
        return provider;
      },
    },
    'custom-uauth': {
      display: UAuthWeb3Modal.display,
      connector: UAuthWeb3Modal.connector,
      package: UAuthSPA,
      options: uauthOptions,
    },
  };

  return providerOptions;
}

export default getProviderOptions;
