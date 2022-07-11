import { ChainId } from '..';
import BaseTokenType from './baseTokenType';
import IGainIrsTermConfig, { PartialTermConfigType, TermConfigType } from './iGainIrsTermConfig';
import ProtocolType from './protocolType';
import BASE_TOKEN_DATA from '../baseTokenConfig';
// const devStartBlock = parseInt(process.env.REACT_APP_DEV_START_BLOCK || '0');

const AAVE_PROD_USDC_POLYGON_1: TermConfigType = {
  deployBlock: 23817459,
  contractAddress: '0x11bafFebd829B490Cf077Ce7eF7700dd3cB1e534',
  longTokenAddress: '0xfC5cF06C200C7b72e4607e36e9Fdf32fBd18762c',
  shortTokenAddress: '0xd7Ea63F3D4bC062c168226282200dF58bFbE24ed',
  lendProxyAddress: '0xAafE8143F0421aFe34E131c66641bdEe5aF49B8D',
  farmProxy: '0xdaFf37c6397F1916Af8352fae36749D88E0b298E',
  farmAddress: '0x4D5054708982e96F284D02c7a46F31d6f7291C56',
  borrowProxyAddress: '0x83cd28501F1079C7647471A7da7619fafD29E2aF',
};

const AAVE_PROD_DAI_POLYGON_1: TermConfigType = {
  deployBlock: 23819455,
  contractAddress: '0x6ac0Ad00A7002047c49d289Ac9E87Cf087CE5529',
  longTokenAddress: '0x6143e7e626afc918aa88593916048499d2066c89',
  shortTokenAddress: '0x8c78cd956b57754cdcd2fc0c50a0522652e8bf35',
  lendProxyAddress: '0x3A6734A7654007AA0cb36574ecAe2FA8014beC3d',
  farmAddress: '0xdA54678FD782A162a2BAE0EA9E250a325c4F6de9',
  farmProxy: '0x64e99c3226CfbD93b16Ea13F1c8b102919221D06',
  borrowProxyAddress: '0xEa6Cb5E80a3F8B07FCC76D7daD2F6F794185D293',
};

const AAVE_PROD_USDT_POLYGON_1: TermConfigType = {
  deployBlock: 24084592,
  contractAddress: '0xc6183a902FD287CC47b525a75C8d3381C6eae42f',
  longTokenAddress: '0x4ab4927155a91f7184FBe6825f8224Edf5333957',
  shortTokenAddress: '0xda888B3564Bc4e0911b595CA24294b0337B32e83',
  lendProxyAddress: '0xf543Aa9612282b044cd71A6ee4cb816C45aAa97d',
  farmAddress: '0xF8B5351F4bCBF6321cAb7911D775Da3FaC3b5410',
  farmProxy: '0xECfbaf0a61aB6Fd205Be472231A876F685425f97',
  borrowProxyAddress: '0x9Ea10c3F3b8f4D89593ED129B43BA0A598C4c25b',
};

const AAVE_PROD_USDC_POLYGON_2: TermConfigType = {
  deployBlock: 25055969,
  contractAddress: '0xC6A3CCaaBACC6e6a5A2903B0500a1A5285f442c1',
  longTokenAddress: '0x04417bcb335f1543aacd04825b1224b535d8f150',
  shortTokenAddress: '0x11a57cf22b16acfc57df4723fa12c01ed456f4f3',
  farmAddress: '0x25a1f8f0b666E5C17e91CF9F5322aad0780B588e',
  lendProxyAddress: '0x66be1bc6C6aF47900BBD4F3711801bE6C2c6CB32',
  farmProxy: '0x5268d6559ac3Ce7C5979777523F62eB1c9ADbD83',
  borrowProxyAddress: '0x7E628e39F47F7dd1640be630766Ac1A1D67d7192',
};

