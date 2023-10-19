import { Injectable } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';
import { MaxProfit, StockPrice } from './profit.types';

@Injectable()
export class ProfitService {
  findOptimalResult(
    historicalPrices: Array<StockPrice>,
    start: Date,
    end: Date,
    investAmount?: number
  ): MaxProfit {
    let buyPoint: StockPrice = null;
    let maxProfit: MaxProfit = { buyTime: null, sellTime: null, profit: 0, stocksToBuy: 0 };

    for (const priceAtTime of historicalPrices) {
      if (isBefore(priceAtTime.time, start)) {
        continue;
      }

      if (isAfter(priceAtTime.time, end)) {
        continue;
      }

      if (buyPoint == null) {
        if(investAmount == null || investAmount > priceAtTime.price) {
          buyPoint = priceAtTime;
        }
        continue;
      }

      if (priceAtTime.price < buyPoint.price) {
        buyPoint = priceAtTime;
      }

      if (priceAtTime.price > buyPoint.price) {
        const stocksToBuy = investAmount != null ? Math.floor(investAmount / buyPoint.price) : 1;
        const currentProfit = (priceAtTime.price - buyPoint.price) * stocksToBuy;
        if (currentProfit > maxProfit.profit) {
          maxProfit = {
            buyTime: buyPoint.time,
            sellTime: priceAtTime.time,
            stocksToBuy: stocksToBuy,
            profit: currentProfit,
          };
        }
      }
    }

    return maxProfit;
  }
}
