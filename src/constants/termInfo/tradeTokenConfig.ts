import { ReactComponent as LongIcon } from '../../assets/tokenIcons/icon-long.svg';
import { ReactComponent as ShortIcon } from '../../assets/tokenIcons/icon-short.svg';
import { ReactComponent as LpIcon } from '../../assets/tokenIcons/icon-lp.svg';

enum TradeTokenType {
  LONG = 'Long',
  SHORT = 'Short',
  LP = 'Liquidity',
}

const TradeTokenConfig = {
  [TradeTokenType.LONG]: {
    TokenIcon: LongIcon,
    title: 'Long',
    subtitle: 'LONG Token',
    tooltips: 'Buy Long tokens to lock future borrowing costs',
    buyLabel: 'Buy',
    sellLabel: 'Sell',
  },
  [TradeTokenType.SHORT]: {
    TokenIcon: ShortIcon,
    title: 'Short',
    subtitle: 'SHORT Token',
    tooltips: 'Buy Short tokens to hedge lending positions',
    buyLabel: 'Buy',
    sellLabel: 'Sell',
  },
  [TradeTokenType.LP]: {
    TokenIcon: LpIcon,
    title: 'Liquidity',
    subtitle: 'LP Token',
    tooltips: 'Represents a share of the liquidity pool provided by its holder.',
    buyLabel: 'Add',
    sellLabel: 'Remove',
  },
};

export { TradeTokenType, TradeTokenConfig };
