import { ProfitService } from './profit.service';
import { StockPrice } from './profit.types';

describe('ProfitService', () => {
  let profitService = new ProfitService();

  let profitTestData: Array<StockPrice> = [
    { price: 124.55, time: new Date(2020, 1, 2, 0, 13, 0) },
    { price: 124.56, time: new Date(2020, 1, 2, 0, 13, 1) },
    { price: 124.57, time: new Date(2020, 1, 2, 0, 13, 2) },
    { price: 124.56, time: new Date(2020, 1, 2, 0, 13, 3) },
    { price: 124.57, time: new Date(2020, 1, 2, 0, 13, 4) },
    { price: 124.58, time: new Date(2020, 1, 2, 0, 13, 5) },
    { price: 124.59, time: new Date(2020, 1, 2, 0, 13, 6) },
    { price: 124.6, time: new Date(2020, 1, 2, 0, 13, 7) }
  ];

  let noProfitTestData: Array<StockPrice> = [
    { price: 124.49, time: new Date(2020, 1, 2, 0, 13, 0) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 1) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 2) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 3) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 4) },
    { price: 124.47, time: new Date(2020, 1, 2, 0, 13, 5) },
    { price: 124.46, time: new Date(2020, 1, 2, 0, 13, 6) },
    { price: 124.45, time: new Date(2020, 1, 2, 0, 13, 7) }
  ];

  let maxProfitTestCases = [
    [
      'regular case',
      profitTestData[2].time,
      profitTestData[7].time,
      profitTestData[3],
      profitTestData[7],
    ],
    [
      'constraints',
      profitTestData[0].time,
      profitTestData[3].time,
      profitTestData[0],
      profitTestData[2],
    ],
    [
      'earliest and shortest',
      profitTestData[1].time,
      profitTestData[4].time,
      profitTestData[1],
      profitTestData[2],
    ],
  ];

  let noProfitTestCases = [
    ['with single element', noProfitTestData[0].time, noProfitTestData[0].time],
    ['with same prices', noProfitTestData[1].time, noProfitTestData[4].time],
    ['with declining prices', noProfitTestData[0].time, noProfitTestData[7].time],
  ];

  describe('findOptimalResult', () => {
    it.each(maxProfitTestCases)(
      'returns largest profit - %s',
      (
        testCase,
        startTime: Date,
        endTime: Date,
        buyPoint: StockPrice,
        sellPoint: StockPrice,
      ) => {
        const result = profitService.findOptimalResult(
          profitTestData,
          startTime,
          endTime,
        );

        expect(result.buyTime).toBe(buyPoint.time);
        expect(result.sellTime).toBe(sellPoint.time);
      },
    );

    it.each(noProfitTestCases)(
      'returns null %s',
      (testCase, startTime: Date, endTime: Date) => {
        const result = profitService.findOptimalResult(
          noProfitTestData,
          startTime,
          endTime,
        );

        expect(result).toBeNull();
      },
    );
  });
});
