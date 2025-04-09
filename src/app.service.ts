import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  TDepositSubmitReq,
  TDepositSubmitRes,
  TTetherReaderReq,
  TWithdrawInquireReq,
  TWithdrawInquireRes,
  TWithdrawSubmitReq,
  TWithdrawSubmitRes,
} from './app.type';

@Injectable()

// Mock - Agent MT
export class AppService {
  private readonly TETHER_READER_API_URL = 'http://localhost:3001/';
  private readonly logger = new Logger();

  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Agent Server Functional; Ready to accept requests!';
  }

  // deposit/submit
  async submitDeposit(args: { amount: number }) {
    const { amount } = args;
    const trReqData: TDepositSubmitReq = {
      agentFees: {
        flatUsdt: 0,
        percent: 0.5,
      },
      customerId: 'gamerx007',
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
    return {
      depositAmountUsdt: res.depositAmountUsdt,
      depositAddress: res.depositAddress,
      createdAt: res.createdAt,
      expireAt: res.expireAt,
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
