import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { MaxProfit, StockPrice } from './profit.types';
import { ProfitService } from './profit.service';
import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';
import { isAfter, isBefore } from 'date-fns';

@Injectable()
export class AppService implements OnModuleInit {
  private historicalData: Array<StockPrice> = [];

  constructor(private readonly profitService: ProfitService) {}

  getMaxProfit(startTime: Date, endTime: Date): MaxProfit {
    if (this.historicalData.length == 0) {
      throw new InternalServerErrorException({ message: 'No data available' });
    }

    if (startTime && isBefore(startTime, this.historicalData[0].time)) {
      throw new BadRequestException({
        message: 'startTime is outside available data range.',
        context: {
          range: {
            start: this.historicalData[0].time,
            end: this.historicalData.at(-1).time,
          },
        },
      });
    }

    if (endTime && isAfter(endTime, this.historicalData.at(-1).time)) {
      throw new BadRequestException({
        message: 'endTime is outside available data range.',
        context: {
          range: {
            start: this.historicalData[0].time,
            end: this.historicalData.at(-1).time,
          },
        },
      });
    }

    const maxProfit = this.profitService.findOptimalResult(
      this.historicalData,
      startTime,
      endTime,
    );

    if (maxProfit.profit == 0) {
      throw new BadRequestException('No profit for selected time range.');
    }

    return maxProfit;
  }

  async onModuleInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    createReadStream('./data/history.csv')
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        this.historicalData.push({ time: new Date(row[0]), price: row[1] });
      });
  }
}
