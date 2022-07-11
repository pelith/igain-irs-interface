import { useContext, useEffect, useState } from 'react';
import { ChainId } from '../constants';
import { Web3Context } from '../context/Web3Context';

export function useIsCorrectNetwork(targetNetwork?: ChainId): boolean {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const web3Controller = useContext(Web3Context);
  const { chainId } = web3Controller;

  useEffect(() => {
    if (chainId) {
      const isRightChain = chainId === targetNetwork;
      setIsCorrectNetwork(!!isRightChain);
      return;
    }
    setIsCorrectNetwork(false);
  }, [chainId]);
  return isCorrectNetwork;
}
