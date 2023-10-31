import { Injectable, OnModuleInit } from '@nestjs/common';
import { TimeRange, HighLow } from './profit.types';
import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';

@Injectable()
export class PriceRepository implements OnModuleInit {
  private historicalData: Array<number> = [];
  private historicalOneHourData: Array<HighLow> = [];
  private first: number = null;
  private last: number = null;
  private BATCH_NUMBER: number = 3600;

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
    let index = 0;
    let agg = {
      from: null,
      to: null,
      low: null,
      high: null
    };

    createReadStream('./data/history.csv')
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        const time = parseInt(row[0]);
        const price = parseFloat(row[1]);
        if (this.first === null || time < this.first) {
          this.first = time;
        }
        if (this.last === null || time > this.last) {
          this.last = time;
        }
        this.historicalData.push(price);

        if(agg.from == null)
        {
          agg.from = new Date(time);
        }
        agg.to = new Date(time);
        if(agg.low == null || agg.low.price > price) {
          agg.low = { time: new Date(time), price: price };
        }
        if(agg.high == null || agg.high.price < price) {
          agg.high = { time: new Date(time), price: price };
        }
        if(++index % this.BATCH_NUMBER == 0) {
          this.historicalOneHourData.push(agg);
          agg = {
            from: null,
            to: null,
            low: null,
            high: null
          };
        }
      })
      .on('close', () => {
        this.historicalOneHourData.push(agg);
      })
      .on('error', (err) => {
        console.error(err);
      });
  }
}
