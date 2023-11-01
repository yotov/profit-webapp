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

  getMaxProfit(
    startTime: Date,
    endTime: Date,
    investAmount?: number,
  ): MaxProfit {
    if (!this.priceRepository.isLoadComplete()) {
      throw new InternalServerErrorException({ message: 'No data available' });
    }

    if (!this.priceRepository.isValidTime(startTime)) {
      throw new BadRequestException({
        message: 'startTime is outside available data range.',
        fields: {
          startTime: 'startTime is outside available data range.',
        },
        context: {
          range: this.priceRepository.getRange(),
        },
      });
    }

    if (!this.priceRepository.isValidTime(endTime)) {
      throw new BadRequestException({
        message: 'endTime is outside available data range.',
        fields: {
          endTime: 'endTime is outside available data range.',
        },
        context: {
          range: this.priceRepository.getRange(),
        },
      });
    }
    const maxProfit = this.profitService.findOptimalResult(
      startTime,
      endTime,
      investAmount,
    );

    if (maxProfit.profit == 0) {
      throw new BadRequestException('No profit for selected time range.');
    }

    return maxProfit;
  }
}
