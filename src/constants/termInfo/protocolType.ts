import { ReactComponent as IconAave } from '../../assets/icon-aave.svg';
import { ReactComponent as IconYearn } from '../../assets/icon-yearn.svg';
import { ReactComponent as ShapeAave } from '../../assets/shape-aave.svg';
import { ReactComponent as ShapeYearn } from '../../assets/shape-yearn.svg';

enum ProtocolType {
  AAVE = 'AAVE',
  AAVE_V3 = 'AAVE_V3',
  YEARN = 'YEARN',
}

interface ProtocolDataType {
  Icon: React.FunctionComponent;
  Shape: React.FunctionComponent;
  name: string;
}

export const PROTOCOL_DATA: {
  [protocolType in ProtocolType]: ProtocolDataType;
} = {
  [ProtocolType.AAVE]: {
    Icon: IconAave,
    Shape: ShapeAave,
    name: 'AAVE V2',
  },
  [ProtocolType.AAVE_V3]: {
    Icon: IconAave,
    Shape: ShapeAave,
    name: 'AAVE V3',
  },
  [ProtocolType.YEARN]: {
    Icon: IconYearn,
    Shape: ShapeYearn,
    name: 'Yearn',
  },
};

export default ProtocolType;
