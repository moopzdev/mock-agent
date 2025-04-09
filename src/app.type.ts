export type TDepositSubmitReq = {
  agentFees: {
    flatUsdt: number;
    percent: number;
  };
  customerId: string;
  currency: string;
  agentCode: string;
  timestamp: number;
  amountLocal: number;
};

export type TDepositSubmitRes = {
  depositAddress: string;
  createdAt: number;
  expireAt: number;
  depositAmountUsdt: number;
  fees: {
    agent: number;
    platform: number;
  };
  customerId: string;
  currency: string;
  amountLocal: number;
};

export type TWithdrawInquireReq = {
  agentCode: string;
  timestamp: number;
  currency: string;
  amountLocal: number;
};

export type TWithdrawInquireRes = {
  initialBalanceUsdt: number;
  withdrawAmountUsdt: number;
  fees: {
    PLATFORM: number;
  };
  remainingBalanceUsdt: number;
};

export type TWithdrawSubmitReq = {
  transactionId: string;
  agentCode: string;
  timestamp: number;
  address: string;
  amountLocal: number;
};

export type TWithdrawSubmitRes = {
  txnHash: string;
  address: string;
  amountUsdt: number;
  fees: {
    owner: string;
    feeUsdt: number;
  }[];
  isApprovalRequired: boolean;
};

export type TTetherReaderReq =
  | TDepositSubmitReq
  | TWithdrawInquireReq
  | TWithdrawSubmitReq;
