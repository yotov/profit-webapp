import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MaxProfit } from './profit.types';
import { TimeRangeDTO } from './dto/time-range.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/profit')
  getMaxProfit(@Query() timeRange: TimeRangeDTO): MaxProfit {
    return this.appService.getMaxProfit(timeRange.startTime, timeRange.endTime);
  }
}
