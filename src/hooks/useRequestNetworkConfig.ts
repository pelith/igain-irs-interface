import { useMemo } from 'react';
import { ChainId } from '../constants';

export default function useRequestNetworkConfig(targetNetwork: ChainId): any {
  const switchMethod = useMemo(() => {
    if (targetNetwork === ChainId.POLYGON) {
      return {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x89',
            chainName: 'Polygon Network',
            nativeCurrency: {
              name: 'Matic',
              symbol: 'Matic',
              decimals: 18,
            },
            rpcUrls: [process.env.REACT_APP_POLYGON_NETWORK_URL],
            blockExplorerUrls: ['https://polygonscan.com/'],
          },
        ],
      };
    } else if (targetNetwork === ChainId.FANTOM) {
      return {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xFA',
            chainName: 'Fantom',
            nativeCurrency: {
              name: 'FTM',
              symbol: 'FTM',
              decimals: 18,
            },
            rpcUrls: [process.env.REACT_APP_FANTOM_NETWORK_URL],
            blockExplorerUrls: ['https://ftmscan.com/'],
          },
        ],
      };
    } else {
      return {
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x1',
          },
        ],
      };
    }
  }, [targetNetwork]);

  return switchMethod;
}
