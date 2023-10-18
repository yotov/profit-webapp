import { Injectable } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';
import { MaxProfit, StockPrice } from './profit.types';

@Injectable()
export class ProfitService {
  findOptimalResult(
    historicalPrices: Array<StockPrice>,
    start: Date,
    end: Date,
  ): MaxProfit {
    let buyPoint: StockPrice = null;
    let maxProfit = { buyTime: null, sellTime: null, profit: 0 };

    for (const price of historicalPrices) {
      if (isBefore(price.time, start)) {
        continue;
      }

      if (isAfter(price.time, end)) {
        continue;
      }

      if (buyPoint == null) {
        buyPoint = price;
        continue;
      }

      if (price.price < buyPoint.price) {
        buyPoint = price;
      }
      if (price.price > buyPoint.price) {
        if (price.price - buyPoint.price > maxProfit.profit) {
          maxProfit = {
            buyTime: buyPoint.time,
            sellTime: price.time,
            profit: price.price - buyPoint.price,
          };
        }
      }
    }

    return maxProfit;
  }
}
