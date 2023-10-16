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
    let sellPoint: StockPrice = null;
    let profits: Array<MaxProfit> = [];

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

      if (buyPoint.price > price.price) {
        if (sellPoint != null) {
          profits.push({
            buyTime: buyPoint.time,
            sellTime: sellPoint.time,
            profit: sellPoint.price - buyPoint.price,
          });
          sellPoint = null;
        }
        buyPoint = price;
        continue;
      }

      if (
        price.price > buyPoint.price &&
        (sellPoint == null || sellPoint.price < price.price)
      ) {
        sellPoint = price;
      }
    }
    if (buyPoint != null && sellPoint != null) {
      profits.push({
        buyTime: buyPoint.time,
        sellTime: sellPoint.time,
        profit: sellPoint.price - buyPoint.price,
      });
    }

    return profits.reduce((acc, cur) => {
      if (acc == null) {
        return cur;
      }
      if (acc.profit < cur.profit) {
        return cur;
      }
      return acc;
    }, null);
  }
}
