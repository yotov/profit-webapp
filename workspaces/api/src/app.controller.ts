import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MaxProfit } from './profit.types';
import { FindProfitDTO } from './dto/find-profit.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/profit')
  getMaxProfit(@Query() findProfit: FindProfitDTO): MaxProfit {
    return this.appService.getMaxProfit(findProfit.startTime, findProfit.endTime, findProfit.investAmount);
  }
}
