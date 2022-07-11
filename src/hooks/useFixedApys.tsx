import { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import flatten from 'lodash.flatten';
import chunk from 'lodash.chunk';
import debounce from 'lodash.debounce';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Zero } from '@ethersproject/constants';
import { ChainId, AAVE_ADDRESS, DEV_MULTICALL_CHAIN_ID, AAVE_V3_ADDRESS } from '../constants';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';
import ProtocolType from '../constants/termInfo/protocolType';
import { getTargetAbi } from '../utils/web3Utils';
import { BigNumber } from '@ethersproject/bignumber';
import { IGAIN_POSITION } from '../constants/termInfo/positionTokenData';
import AAVE from '../constants/abis/AAVE.json';
import YEARN from '../constants/abis/Yearn.json';
import { calcRatioApy, calcLendFixedApy } from '../utils/contractCalc';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { SelectedChainContext } from '../context/SelectedChainContext';
import EstimatedApyType from '../constants/termInfo/estimatedApyType';
import { getYvTokenAddressByType } from '../constants/termInfo/yvTokenConfig';
import { checkTermExpired } from '../utils/checkTermExpired';

const useFixedApy = (
  targetTermsParam: IGainIrsTermParams | undefined,
  longPrice: BigNumber | undefined,
  web3Controller: IWeb3Controller,
  apyType = EstimatedApyType.BORROWING,
): number | undefined => {
  const { blockNumber, connecting } = web3Controller;
  const { selectedChain } = useContext(SelectedChainContext);
  const [IGainFixedApy, setFixedApy] = useState<number>();

  const fetchMultiCall = async (ethcallProvider: MulticallProvider, termParamData: IGainIrsTermParams) => {
    const igainAbi = getTargetAbi(termParamData.protocolType);
    const terms = termParamData.terms;
    const termCalls = terms.map((term) => {
      const igainContract = new MulticallContract(term.contractAddress, igainAbi);
      const aaveContract = new MulticallContract(
        termParamData.protocolType === ProtocolType.AAVE ? AAVE_ADDRESS[selectedChain] : AAVE_V3_ADDRESS[selectedChain],
        AAVE,
      );
      const yearnContract = new MulticallContract(
        IGAIN_POSITION[selectedChain][ProtocolType.YEARN][termParamData.baseTokenType]?.address,
        YEARN,
      );
      const rateResult =
        termParamData.protocolType === ProtocolType.YEARN
          ? yearnContract.pricePerShare()
          : aaveContract.getReserveNormalizedVariableDebt(termParamData.baseTokenAddress);

      return [
        rateResult,
        igainContract.initialRate(),
        igainContract.leverage(),
        igainContract.closeTime(),
        igainContract.decimals(),
      ];
    });
    const flattenCalls = flatten(termCalls);
    const termsData = chunk(await ethcallProvider.all(flattenCalls), 5);
    return termsData;
  };

  const calcApyWithParams = async (termParamsData?: IGainIrsTermParams) => {
    if (termParamsData && !connecting) {
      try {
        let localProvider;
        if (termParamsData.chainId === ChainId.FORK_MAIN_NET) {
          let providerUrl = process.env.REACT_APP_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (termParamsData.chainId === ChainId.POLYGON) {
          let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (termParamsData.chainId === ChainId.FANTOM) {
          let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else {
          return;
        }
        const multicallChainId =
          termParamsData.chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID
            ? DEV_MULTICALL_CHAIN_ID
            : termParamsData.chainId;
        const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
        const termsData = await fetchMultiCall(ethcallProvider, termParamsData);
        const data = termsData[0];
        const [nowRate, initialRate, leverage, closeTime, decimals] = data;
        if (process.env.REACT_APP_ENV === 'development') {
          console.log('nowRateFixedApy:', nowRate.toString());
        }
        let apy = calcRatioApy(nowRate, initialRate, leverage, parseInt(closeTime), longPrice || Zero, decimals);
        if (apyType === EstimatedApyType.LENDING && termParamsData.protocolType === ProtocolType.AAVE) {
          apy = calcLendFixedApy(apy / 100, termParamsData.baseTokenType);
        }
        setFixedApy(apy);
      } catch (e) {
        console.log(e);
        console.log('fetch apy error.');
      }
    } else {
      setFixedApy(0);
    }
  };

  const debouncedCalcApyWithParams = useMemo(() => debounce(calcApyWithParams, 200), [calcApyWithParams]);

  useEffect(() => {
    if (longPrice) {
      debouncedCalcApyWithParams(targetTermsParam);
    }
  }, [blockNumber, targetTermsParam, longPrice]);

  return IGainFixedApy;
};

const useFixedApyListWithTerms = (
  iGainTerms: IGainTerm[] | undefined,
  longPrices: BigNumber[] | undefined,
  web3Controller: IWeb3Controller,
  chainId: ChainId,
  apyType = EstimatedApyType.BORROWING,
): number[] | undefined => {
  const { blockNumber, connecting } = web3Controller;
  const prevChainId = useRef(chainId);
  const [IGainFixedApyList, setFixedApyList] = useState<number[]>();

  const fetchMultiCall = async (ethcallProvider: MulticallProvider, termDataList: IGainTerm[]) => {
    const callList = termDataList.map((termData) => {
      if (checkTermExpired(termData)) {
        return new MulticallContract(undefined, YEARN).pricePerShare();
      }

      const aaveContract = new MulticallContract(
        termData.protocolType === ProtocolType.AAVE ? AAVE_ADDRESS[chainId] : AAVE_V3_ADDRESS[chainId],
        AAVE,
      );
      const yearnContract = new MulticallContract(getYvTokenAddressByType(chainId, termData.tradeBaseTokenType), YEARN);
      const rateResultCall =
        termData.protocolType === ProtocolType.YEARN
          ? yearnContract.pricePerShare()
          : aaveContract.getReserveNormalizedVariableDebt(termData.tradeBaseTokenAddress);

      return rateResultCall;
    });
    const rateDataList = await ethcallProvider.all(callList);
    return rateDataList;
  };

  const calcApyWithTerms = async (termDataList?: IGainTerm[]) => {
    if (chainId && termDataList && !connecting) {
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
        const multicallChainId =
          chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID ? DEV_MULTICALL_CHAIN_ID : chainId;
        const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
        const rateDataList = await fetchMultiCall(ethcallProvider, termDataList);

        const apyList = termDataList.map((termData, index) => {
          const nowRate = rateDataList[index] || Zero;
          const { initialRate, leverage, closeTime, decimals } = termData;
          if (!longPrices) {
            return 0;
          }
          let apy = calcRatioApy(nowRate, initialRate, leverage, closeTime, longPrices[index], decimals);
          if (apyType === EstimatedApyType.LENDING && termData.protocolType === ProtocolType.AAVE) {
            apy = calcLendFixedApy(apy / 100, termData.tradeBaseTokenType);
          }
          return apy;
        });

        setFixedApyList(apyList);
      } catch (e) {
        console.log(e);
        console.log('fetch igain apy.');
      }
    }
  };

  const debouncedCalcApyWithTerms = useMemo(() => debounce(calcApyWithTerms, 200), [calcApyWithTerms]);

  useEffect(() => {
    if (!iGainTerms || !longPrices) {
      return;
    }
    if (iGainTerms.length !== longPrices.length) {
      return;
    }

    if (prevChainId.current !== chainId) {
      prevChainId.current = chainId;
      setFixedApyList(undefined);
    }

    debouncedCalcApyWithTerms(iGainTerms);
  }, [blockNumber, iGainTerms, longPrices]);

  return IGainFixedApyList;
};

export default useFixedApy;
export { useFixedApyListWithTerms };
