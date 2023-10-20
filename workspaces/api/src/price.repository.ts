import { Injectable, OnModuleInit } from '@nestjs/common';
import { StockPrice, TimeRange } from './profit.types';
import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';
import { isAfter, isBefore } from 'date-fns';

@Injectable()
export class PriceRepository implements OnModuleInit {
  private historicalData: Array<StockPrice> = [];
  private first: Date = null;
  private last: Date = null;

  getPrices(): Array<StockPrice> {
    return this.historicalData;
  }

  getRange(): TimeRange {
    return { from: this.first, to: this.last };
  }

  async onModuleInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    createReadStream('./data/history.csv')
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        const time = new Date(row[0]);
        // console.log(time);
        if (this.first === null || isBefore(time, this.first)) {
          this.first = time;
        }
        if (this.last === null || isAfter(time, this.last)) {
          this.last = time;
        }
        this.historicalData.push({ time, price: row[1] });
      })
      .on('error', (err) => {
        console.error(err);
      });
  }
}
