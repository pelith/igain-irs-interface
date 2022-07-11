import { useContext } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { One } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AAVE_ADDRESS, AAVE_V3_ADDRESS, ChainId, YEAR_SECONDS } from '../constants';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { SelectedChainContext } from '../context/SelectedChainContext';
import { isAddress } from '../utils/web3Utils';
import ProtocolType from '../constants/termInfo/protocolType';
import AAVE from '../constants/abis/AAVE.json';
import { useEffect, useMemo, useState } from 'react';
import { getParamsByContractId } from '../constants/termInfo/termConfigData';
import debounce from 'lodash.debounce';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { TermFactoryContext } from '../context/TermFactoryContext';
import { YEarnPriceContext } from '../context/YEarnPriceContext';

export function useIndexApy(iGainTerm: IGainTerm | undefined, web3Controller: IWeb3Controller): number {
  const { selectedChain } = useContext(SelectedChainContext);
  const contractAddress = iGainTerm?.address;
  const { iGainTermBaseInfo } = useContext(TermFactoryContext);
  const yearnTokenPrices = useContext(YEarnPriceContext);

  const targetTermData = useMemo(
    () => (contractAddress ? getParamsByContractId(contractAddress, selectedChain, iGainTermBaseInfo) : undefined),
    [contractAddress, web3Controller, iGainTermBaseInfo],
  );
  const [nowRate, setNowRate] = useState<BigNumber>(One);

  useEffect(() => {
    if (targetTermData?.protocolType === ProtocolType.YEARN) {
      const yVaultPrice = yearnTokenPrices[targetTermData.baseTokenType];
      if (yVaultPrice !== nowRate) {
        setNowRate(yVaultPrice || One);
      }
    }
  }, [yearnTokenPrices, targetTermData]);

  const { web3Provider, blockNumber } = web3Controller;

  const [decimals, decimalBNUnit] = useMemo(() => {
    const termDecimals = iGainTerm?.decimals || 18;
    const decimalBigNumberUnit = parseUnits('1', termDecimals);
    return [termDecimals, decimalBigNumberUnit];
  }, [iGainTerm]);

  const fetchNowRatio = async () => {
    if (!targetTermData || !contractAddress || !isAddress(targetTermData?.baseTokenAddress)) {
      console.error('no available address');
      return;
    }

    let localProvider;
    if (targetTermData.chainId === ChainId.FORK_MAIN_NET) {
      let providerUrl = process.env.REACT_APP_NETWORK_URL;
      localProvider = new JsonRpcProvider(providerUrl);
    } else if (targetTermData.chainId === ChainId.POLYGON) {
      let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
      localProvider = new JsonRpcProvider(providerUrl);
    } else if (targetTermData.chainId === ChainId.FANTOM) {
      let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
      localProvider = new JsonRpcProvider(providerUrl);
    } else {
      return;
    }

    let fetchedNowRate = One;

    if (iGainTerm.protocolType !== ProtocolType.YEARN) {
      const interestContractAddress =
        iGainTerm.protocolType === ProtocolType.AAVE
          ? AAVE_ADDRESS[targetTermData.chainId]
          : AAVE_V3_ADDRESS[targetTermData.chainId];
      if (!interestContractAddress) {
        return;
      }
      const contractAbi = AAVE;
      const aaveContract = new Contract(interestContractAddress, contractAbi, localProvider);
      fetchedNowRate = await aaveContract.getReserveNormalizedVariableDebt(targetTermData.baseTokenAddress);
    } else {
      return;
    }
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('nowRateIndexAPY:', fetchedNowRate.toString());
    }
    setNowRate(fetchedNowRate);
  };

  const debouncedFetchNowRatio = useMemo(() => debounce(fetchNowRatio, 200), [fetchNowRatio]);

  useEffect(() => {
    debouncedFetchNowRatio();
  }, [web3Provider, blockNumber, iGainTerm]);

  const indexAPY = useMemo(() => {
    if (!iGainTerm) {
      return 0;
    }
    const nowRatio = nowRate.sub(iGainTerm.initialRate).mul(decimalBNUnit).div(iGainTerm.initialRate);
    const deltaTime = (Date.now() - iGainTerm.openTime * 1000) / 1000;
    const nowRatioNumber = 1 + Math.max(parseFloat(formatUnits(nowRatio, decimals)), 0);
    return (nowRatioNumber ** (YEAR_SECONDS / deltaTime) - 1) * 100;
  }, [nowRate, iGainTerm]);

  return indexAPY;
}
