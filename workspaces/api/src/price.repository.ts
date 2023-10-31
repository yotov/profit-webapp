import { Injectable, OnModuleInit } from '@nestjs/common';
import { TimeRange } from './profit.types';
import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';

@Injectable()
export class PriceRepository implements OnModuleInit {
  private historicalData: Array<number> = [];
  private first: number = null;
  private last: number = null;

  getPrices(): Array<number> {
    return this.historicalData;
  }

  getRange(): TimeRange {
    return { from: new Date(this.first), to: new Date(this.last) };
  }

  async onModuleInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    createReadStream('./data/history.csv')
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        const time = parseInt(row[0]);
        if (this.first === null || time < this.first) {
          this.first = time;
        }
        if (this.last === null || time > this.last) {
          this.last = time;
        }
        this.historicalData.push(row[1]);
      })
      .on('error', (err) => {
        console.error(err);
      });
  }
}
