import { useEffect, useMemo, useState } from 'react';
import { IWeb3Controller } from '../constants/web3ContextConstants';
import { Contract as MulticallContract, Provider as MulticallProvider } from '@pelith/ethers-multicall';
import { AAVE_ADDRESS, AAVE_V3_ADDRESS, AAVE_V3_ORACLE_ADDRESS, DEV_MULTICALL_CHAIN_ID } from '../constants';
import BASE_TOKEN_DATA from '../constants/baseTokenConfig';
import AAVE_V3_ORACLE_ABI from '../constants/abis/aaveV3PriceOracle.json';
import ORACLE_ABI from '../constants/abis/oracle.json';
import AAVE_ABI from '../constants/abis/AAVE.json';
import AAVE_V3_ABI from '../constants/abis/AaveV3IPool.json';
import debounce from 'lodash.debounce';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import { ChainId } from '../constants';
import ProtocolType from '../constants/termInfo/protocolType';
import IGainIrsTermParams from '../constants/termInfo/iGainIrsTermParams';

export interface ICollateralStatus {
  totalDebt: BigNumber;
  totalCollateral: BigNumber;
  ltv: BigNumber;
  availableBorrows: BigNumber;
}
interface IFetchedCollateralStatus {
  priceAgainstBase: BigNumber;
  totalCollateralBase: BigNumber;
  totalDebtBase: BigNumber;
  availableBorrowsBase: BigNumber;
  aaveLtv: BigNumber;
}

export default function useCollateralStatus(
  termData: IGainIrsTermParams | undefined,
  decimals: number,
  web3Controller: IWeb3Controller,
): ICollateralStatus {
  const { blockNumber, account, connecting } = web3Controller;
  const [fetchedData, setFetchedData] = useState<IFetchedCollateralStatus>({
    priceAgainstBase: Zero,
    totalCollateralBase: Zero,
    totalDebtBase: Zero,
    availableBorrowsBase: Zero,
    aaveLtv: Zero,
  });

  const fetchMultiCall = async (
    ethcallProvider: MulticallProvider,
    protocolType: ProtocolType,
    chainId: ChainId,
    oracleAddress: string,
  ) => {
    try {
      if (protocolType === ProtocolType.YEARN) {
        // Iron Bank
      } else if (protocolType === ProtocolType.AAVE) {
        const aaveContract = new MulticallContract(AAVE_ADDRESS[chainId], AAVE_ABI);
        const oracleContract = new MulticallContract(oracleAddress, ORACLE_ABI);
        const [aaveInfo, priceAgainstBase] = await ethcallProvider.all([
          aaveContract.getUserAccountData(account),
          oracleContract.latestAnswer(),
        ]);
        const [totalCollateralBase, totalDebtBase, availableBorrowsBase, , aaveLtv] = aaveInfo;
        setFetchedData({
          priceAgainstBase,
          totalCollateralBase,
          totalDebtBase,
          availableBorrowsBase,
          aaveLtv,
        });
      } else {
        const aaveContract = new MulticallContract(AAVE_V3_ADDRESS[chainId], AAVE_V3_ABI);
        const oracleContract = new MulticallContract(AAVE_V3_ORACLE_ADDRESS[chainId], AAVE_V3_ORACLE_ABI);

        const [aaveInfo, priceAgainstBase] = await ethcallProvider.all([
          aaveContract.getUserAccountData(account),
          oracleContract.getAssetPrice(termData?.baseTokenAddress),
        ]);
        const [totalCollateralBase, totalDebtBase, availableBorrowsBase, , aaveLtv] = aaveInfo;
        setFetchedData({
          priceAgainstBase,
          totalCollateralBase,
          totalDebtBase,
          availableBorrowsBase,
          aaveLtv,
        });
      }
    } catch (e) {
      console.log(e);
      console.log('fetch collateral failed');
    }
  };

  const fetchCollateralStatus = async () => {
    if (termData && !connecting) {
      try {
        let localProvider;
        if (termData.chainId === ChainId.FORK_MAIN_NET) {
          let providerUrl = process.env.REACT_APP_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (termData.chainId === ChainId.POLYGON) {
          let providerUrl = process.env.REACT_APP_POLYGON_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else if (termData.chainId === ChainId.FANTOM) {
          let providerUrl = process.env.REACT_APP_FANTOM_NETWORK_URL;
          localProvider = new JsonRpcProvider(providerUrl);
        } else {
          return;
        }
        const multicallChainId =
          termData.chainId === ChainId.FORK_MAIN_NET && DEV_MULTICALL_CHAIN_ID
            ? DEV_MULTICALL_CHAIN_ID
            : termData.chainId;
        const ethcallProvider = new MulticallProvider(localProvider, multicallChainId);
        fetchMultiCall(
          ethcallProvider,
          termData.protocolType,
          termData.chainId,
          BASE_TOKEN_DATA[termData.baseTokenType].oracle[termData.chainId],
        );
      } catch (e) {
        console.log(e);
        console.log('fetch collateral status error.');
      }
    }
  };

  const debouncedFetchCollateralStatus = useMemo(() => debounce(fetchCollateralStatus, 200), [fetchCollateralStatus]);

  useEffect(() => {
    debouncedFetchCollateralStatus();
  }, [account, termData, blockNumber]);

  const parsedVaultInfoWithDecimals = useMemo(() => {
    const { aaveLtv, availableBorrowsBase, priceAgainstBase, totalDebtBase, totalCollateralBase } = fetchedData;
    const ltv = aaveLtv || Zero;
    if (priceAgainstBase.gt(Zero)) {
      const availableBorrows = termData
        ? availableBorrowsBase.mul(parseUnits('1', decimals)).div(priceAgainstBase)
        : Zero;
      const totalDebt = termData ? totalDebtBase.mul(parseUnits('1', decimals)).div(priceAgainstBase) : Zero;
      const totalCollateral = termData
        ? totalCollateralBase.mul(parseUnits('1', decimals)).div(priceAgainstBase)
        : Zero;
      return { ltv, availableBorrows, totalDebt, totalCollateral };
    }
    return { ltv: Zero, availableBorrows: Zero, totalDebt: Zero, totalCollateral: Zero };
  }, [fetchedData, decimals]);

  return parsedVaultInfoWithDecimals;
}
