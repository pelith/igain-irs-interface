import debounce from 'lodash.debounce';
import { useContext, useEffect, useState } from 'react';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import {
  AAVE_V3_ADDRESS,
  AAVE_UI_POOL_PROVIDER,
  AAVE_POOL_ADDRESS_PROVIDER,
  ChainId,
  DEV_MULTICALL_CHAIN_ID,
} from '../constants';
import AAVE_V3_ABI from '../constants/abis/AaveV3IPool.json';
import UI_PROVIDER_AAVE_V3_ABI from '../constants/abis/UiPoolProviderV3.json';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { Web3Context } from '../context/Web3Context';

export default function useAaveEmodeInfo(): any {
  const { selectedChain } = useContext(SelectedChainContext);
  const web3Controller = useContext(Web3Context);
  const { web3Provider, account, chainId, connecting } = web3Controller;
  const [userEMode, setUserEMode] = useState(0);
  const [reservesEmodeInfo, setReservesEmodeInfo] = useState({});

  const fetchMultiCall = async (ethcallProvider: MulticallProvider) => {
    if (!AAVE_V3_ADDRESS[selectedChain] || !AAVE_UI_POOL_PROVIDER[selectedChain]) {
      return;
    }
    const aaveContract = new MulticallContract(AAVE_V3_ADDRESS[selectedChain], AAVE_V3_ABI);
    const aaveV3UiProvider = new MulticallContract(AAVE_UI_POOL_PROVIDER[selectedChain], UI_PROVIDER_AAVE_V3_ABI);
    try {
      const [fetchedUserEMode, aaveReservesData] = await ethcallProvider.all([
        aaveContract.getUserEMode(account),
        aaveV3UiProvider.getReservesData(AAVE_POOL_ADDRESS_PROVIDER[selectedChain]),
      ]);
      setUserEMode(parseInt(fetchedUserEMode.toString()));
      const parsedReservesEmodeInfo: {
        [key: string]: number;
      } = {};
      aaveReservesData[0].forEach((reserveInfo: any) => {
        if (reserveInfo[0]) {
          parsedReservesEmodeInfo[reserveInfo[0]] = reserveInfo.eModeCategoryId;
        }
      });
      setReservesEmodeInfo(parsedReservesEmodeInfo);
    } catch (e) {
      console.log(e);
      console.log('fetch emode failed');
    }
  };

  const fetchEModeInfo = async () => {
    if (!connecting && web3Provider) {
      try {
        const multicallChainId =
          selectedChain === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : selectedChain;
        const ethcallProvider = new MulticallProvider(web3Provider, multicallChainId);

        fetchMultiCall(ethcallProvider);
      } catch (e) {
        console.log(e);
        console.log('fetch emode info error.');
      }
    }
  };

  const debouncedFetchEModeInfo = () => debounce(fetchEModeInfo, 200)();

  useEffect(() => {
    if (chainId === selectedChain) {
      debouncedFetchEModeInfo();
    }
  }, [chainId, selectedChain, connecting]);

  return { userEMode, reservesEmodeInfo };
}
