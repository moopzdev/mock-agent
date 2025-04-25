import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { TDepositCallbackReq } from './app.type';

@ApiTags('Agent BackEnd')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //Health check
  @Get('healthz')
  getHello(): string {
    return this.appService.getHello();
  }

  //Balance
  @Post('balance')
  @ApiBody({ schema: { example: { customerId: 'customer01' } } })
  checkBalance(@Body() body: { customerId: string }) {
    const result = this.appService.getCustomerBalance(body);
    return result;
  }

  //Deposit
  @Post('token')
  @ApiBody({ schema: { example: { customerId: 'customer01' } } })
  async submitDeposit(@Body() body: { customerId: string }) {
    const result = await this.appService.getTokenFromEthPay(body);
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
  callbackDeposit(@Body() body: TDepositCallbackReq) {
    const result = this.appService.callbackDeposit(body);
    return result;
  }

  // OLD API ENDPOINTS MARKED FOR DELETE
  // //Deposit
  // @Post('deposit/submit')
  // @ApiBody({ schema: { example: { amount: 300 } } })
  // async submitDeposit(@Body() body: { amount: number }) {
  //   const result = await this.appService.submitDeposit(body);
  //   return result;
  // }

  // @Post('deposit/status')
  // @ApiBody({
  //   schema: {
  //     example: { quotationId: '06c55695-629a-44cd-9b46-87b0f1295a3c' },
  //   },
  // })
  // getDepositStatus(@Body() body: { quotationId: string }) {
  //   const result = this.appService.getDepositStatus(body);
  //   return result;
  // }
  // @Post('withdraw/inquire')
  // @ApiBody({ schema: { example: { amount: 300 } } })
  // async inquireWithdraw(@Body() body: { amount: number }) {
  //   const result = await this.appService.inquireWithdraw(body);
  //   return result;
  // }

  // @Post('withdraw/submit')
  // @ApiBody({ schema: { example: { amount: 300 } } })
  // async submitWithdraw(@Body() body: { amount: number }) {
  //   const result = await this.appService.submitWithdraw(body);
  //   return result;
  // }

  // @Post('history/customer')
  // @ApiBody({ schema: { example: { customerId: 'gamerx007' } } })
  // getCustomerHistory(@Body() body: { customerId: string }) {
  //   const result = this.appService.getCustomerHistory(body);
  //   return result;
  // }
}
