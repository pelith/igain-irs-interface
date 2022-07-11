import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { IChainData } from '../constants/types';
import supportedChains from '../constants/chains';
import ProtocolType from '../constants/termInfo/protocolType';
import IGAIN_AAVE_IRS from '../constants/abis/IGainAAVEIRS.json';
import IGAIN_YEARN_IRS from '../constants/abis/IGainYearnIRS.json';
import { ChainId } from '../constants';

export function getTargetAbi(protocolType: ProtocolType) {
  if (protocolType !== ProtocolType.YEARN) {
    return IGAIN_AAVE_IRS;
  }
  return IGAIN_YEARN_IRS;
}

export function getChainData(chainId: ChainId): IChainData {
  const chainData = supportedChains[chainId];

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%API_KEY%') && API_KEY) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function isValidAddress(value: any): boolean {
  try {
    return getAddress(value) ? getAddress(value) !== AddressZero : false;
  } catch {
    return false;
  }
}

export const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.POLYGON]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FORK_MAIN_NET]: '',
};

export function getEtherscanLink(chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address'): string {
  const prefix =
    chainId === ChainId.POLYGON
      ? 'https://polygonscan.com'
      : chainId === ChainId.FANTOM
      ? 'https://ftmscan.com'
      : `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[ChainId.MAINNET]}etherscan.io`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function shortenTxId(address: string, chars = 6): string {
  return `${address.substring(0, chars + 2)}...${address.substring(64 - chars)}`;
}
