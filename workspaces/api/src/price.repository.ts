import { Injectable, OnModuleInit } from '@nestjs/common';
import { StockPrice } from './profit.types';
import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';

@Injectable()
export class PriceRepository implements OnModuleInit {
  private historicalData: Array<StockPrice> = [];

  getPrices(): Array<StockPrice> {
    return this.historicalData;
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
