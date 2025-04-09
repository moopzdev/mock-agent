import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('mock-agent')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //Health check
  @Get('healthz')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('deposit/submit')
  @ApiBody({ schema: { example: { amount: 300 } } })
  async submitDeposit(@Body() body: { amount: number }) {
    const result = await this.appService.submitDeposit(body);
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
}
