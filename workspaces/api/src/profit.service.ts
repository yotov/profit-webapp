import { Injectable } from '@nestjs/common';
import { MaxProfit, StockPrice, TimeRange } from './profit.types';
import BigNumber from "bignumber.js";

@Injectable()
export class ProfitService {
  findOptimalResult(
    historicalPrices: Array<number>,
    range: TimeRange,
    start: Date,
    end: Date,
    investAmount?: number
  ): MaxProfit {
    let buyPoint: StockPrice = null;
    let maxProfit: MaxProfit = { buyTime: null, sellTime: null, profit: 0, stocksToBuy: 0 };

    const startMs = performance.now();
    const startIndex = (start.getTime() - range.from.getTime()) / 1000;
    const endIndex = (end.getTime() - range.from.getTime() ) / 1000;
    
    for (let i = startIndex; i <= endIndex; i++) {
      const priceAtTime = historicalPrices[i];

      if (buyPoint == null) {
        if (investAmount == null || investAmount > priceAtTime) {
          buyPoint = { price: priceAtTime, time: range.from.getTime() + i * 1000 };
        }
        continue;
      }

      if (priceAtTime < buyPoint.price) {
        buyPoint = { price: priceAtTime, time: range.from.getTime() + i * 1000 };
      }

      if (priceAtTime > buyPoint.price) {
        const stocksToBuy = investAmount != null ? Math.floor(investAmount / buyPoint.price) : 1;
        const currentProfit = new BigNumber(priceAtTime).minus(buyPoint.price).multipliedBy(stocksToBuy).dp(2, BigNumber.ROUND_HALF_UP).toNumber();
        if (currentProfit > maxProfit.profit) {
          maxProfit = {
            buyTime: new Date(buyPoint.time),
            sellTime: new Date(range.from.getTime() + i * 1000),
            stocksToBuy: stocksToBuy,
            profit: currentProfit,
            investAmount
          };
        }
      }
    }

    console.log(performance.now() - startMs);

    return maxProfit;
  }
}
