import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MaxProfit } from './profit.types';
import { ProfitService } from './profit.service';
import { isAfter, isBefore } from 'date-fns';
import { PriceRepository } from './price.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly priceRepository: PriceRepository,
    private readonly profitService: ProfitService,
  ) {}

  getMaxProfit(startTime: Date, endTime: Date, investAmount?: number): MaxProfit {
    const historicalData = this.priceRepository.getPrices();
    if (historicalData.length == 0) {
      throw new InternalServerErrorException({ message: 'No data available' });
    }

    if (startTime && startTime.getTime() < historicalData[0].time) {
      throw new BadRequestException({
        message: 'startTime is outside available data range.',
        fields: {
          startTime: 'startTime is outside available data range.',
        },
        context: {
          range: {
            start: historicalData.at(0).time,
            end: historicalData.at(-1).time,
          },
        },
      });
    }

    if (endTime && endTime.getTime() > historicalData.at(-1).time) {
      throw new BadRequestException({
        message: 'endTime is outside available data range.',
        fields: {
          endTime: 'endTime is outside available data range.',
        },
        context: {
          range: {
            start: historicalData.at(0).time,
            end: historicalData.at(-1).time,
          },
        },
      });
    }

    const maxProfit = this.profitService.findOptimalResult(
      historicalData,
      startTime,
      endTime,
      investAmount
    );

    if (maxProfit.profit == 0) {
      throw new BadRequestException('No profit for selected time range.');
    }

    return maxProfit;
  }
}
