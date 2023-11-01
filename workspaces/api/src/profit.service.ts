import { Injectable } from '@nestjs/common';
import { HighLow, MaxProfit, StockPrice, TimeRange } from './profit.types';
import BigNumber from 'bignumber.js';
import { PriceRepository } from './price.repository';

@Injectable()
export class ProfitService {
  constructor(private readonly priceRepository: PriceRepository) {}
  findOptimalResult(start: Date, end: Date, investAmount?: number): MaxProfit {
    const historicalPrices = this.priceRepository.getPrices();
    const range = this.priceRepository.getRange();
    const bucketsCount = Math.ceil(
      (end.getTime() - start.getTime()) /
        this.priceRepository.BATCH_NUMBER /
        1000,
    );

    let maxProfit: MaxProfit = {
      buyTime: null,
      buyPrice: null,
      sellTime: null,
      sellPrice: null,
      profit: 0,
      stocksToBuy: 0,
    };

    if (bucketsCount < 2) {
      return this.findMaxProfitInEdges(
        historicalPrices,
        range,
        start,
        end,
        maxProfit,
        investAmount,
      );
    }

    const firstStart = start;
    const firstEnd = new Date(
      start.getTime() +
        this.priceRepository.BATCH_NUMBER -
        (start.getTime() % this.priceRepository.BATCH_NUMBER),
    );

    const lastStart = new Date(
      end.getTime() - (end.getTime() % this.priceRepository.BATCH_NUMBER),
    );
    const lastEnd = end;

    // find in first partial bucket
    maxProfit = this.findMaxProfitInEdges(
      historicalPrices,
      range,
      firstStart,
      firstEnd,
      maxProfit,
      investAmount,
    );

    // find in middle buckets
    maxProfit = this.findMaxProfitFromHighLows(
      this.priceRepository.getBatches(),
      firstEnd,
      lastStart,
      maxProfit,
      investAmount,
    );

    // find in last partial bucket
    maxProfit = this.findMaxProfitInEdges(
      historicalPrices,
      range,
      lastStart,
      lastEnd,
      maxProfit,
      investAmount,
    );

    return maxProfit;
  }
  findMaxProfitFromHighLows(
    highLowPrices: Array<HighLow>,
    start: Date,
    end: Date,
    initialMaxProfit: MaxProfit,
    investAmount?: number,
  ) {
    let maxProfit = initialMaxProfit;
    let buyPoint: StockPrice =
      initialMaxProfit.buyTime != null
        ? {
            price: initialMaxProfit.buyPrice,
            time: initialMaxProfit.buyTime.getTime(),
          }
        : null;
    let orderedHighLowPrices = highLowPrices.flatMap((h) =>
      h.low.time < h.high.time ? [h.low, h.high] : [h.high, h.low],
    );
    for (const highLowPrice of orderedHighLowPrices) {
      if (
        highLowPrice.time < start.getTime() ||
        highLowPrice.time > end.getTime()
      ) {
        continue;
      }
      if (buyPoint == null) {
        if (investAmount == null || investAmount > highLowPrice.price) {
          buyPoint = { price: highLowPrice.price, time: highLowPrice.time };
        }
        continue;
      }

      if (highLowPrice.price < buyPoint.price) {
        buyPoint = { price: highLowPrice.price, time: highLowPrice.time };
      }

      if (highLowPrice.price > buyPoint.price) {
        const stocksToBuy =
          investAmount != null ? Math.floor(investAmount / buyPoint.price) : 1;
        const currentProfit = new BigNumber(highLowPrice.price)
          .minus(buyPoint.price)
          .multipliedBy(stocksToBuy)
          .dp(2, BigNumber.ROUND_HALF_UP)
          .toNumber();
        if (currentProfit > maxProfit.profit) {
          maxProfit = {
            buyTime: new Date(buyPoint.time),
            buyPrice: buyPoint.price,
            sellTime: new Date(highLowPrice.time),
            sellPrice: highLowPrice.price,
            stocksToBuy: stocksToBuy,
            profit: currentProfit,
            investAmount,
          };
        }
      }
    }

    return maxProfit;
  }
  findMaxProfitInEdges(
    historicalPrices: Array<number>,
    range: TimeRange,
    start: Date,
    end: Date,
    initialMaxProfit: MaxProfit,
    investAmount?: number,
  ): MaxProfit {
    let maxProfit = initialMaxProfit;
    let buyPoint: StockPrice =
      initialMaxProfit.buyTime != null
        ? {
            price: initialMaxProfit.buyPrice,
            time: initialMaxProfit.buyTime.getTime(),
          }
        : null;

    const startMs = performance.now();
    const startIndex = (start.getTime() - range.from.getTime()) / 1000;
    const endIndex = (end.getTime() - range.from.getTime()) / 1000;

    for (let i = startIndex; i <= endIndex; i++) {
      const priceAtTime = historicalPrices[i];

      if (buyPoint == null) {
        if (investAmount == null || investAmount > priceAtTime) {
          buyPoint = {
            price: priceAtTime,
            time: range.from.getTime() + i * 1000,
          };
        }
        continue;
      }

      if (priceAtTime < buyPoint.price) {
        buyPoint = {
          price: priceAtTime,
          time: range.from.getTime() + i * 1000,
        };
      }

      if (priceAtTime > buyPoint.price) {
        const stocksToBuy =
          investAmount != null ? Math.floor(investAmount / buyPoint.price) : 1;
        const currentProfit = new BigNumber(priceAtTime)
          .minus(buyPoint.price)
          .multipliedBy(stocksToBuy)
          .dp(2, BigNumber.ROUND_HALF_UP)
          .toNumber();
        if (currentProfit > maxProfit.profit) {
          maxProfit = {
            buyTime: new Date(buyPoint.time),
            buyPrice: buyPoint.price,
            sellTime: new Date(range.from.getTime() + i * 1000),
            sellPrice: priceAtTime,
            stocksToBuy: stocksToBuy,
            profit: currentProfit,
            investAmount,
          };
        }
      }
    }

    console.log(performance.now() - startMs);

    return maxProfit;
  }
}
