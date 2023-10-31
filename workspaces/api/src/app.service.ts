import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MaxProfit } from './profit.types';
import { ProfitService } from './profit.service';
import { PriceRepository } from './price.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly priceRepository: PriceRepository,
    private readonly profitService: ProfitService,
  ) {}

  getMaxProfit(startTime: Date, endTime: Date, investAmount?: number): MaxProfit {
    const range = this.priceRepository.getRange();
    if (!range.from || !range.to) {
      throw new InternalServerErrorException({ message: 'No data available' });
    }

    if (startTime && startTime.getTime() < range.from.getTime()) {
      throw new BadRequestException({
        message: 'startTime is outside available data range.',
        fields: {
          startTime: 'startTime is outside available data range.',
        },
        context: {
          range: {
            start: range.from,
            end: range.to,
          },
        },
      });
    }

    if (endTime && endTime.getTime() > range.to.getTime()) {
      throw new BadRequestException({
        message: 'endTime is outside available data range.',
        fields: {
          endTime: 'endTime is outside available data range.',
        },
        context: {
          range: {
            start: range.from,
            end: range.to,
          },
        },
      });
    }

    const historicalData = this.priceRepository.getPrices();
    const maxProfit = this.profitService.findOptimalResult(
      historicalData,
      range,
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
