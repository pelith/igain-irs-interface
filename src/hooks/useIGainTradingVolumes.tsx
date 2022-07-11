import { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import debounce from 'lodash.debounce';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { ChainId, FANTOM_BLOCKS_PER_DAY } from '../constants';
import { SelectedChainContext } from '../context/SelectedChainContext';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';
import { TermConfigType } from '../constants/termInfo/iGainIrsTermConfig';
import { ETH_BLOCKS_PER_DAY, POLYGON_BLOCKS_PER_DAY } from '../constants';
import { id as topicId } from '@ethersproject/hash';
import { YEarnPriceContext } from '../context/YEarnPriceContext';
import ProtocolType from '../constants/termInfo/protocolType';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import { parseUnits } from '@ethersproject/units';

export function useIGainTradingVolumes(
  targetPairsData: IGainIrsTermParams[] | undefined,
  web3Controller: IWeb3Controller,
  expiredTermAddress?: string[],
): BigNumber[] | undefined {
  const { connecting, blockNumber } = web3Controller;
  const { selectedChain } = useContext(SelectedChainContext);
  const yearnTokenPrices = useContext(YEarnPriceContext);
  const [IGainTradingVolume, setTradingVolume] = useState<any[]>();
  const prevChainId = useRef(0);

  const fetchVolumes = async (provider: Provider, terms: TermConfigType[], fromBlock: number) => {
    const swapEvents = await Promise.all(
      terms.map(async (term) => {
        if (expiredTermAddress?.includes(term.contractAddress)) {
          return [];
        }
        const swapTopicName = 'Swap(address,bool,uint256,uint256)';
        const swapHash = topicId(swapTopicName);
        const addLPTopicName = 'AddLP(address,uint256,uint256,uint256)';
        const addLPHash = topicId(addLPTopicName);
        const removeLPTopicName = 'RemoveLP(address,uint256,uint256,uint256)';
        const removeHash = topicId(removeLPTopicName);

        const logs = await provider.getLogs({
          fromBlock: fromBlock > term.deployBlock ? fromBlock : term.deployBlock,
          toBlock: 'latest',
          address: term.contractAddress,
        });
        return logs.filter((log) => [swapHash, addLPHash, removeHash].includes(log.topics[0]));
      }),
    );

    const parsedVolumes = swapEvents.map((singleTermEvents) => {
      return singleTermEvents
        .map((event) => {
          const eventData = event.data
            .substring(2)
            .match(/.{1,64}/g)
            ?.map((data: string) => `0x${data}`);
          return !eventData ? 0 : parseInt(event.topics[1]) ? eventData[0] : eventData[1];
        })
        .reduce((a, c) => a.add(BigNumber.from(c)), Zero);
    });

    return parsedVolumes as BigNumber[];
  };

  const fetchIGainTermsInfo = async (termsData?: IGainIrsTermParams[]) => {
    if (termsData && !connecting && !!termsData.length) {
      if (prevChainId.current && prevChainId.current != selectedChain) {
        setTradingVolume([]);
      }
      prevChainId.current = selectedChain;
      try {
        const fetchPromise = termsData.map(async (termData) => {
          let localProvider;
          if (termData.chainId === ChainId.FORK_MAIN_NET) {
            let providerUrl = process.env.REACT_APP_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else if (termData.chainId === ChainId.POLYGON) {
            let providerUrl = process.env.REACT_APP_POLYGON_ARCHIVE_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else if (termData.chainId === ChainId.FANTOM) {
            let providerUrl = process.env.REACT_APP_FANTOM_ARCHIVE_NETWORK_URL;
            localProvider = new JsonRpcProvider(providerUrl);
          } else {
            return;
          }
          const currentBlock = await localProvider.getBlockNumber();
          const step =
            termData.chainId === ChainId.POLYGON
              ? POLYGON_BLOCKS_PER_DAY
              : termData.chainId === ChainId.FANTOM
              ? FANTOM_BLOCKS_PER_DAY
              : ETH_BLOCKS_PER_DAY;
          const fromBlock =
            termData.chainId === ChainId.FORK_MAIN_NET && process.env.REACT_APP_DEV_START_BLOCK
              ? parseInt(process.env.REACT_APP_DEV_START_BLOCK)
              : currentBlock - step * 7;
          let formatedVolume = await fetchVolumes(localProvider, termData.terms, fromBlock);

          if (termData.protocolType === ProtocolType.YEARN) {
            const decimals = termData?.baseTokenType ? BASE_TOKEN_DATA[termData?.baseTokenType].decimals : 18;
            const multiplier = yearnTokenPrices?.[termData.baseTokenType] || parseUnits('1', decimals);
            formatedVolume = formatedVolume.map((volume) => volume.mul(multiplier).div(parseUnits('1', decimals)));
          }

          return formatedVolume;
        });
        let combinedRoundsData = await Promise.all(fetchPromise);
        setTradingVolume(combinedRoundsData.reduce((acc, val) => (acc ? acc.concat(val || []) : []), []));
      } catch (e) {
        console.log(e);
        console.log('fetch TradingVolume error.');
      }
    }
  };

  const debouncedFetchIGainTermsInfo = useMemo(() => debounce(fetchIGainTermsInfo, 200), [fetchIGainTermsInfo]);
  const isInitSuccessed = !!IGainTradingVolume?.length && blockNumber !== 0;

  useEffect(() => {
    debouncedFetchIGainTermsInfo(targetPairsData);
  }, [targetPairsData, isInitSuccessed, selectedChain]);

  return IGainTradingVolume;
}

export default function useIGainTradingVolume(
  targetTermData: IGainIrsTermParams | undefined,
  web3Controller: IWeb3Controller,
): BigNumber | undefined {
  const memoTargetPairsData = useMemo(() => (targetTermData ? [targetTermData] : undefined), [targetTermData]);
  return useIGainTradingVolumes(memoTargetPairsData, web3Controller)?.[0];
}
