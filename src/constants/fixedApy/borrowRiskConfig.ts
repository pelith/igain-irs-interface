enum RiskLevelType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  INSUFFICIENT_COLLATERAL = 'insufficientCollateral',
}

export default RiskLevelType;

export const RISK_INFO = {
  [RiskLevelType.LOW]: {
    color: 'accent.500',
    content: 'Low Risk',
  },
  [RiskLevelType.MEDIUM]: {
    color: 'secondary.700',
    content: 'Medium Risk',
  },
  [RiskLevelType.HIGH]: {
    color: 'danger',
    content: 'High Risk',
  },
  [RiskLevelType.INSUFFICIENT_COLLATERAL]: {
    color: 'primary.100',
    content: 'Insufficient collateral',
  },
};