const AAVE_PROD_DAI_POLYGON_2: TermConfigType = {
  deployBlock: 25056025,
  contractAddress: '0x3Eb8286b22C35174Faf02b4E4293cFb5e8652079',
  longTokenAddress: '0xaa290d1c1ac86fcf04e7ab82ba7aacbe9c8c6f85',
  shortTokenAddress: '0xf29cfc07c4f7c2d429675cc7c689448e53215c46',
  farmAddress: '0x5Dd2777c42C34Ed155FD3CC063A956D03f92448F',
  lendProxyAddress: '0x8A6F73C9D7Cbc3EbD35DfD613B57eea87F9515ab',
  farmProxy: '0x7f82f36e8E0a95eAF73219f4085245F0Bbb177AE',
  borrowProxyAddress: '0x3d5fD76D445fac4244fa62D93365C4c116A47291',
};

const AAVE_PROD_USDT_POLYGON_2: TermConfigType = {
  deployBlock: 25056094,
  contractAddress: '0xC1C194D4c8E9ddc69396BCCfEf811e72113695Cc',
  longTokenAddress: '0xe8eca5a29dcb4e618bb00127925aeef150365c1b',
  shortTokenAddress: '0xd5dc95d90db792618312091fab59c20dfef8e36d',
  farmAddress: '0x9933AD4D38702cdC28C5DB2F421F1F02CF530780',
  lendProxyAddress: '0x8677653F5c35562BB15327899000F34b4d7bf99a',
  farmProxy: '0x1E86c712CC92EBd1304dCEFbA5f2fdF99BC99087',
  borrowProxyAddress: '0xDF5D6754598d14500FeF5831C0FAa40A0af6eb55',
};

const AAVE_PROD_USDC_POLYGON_3: TermConfigType = {
  deployBlock: 26867606,
  contractAddress: '0xafCec95937c3392Ac0D96320427b0d0c1C62fdE8',
  longTokenAddress: '0x0ffebabb29083fbbf9219385d5d0ec26719c1ca6',
  shortTokenAddress: '0xe917643ed7357eb67a90ed8b4fa56c0057c36eee',
  farmAddress: '0x87c2829CcD44d2a96E76E1D3bF56d504d5cB1536',
  lendProxyAddress: '0xe74bc70BAa2D23EB3758A3B12C2ccad16882BcC5',
  farmProxy: '0x7457a1C2ba37d54277BD10d9F5B89675466C706C',
  borrowProxyAddress: '0xc40705c809Bc6Bb783C8BAD4Ba807fe453cf1483',
};

export type TermsConfigMapType = {
  [chainId in ChainId]: IGainIrsTermConfig[];
};

export type BaseTermInfoType = {
  longTokenAddress?: string;
  shortTokenAddress?: string;
  baseTokenAddress?: string;
  protocolType: ProtocolType;
  aggregatedProxy?: string;
};

