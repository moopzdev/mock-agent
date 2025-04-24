import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  TCustomerHistoryReq,
  TCustomerHistoryRes,
  TDepositCallbackReq,
  TDepositSubmitReq,
  TDepositSubmitRes,
  TGetTokenReq,
  TGetTokenRes,
  TTetherReaderReq,
  TWithdrawInquireReq,
  TWithdrawInquireRes,
  TWithdrawSubmitReq,
  TWithdrawSubmitRes,
} from './app.type';

@Injectable()

// Mock - Agent MT
export class AppService {
  private readonly TETHER_READER_API_URL = 'http://localhost:13000/';
  // 'https://ethpay-dev-core-api.campeon66.com/';
  private readonly logger = new Logger();
  private readonly depositDB = new Map<string, TDepositCallbackReq>();
  private readonly customerDB = new Map<string, number>();

  constructor(private readonly httpService: HttpService) {
    //initialize customerDB
    this.customerDB.set('customer01', 1000);
    this.customerDB.set('customer02', 2000);
    this.customerDB.set('customer03', 3000);
    this.customerDB.set('customer04', 4000);
    this.customerDB.set('customer05', 5000);
  }

  getHello(): string {
    return 'Agent Server Functional; Ready to accept requests!';
  }

  getCustomerBalance(args: { customerId: string }) {
    const { customerId } = args;
    const balance = this.customerDB.get(customerId);
    if (balance === undefined) {
      throw new Error('Customer not found');
    }
    return {
      customerId,
      balance,
      currency: 'THB',
    };
  }

  // deposit/submit
  async submitDeposit(args: { amount: number }) {
    const { amount } = args;
    const trReqData: TDepositSubmitReq = {
      agentFees: {
        flatUsdt: 0,
        percent: 0,
      },
      customerId: 'customer01',
      currency: 'THB',
      agentCode: 'ag1',
      timestamp: 1742356776963,
      amountLocal: amount,
    };

    //call the ta-reader API
    const res = (await this.makeHttpRequest({
      url: this.TETHER_READER_API_URL + 'eth-deposit/submit',
      data: trReqData,
    })) as TDepositSubmitRes;

    this.logger.log(res);
    //returning the suggested Deposit Amount
    const now = Date.now();
    const expireAt = now + 10 * 60 * 1000; // 10 minutes from now
    return {
      id: res.id,
      depositAmountUsdt: res.depositAmountUsdt,
      depositAddress: res.depositAddress,
      // createdAt: res.createdAt,
      // expireAt: res.expireAt,
      createdAt: now,
      expireAt: expireAt,
      minDepositUsdt: res.minDepositUsdt,
      displayFeeUsdt: res.displayFeeUsdt,
      amountLocal: res.amountLocal,
      currency: res.currency,
    };
  }

  // withdraw/inquire
  async inquireWithdraw(args: { amount: number }) {
    const { amount } = args;
    const trReqData: TWithdrawInquireReq = {
      agentCode: 'ag1',
      timestamp: 1742356776963,
      currency: 'THB',
      amountLocal: amount,
    };

    const res = (await this.makeHttpRequest({
      url: this.TETHER_READER_API_URL + 'eth-withdraw/inquire',
      data: trReqData,
    })) as TWithdrawInquireRes;

    this.logger.log(res);
    //returning the suggested Deposit Amount
    return {
      withdrawAmountUsdt: res.withdrawAmountUsdt,
    };
  }

  async submitWithdraw(args: { amount: number }) {
    const { amount } = args;

    const trReqData: TWithdrawSubmitReq = {
      transactionId: 'ag1#' + Math.floor(Math.random() * 10000),
      agentCode: 'ag1',
      timestamp: 1742356776963,

      address: '0x2aDF2769f5783193e8994f0b44912BC727369302',
      amountLocal: amount,
    };

    const res = (await this.makeHttpRequest({
      url: this.TETHER_READER_API_URL + 'eth-withdraw/submit',
      data: trReqData,
    })) as TWithdrawSubmitRes;

    this.logger.log(res);
    //must return txn hash; done
    return {
      txnHash: res.txnHash,
    };
  }

  getCustomerHistory(args: { customerId: string }) {
    const { customerId } = args;
    const trReqData: TCustomerHistoryReq = {
      customerId,
      agentCode: 'ag1',
    };
    console.log(trReqData);

    const mockRes: TCustomerHistoryRes = {
      events: [
        {
          serialNumber: 4,
          txHash: '0xabcdef1232567890',
          status: 'PENDING',
          tStamp: 1743752550000,
          amountUsdt: 200,
          amountLocal: 6000,
          fee: 10,
        },
        {
          serialNumber: 3,
          txHash: '0x1234567890abcdef',
          status: 'SUCCESS',
          tStamp: 1743753820000,
          amountUsdt: 100,
          amountLocal: 3000,
          fee: 5,
        },
        {
          serialNumber: 2,
          txHash: '0xabcdef1234567890',
          status: 'FAILED',
          tStamp: 1743752520000,
          amountUsdt: 200,
          amountLocal: 6000,
          fee: 10,
        },
        {
          serialNumber: 1,
          txHash: '0xabcfghf123456790',
          status: 'SUCCESS',
          tStamp: 1743752510000,
          amountUsdt: 200,
          amountLocal: 6000,
          fee: 10,
        },
      ],
    };

    return mockRes;
  }

  callbackDeposit(args: TDepositCallbackReq) {
    const { quotationId } = args;
    if (quotationId) {
      this.depositDB.set(quotationId, args);
    }
    console.log('Deposit Callback Received:', args);

    const currentBalance = this.customerDB.get(args.customerId);

    const newBalance = Number(args.amountUsdt) + (currentBalance ?? 0);

    this.customerDB.set(args.customerId, newBalance);

    return {
      status: 'success',
      customerId: args.customerId,
      balance: newBalance,
    };
  }

  getDepositStatus(args: { quotationId: string }) {
    const { quotationId: uuid } = args;
    const res = this.depositDB.get(uuid);
    if (!res) {
      throw new Error('Deposit not found');
    }

    const transformedResponse = {
      quotationId: res.quotationId,
      amountUsdt: res.amountUsdt,
      depositFees: (res.fees?.agent ?? 0) + (res.fees?.platform ?? 0),
      deductedFeeUsdt: res.feesDeductedAmountUsdt,
      creditAmount: res.suggestedAmountLocalUnit,
    };

    return transformedResponse;
  }

  async getTokenFromEthPay(args: { customerId: string }) {
    const { customerId } = args;
    const trReqData: TGetTokenReq = {
      agentCode: 'ag1',
      customerId,
      timestamp: 1742356776963,
    };
    const res = (await this.makeHttpRequest({
      url: this.TETHER_READER_API_URL + 'auth/token/generate',
      data: trReqData,
    })) as TGetTokenRes;
    return res;
  }

  private async makeHttpRequest(args: {
    url: string;
    data: TTetherReaderReq;
  }): Promise<any> {
    const { url, data } = args;
    try {
      const response: { data: any } = await lastValueFrom(
        this.httpService.post(url, data),
      );
      console.log(data);
      return response.data;
    } catch (error) {
      const err = error as Error;
      // Handle errors gracefully
      throw new Error(`Failed to make HTTP request to ${url}: ${err.message}`);
    }
  }
}
