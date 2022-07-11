export enum ProxyApprovalStatus {
  BaseTokenApproveAAVEKey = 'BaseTokenApproveAAVEKey',
  BaseTokenApproveYEarnKey = 'BaseTokenApproveYEarnKey',
  PositionApproveKey = 'PositionApproveKey',
  TradeTokenApproveKey = 'TradeTokenApproveKey',
  FarmApproveKey = 'FarmApproveKey',
  PureApproveKey = 'PureApproveKey',
}

export const PROXY_APPROVAL_KEY_MAPPING: { [statusKey in ProxyApprovalStatus]: string } = {
  [ProxyApprovalStatus.BaseTokenApproveYEarnKey]: 'Approve for Yearn',
  [ProxyApprovalStatus.BaseTokenApproveAAVEKey]: 'Approve for AAVE V3',
  [ProxyApprovalStatus.PositionApproveKey]: 'Approve for iGain term',
  [ProxyApprovalStatus.TradeTokenApproveKey]: 'Unlock Token',
  [ProxyApprovalStatus.FarmApproveKey]: 'Approve for farming',
  [ProxyApprovalStatus.PureApproveKey]: 'Approve Proxy',
};
