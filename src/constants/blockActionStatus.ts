enum BlockInteractionState {
  READY = 0,
  PENDING = 1,
  SUCCESS = 2,
}

enum ExtraApprovalInteractionState {
  NOT_APPROVED = 3,
  APPROVED = 4,
}

export type ApprovalInteractionState = BlockInteractionState | ExtraApprovalInteractionState;

export { BlockInteractionState, ExtraApprovalInteractionState };
