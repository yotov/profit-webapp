import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MaxProfit, TimeRange } from './profit.types';
import { FindProfitDTO } from './dto/find-profit.dto';
import { PriceRepository } from './price.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly priceRepository: PriceRepository,
  ) {}

  @Get('/api/range')
  getRange(): TimeRange {
    return this.priceRepository.getRange();
  }

  @Get('/api/profit')
  getMaxProfit(@Query() findProfit: FindProfitDTO): MaxProfit {
    return this.appService.getMaxProfit(
      findProfit.startTime,
      findProfit.endTime,
      findProfit.investAmount,
    );
  }
}
