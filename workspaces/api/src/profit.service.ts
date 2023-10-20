import { Injectable } from '@nestjs/common';
import { MaxProfit, StockPrice } from './profit.types';
import BigNumber from "bignumber.js";

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

    const startMs = performance.now();
    const length = historicalPrices.length;
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    for (let i = 0; i < length; i++) {
      const priceAtTime = historicalPrices[i];
      if (priceAtTime.time < startTime) {
        continue;
      }

      if (priceAtTime.time > endTime) {
        continue;
      }

      if (buyPoint == null) {
        if (investAmount == null || investAmount > priceAtTime.price) {
          buyPoint = priceAtTime;
        }
        continue;
      }

      if (priceAtTime.price < buyPoint.price) {
        buyPoint = priceAtTime;
      }

      if (priceAtTime.price > buyPoint.price) {
        const stocksToBuy = investAmount != null ? Math.floor(investAmount / buyPoint.price) : 1;
        const currentProfit = new BigNumber(priceAtTime.price).minus(buyPoint.price).multipliedBy(stocksToBuy).dp(2, BigNumber.ROUND_HALF_UP).toNumber();
        if (currentProfit > maxProfit.profit) {
          maxProfit = {
            buyTime: new Date(buyPoint.time),
            sellTime: new Date(priceAtTime.time),
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