const IGAIN_TERMS: TermsConfigMapType = {
  [ChainId.MAINNET]: [],
  [ChainId.POLYGON]: [
    {
      protocolType: ProtocolType.AAVE,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.USDT].address[ChainId.POLYGON],
      baseTokenType: BaseTokenType.USDT,
      chainId: ChainId.POLYGON,
      terms: [AAVE_PROD_USDT_POLYGON_1, AAVE_PROD_USDT_POLYGON_2],
    },
    {
      protocolType: ProtocolType.AAVE,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.DAI].address[ChainId.POLYGON],
      baseTokenType: BaseTokenType.DAI,
      chainId: ChainId.POLYGON,
      terms: [AAVE_PROD_DAI_POLYGON_1, AAVE_PROD_DAI_POLYGON_2],
    },
    {
      protocolType: ProtocolType.AAVE,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.USDC].address[ChainId.POLYGON],
      baseTokenType: BaseTokenType.USDC,
      chainId: ChainId.POLYGON,
      terms: [AAVE_PROD_USDC_POLYGON_1, AAVE_PROD_USDC_POLYGON_2, AAVE_PROD_USDC_POLYGON_3],
    },
  ],
  [ChainId.FANTOM]: [
    {
      protocolType: ProtocolType.YEARN,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.USDT].address[ChainId.FANTOM],
      baseTokenType: BaseTokenType.USDT,
      chainId: ChainId.FANTOM,
      terms: [],
    },
  ],
  [ChainId.FORK_MAIN_NET]: [
    {
      protocolType: ProtocolType.AAVE,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.USDT].address[ChainId.FORK_MAIN_NET],
      baseTokenType: BaseTokenType.USDT,
      chainId: ChainId.FORK_MAIN_NET,
      terms: [],
    },
    {
      protocolType: ProtocolType.AAVE,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.DAI].address[ChainId.FORK_MAIN_NET],
      baseTokenType: BaseTokenType.DAI,
      chainId: ChainId.FORK_MAIN_NET,
      terms: [],
    },
    {
      protocolType: ProtocolType.AAVE,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.USDC].address[ChainId.FORK_MAIN_NET],
      baseTokenType: BaseTokenType.USDC,
      chainId: ChainId.FORK_MAIN_NET,
      terms: [],
    },
    {
      protocolType: ProtocolType.YEARN,
      baseTokenAddress: BASE_TOKEN_DATA[BaseTokenType.DAI].address[ChainId.FORK_MAIN_NET],
      baseTokenType: BaseTokenType.DAI,
      chainId: ChainId.FORK_MAIN_NET,
      terms: [],
    },
  ],
};

const PARTIAL_TERMS_INFO: {
  [chain in ChainId]?: {
    [key: string]: PartialTermConfigType;
  };
} = {
  [ChainId.MAINNET]: {},
  [ChainId.POLYGON]: {
    '0x4CD7E2D87Cb84E5e072B6eCc92B3EF07d09AC359': {
      deployBlock: 28665141,
      farmAddress: '',
    },
  },
  [ChainId.FANTOM]: {
    '0x8f5960721Bc4988d9Bad3263212682cc7a0e3086': {
      deployBlock: 38010074,
      farmAddress: '',
    },
    '0x03d05f73De6290C47CD9cB4502fa04caCFA05631': {
      deployBlock: 39015424,
      farmAddress: '0xdDcd120e3aA3eD45e85786E4543fAbD78aB94F12',
    },
    '0x5bbbBD02ee9AE74f31d3479Bd3c4FA458D92Fac7': {
      deployBlock: 39019630,
      farmAddress: '0xdaFf37c6397F1916Af8352fae36749D88E0b298E',
    },
  },
  [ChainId.FORK_MAIN_NET]: {},
};

const getParamsByContractId = (
  contractId: string,
  chainId: ChainId,
  configObject?: TermsConfigMapType,
): IGainIrsTermConfig | undefined => {
  const targetChainData = configObject?.[chainId];
  if (!targetChainData) {
    return undefined;
  }
  const targetParams = targetChainData.find((termData) =>
    termData.terms.find((termConfig) => termConfig.contractAddress === contractId),
  );
  if (!targetParams) {
    return undefined;
  }
  const termParams = { ...targetParams };
  termParams.terms = termParams.terms.filter((termConfig) => termConfig.contractAddress === contractId);
  return termParams;
};

const getParamsByContractIds = (contractIds: string[], chainId: ChainId, configObject?: TermsConfigMapType) => {
  const targetChainData = configObject?.[chainId];
  if (!targetChainData) {
    return undefined;
  }
  let processedTargetParams = targetChainData.map((termData) => {
    const copyTermData = { ...termData };
    copyTermData.terms = termData.terms.filter((termAddressMap) =>
      contractIds.includes(termAddressMap.contractAddress),
    );
    return copyTermData;
  });
  processedTargetParams = processedTargetParams.filter((termData) => termData.terms.length > 0);
  if (!processedTargetParams) {
    return undefined;
  }
  return processedTargetParams;
};

export { IGAIN_TERMS, PARTIAL_TERMS_INFO, getParamsByContractId, getParamsByContractIds };
