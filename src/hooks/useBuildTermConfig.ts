import { useContext, useEffect, useMemo, useState } from 'react';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import debounce from 'lodash.debounce';

import { ChainId, DEV_MULTICALL_CHAIN_ID } from '../constants';
import { IGAIN_FACTORY, IGAIN_AGGREGATE_PROXY } from '../constants/termInfo/termAggregatedContractsConfig';
import FACTORY_ABI from '../constants/abis/IGainFactory.json';
import TERM_BASE_ABI from '../constants/abis/IGainBase.json';
import { Web3Context } from '../context/Web3Context';
import ProtocolType from '../constants/termInfo/protocolType';
import { ContractCall } from '@pelith/ethers-multicall/dist/types';
import flatten from 'lodash.flatten';
import chunk from 'lodash.chunk';
import { BaseTermInfoMap, FactoryLengthMap } from '../constants/termInfo/buildTermConfigTypes';
import mergeTermsInfo from '../utils/mergeTermsInfo';
import { TermsConfigMapType } from '../constants/termInfo/termConfigData';
import { isValidAddress } from '../utils/web3Utils';

export default function useBuildTermConfig(chainId: ChainId) {
  const web3Controller = useContext(Web3Context);
  const { connecting } = web3Controller;
  const [iGainConfig, setIGainConfig] = useState<TermsConfigMapType>();

  const factoryProtocolMap = IGAIN_FACTORY[chainId] || {};
  const proxyProtocolMap = IGAIN_AGGREGATE_PROXY[chainId];

  const fetchMultiCallAndBuildData = async (ethcallProvider: MulticallProvider, currentBlock: number) => {
    const igainFactoryAbi = FACTORY_ABI;
    const protocolKeys = Object.keys(factoryProtocolMap);
    const factoryLengthMap: FactoryLengthMap = {
      [ProtocolType.AAVE_V3]: 0,
      [ProtocolType.YEARN]: 0,
    };
    const baseTermInfoMap: BaseTermInfoMap = {};

    const factoryLengthCalls = protocolKeys.map((key) => {
      const factoryAddress = factoryProtocolMap[key as ProtocolType];
      const igainFactoryContract = new MulticallContract(factoryAddress || undefined, igainFactoryAbi);
      return igainFactoryContract.getNumberOfIGains();
    });

    const termLengthData = await ethcallProvider.all(factoryLengthCalls);

    termLengthData.forEach((data, index) => {
      factoryLengthMap[protocolKeys[index] as ProtocolType] = data ? data.toNumber() : 0;
    });

    const factoryListCalls = protocolKeys.map((key) => {
      const factoryAddress = factoryProtocolMap[key as ProtocolType];
      const igainFactoryContract = new MulticallContract(factoryAddress || undefined, igainFactoryAbi);
      const contractCallList: ContractCall[] = [];
      for (let i = 0; i < (factoryLengthMap[key as ProtocolType] || 0); i++) {
        contractCallList.push(igainFactoryContract.terms(i));
      }
      return contractCallList;
    });

    const termAddressData = await ethcallProvider.all(flatten(factoryListCalls) as any[]);

    const addressList = termAddressData.slice();
    protocolKeys.forEach((key) => {
      const protocolAddressList = addressList.splice(0, factoryLengthMap[key as ProtocolType]);
      protocolAddressList.forEach((address) => {
        baseTermInfoMap[address] = {
          protocolType: key as ProtocolType,
          aggregatedProxy: proxyProtocolMap?.[key as ProtocolType],
        };
      });
    });

    const termInfoCalls = termAddressData.map((address) => {
      const igainContract = new MulticallContract(address, TERM_BASE_ABI);
      return [igainContract.a(), igainContract.b(), igainContract.baseToken()];
    });

    const termInfoData = chunk(await ethcallProvider.all(flatten(termInfoCalls) as any[]), 3);
    termInfoData.map((baseInfoArray, index) => {
      const [shortTokenAddress, longTokenAddress, baseTokenAddress] = baseInfoArray;
      const termAddress = termAddressData[index];
      baseTermInfoMap[termAddress] = {
        ...baseTermInfoMap[termAddress],
        shortTokenAddress: isValidAddress(shortTokenAddress) ? shortTokenAddress : undefined,
        longTokenAddress: isValidAddress(longTokenAddress) ? longTokenAddress : undefined,
        baseTokenAddress,
      };
    });
    setIGainConfig(mergeTermsInfo(baseTermInfoMap, chainId, currentBlock));
  };

  const fetchIGainBaseInfo = async () => {
    if (!connecting) {
      try {
        let localProvider;
        if (chainId === ChainId.FORK_MAIN_NET) {
          let providerUrl = process.env.REACT_APP_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (chainId === ChainId.POLYGON) {
          let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (chainId === ChainId.FANTOM) {
          let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else {
          return;
        }
        const currentBlock = await localProvider.getBlockNumber();
        const multicallChainId =
          chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : chainId;
        const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
        fetchMultiCallAndBuildData(ethcallProvider, currentBlock);
      } catch (e) {
        console.log(e);
        console.log('fetch igain base info error.');
      }
    }
  };

  const debouncedFetchIGainBaseInfo = useMemo(() => debounce(fetchIGainBaseInfo, 200), [fetchIGainBaseInfo]);

  useEffect(() => {
    debouncedFetchIGainBaseInfo();
  }, [chainId, connecting]);

  return iGainConfig;
}
