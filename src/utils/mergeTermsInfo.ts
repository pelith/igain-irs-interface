import cloneDeep from 'lodash.clonedeep';
import { ChainId } from '../constants';
import { getBaseTokenType } from '../constants/baseTokenConfig';
import { BaseTermInfoMap } from '../constants/termInfo/buildTermConfigTypes';
import ProtocolType from '../constants/termInfo/protocolType';
import { TermsConfigMapType, IGAIN_TERMS, PARTIAL_TERMS_INFO } from '../constants/termInfo/termConfigData';
import { getBaseTokenAddress } from '../constants/termInfo/yvTokenConfig';

const mergeTermsInfo: (baseTermInfoMap: BaseTermInfoMap, chainId: ChainId, currentBlock: number) => TermsConfigMapType =
  (baseTermInfoMap, chainId, currentBlock) => {
    const clonedTermConfig = cloneDeep(IGAIN_TERMS);
    Object.keys(baseTermInfoMap).forEach((address) => {
      const targetBaseTermInfo = baseTermInfoMap[address];
      const tradeBaseToken =
        targetBaseTermInfo.protocolType === ProtocolType.AAVE_V3
          ? targetBaseTermInfo.baseTokenAddress
          : getBaseTokenAddress(chainId, targetBaseTermInfo.baseTokenAddress);

      if (!targetBaseTermInfo.baseTokenAddress) {
        return;
      }

      let targetIGainIrsTermConfig = clonedTermConfig[chainId].find((termConfigType) => {
        return (
          termConfigType.baseTokenAddress === tradeBaseToken &&
          termConfigType.protocolType === targetBaseTermInfo.protocolType
        );
      });

      if (!targetIGainIrsTermConfig) {
        const targetBaseTokenType = getBaseTokenType(tradeBaseToken);
        if (!targetBaseTokenType) {
          return;
        }
        targetIGainIrsTermConfig = {
          baseTokenAddress: tradeBaseToken || '',
          protocolType: targetBaseTermInfo.protocolType,
          chainId,
          terms: [],
          baseTokenType: targetBaseTokenType,
        };
        clonedTermConfig[chainId].push(targetIGainIrsTermConfig);
      } else if (!targetIGainIrsTermConfig.terms) {
        targetIGainIrsTermConfig.terms = [];
      }

      const { longTokenAddress, shortTokenAddress, aggregatedProxy } = targetBaseTermInfo;

      if (!longTokenAddress || !shortTokenAddress || !aggregatedProxy) {
        return;
      }

      targetIGainIrsTermConfig.terms.push({
        contractAddress: address,
        longTokenAddress,
        shortTokenAddress,
        aggregatedProxy,
        deployBlock: currentBlock,
        farmAddress: undefined,
        ...PARTIAL_TERMS_INFO[chainId]?.[address],
      });
    });

    return clonedTermConfig;
  };

export default mergeTermsInfo;
