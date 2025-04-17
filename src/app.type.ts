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
  id: string;
  depositAddress: string;
  createdAt: bigint;
  expireAt: bigint;
  depositAmountUsdt: number;
  displayFeeUsdt: number;
  fees: {
    xcRateFeePlatform: number;
    xcRateFeeAgent: number;
    flatFeePlatform: number;
    flatFeeAgent: number;
  };
  minDepositUsdt: number;
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

export type TCustomerHistoryReq = {
  customerId: string;
  agentCode: string;
};

export type TCustomerEventItem = {
  serialNumber: number;
  txHash: string;
  status: string;
  tStamp: number;
  amountUsdt: number;
  amountLocal: number;
  fee: number;
};

export type TCustomerHistoryRes = {
  events: TCustomerEventItem[];
};

export type TTetherReaderReq =
  | TDepositSubmitReq
  | TWithdrawInquireReq
  | TWithdrawSubmitReq
  | TCustomerHistoryReq;

export type TDepositCallbackReq = {
  quotationId?: string;
  amountUsdt: string;
  exchangeRate: string;
  feesDeductedAmountUsdt: string;
  suggestedAmountLocalUnit: string;
  fees: {
    agent: string;
    platform: string;
  };
  currency: string;
  uuid: string;
  customerId: string;
  transferedAt: number;
  status: string;
  description: string;
};
