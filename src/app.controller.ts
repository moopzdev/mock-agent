import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { TDepositCallbackReq } from './app.type';

@ApiTags('mock-agent')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //Health check
  @Get('healthz')
  getHello(): string {
    return this.appService.getHello();
  }

  //Deposit
  @Post('deposit/submit')
  @ApiBody({ schema: { example: { amount: 300 } } })
  async submitDeposit(@Body() body: { amount: number }) {
    const result = await this.appService.submitDeposit(body);
    return result;
  }

  @Post('deposit/callback')
  @ApiBody({
    schema: {
      example: {
        amountUsdt: '1472.05',
        exchangeRate: '34.221',
        feesDeductedAmountUsdt: '1461.09',
        suggestedAmountLocalUnit: '49999.96',
        fees: {
          agent: '7.31',
          platform: '3.65',
        },
        currency: 'THB',
        uuid: '06c55695-629a-44cd-9b46-87b0f1295a3c',
        customerId: 'gamerx007',
        transferedAt: 1743752520000,
        status: 'SUCCESS',
        description: 'DEPOSIT_SUCCESS',
      },
    },
  })
  callbackDeposit(@Body() body: TDepositCallbackReq, @Res() res: Response) {
    this.appService.callbackDeposit(body);
    return res.status(200).send('OK');
  }

  @Post('deposit/status')
  @ApiBody({
    schema: {
      example: { quotationId: '06c55695-629a-44cd-9b46-87b0f1295a3c' },
    },
  })
  getDepositStatus(@Body() body: { quotationId: string }) {
    const result = this.appService.getDepositStatus(body);
    return result;
  }
  @Post('withdraw/inquire')
  @ApiBody({ schema: { example: { amount: 300 } } })
  async inquireWithdraw(@Body() body: { amount: number }) {
    const result = await this.appService.inquireWithdraw(body);
    return result;
  }

  @Post('withdraw/submit')
  @ApiBody({ schema: { example: { amount: 300 } } })
  async submitWithdraw(@Body() body: { amount: number }) {
    const result = await this.appService.submitWithdraw(body);
    return result;
  }

  @Post('history/customer')
  @ApiBody({ schema: { example: { customerId: 'gamerx007' } } })
  getCustomerHistory(@Body() body: { customerId: string }) {
    const result = this.appService.getCustomerHistory(body);
    return result;
  }
}
