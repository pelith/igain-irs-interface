import { TradeTokenType } from './tradeTokenConfig';

enum TradeCardActionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

const CardActionLabel: {
  [key in TradeTokenType]: {
    [innerKey in TradeCardActionType]: string;
  };
} = {
  [TradeTokenType.LONG]: {
    [TradeCardActionType.BUY]: 'BUY',
    [TradeCardActionType.SELL]: 'SELL',
  },
  [TradeTokenType.SHORT]: {
    [TradeCardActionType.BUY]: 'BUY',
    [TradeCardActionType.SELL]: 'SELL',
  },
  [TradeTokenType.LP]: {
    [TradeCardActionType.BUY]: 'ADD',
    [TradeCardActionType.SELL]: 'REMOVE',
  },
};

export default TradeCardActionType;

export { CardActionLabel };
