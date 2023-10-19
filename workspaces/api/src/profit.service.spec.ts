import { ProfitService } from './profit.service';
import { StockPrice } from './profit.types';

describe('ProfitService', () => {
  const profitService = new ProfitService();

  const profitTestData: Array<StockPrice> = [
    { price: 124.55, time: new Date(2020, 1, 2, 0, 13, 0) },
    { price: 124.56, time: new Date(2020, 1, 2, 0, 13, 1) },
    { price: 124.57, time: new Date(2020, 1, 2, 0, 13, 2) },
    { price: 124.56, time: new Date(2020, 1, 2, 0, 13, 3) },
    { price: 124.57, time: new Date(2020, 1, 2, 0, 13, 4) },
    { price: 124.58, time: new Date(2020, 1, 2, 0, 13, 5) },
    { price: 124.59, time: new Date(2020, 1, 2, 0, 13, 6) },
    { price: 124.6, time: new Date(2020, 1, 2, 0, 13, 7) },
  ];

  const noProfitTestData: Array<StockPrice> = [
    { price: 124.49, time: new Date(2020, 1, 2, 0, 13, 0) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 1) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 2) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 3) },
    { price: 124.48, time: new Date(2020, 1, 2, 0, 13, 4) },
    { price: 124.47, time: new Date(2020, 1, 2, 0, 13, 5) },
    { price: 124.46, time: new Date(2020, 1, 2, 0, 13, 6) },
    { price: 124.45, time: new Date(2020, 1, 2, 0, 13, 7) },
  ];

  const investAmountTestData: Array<StockPrice> = [
    { price: 33.55, time: new Date(2020, 1, 2, 0, 13, 0) },
    { price: 31.56, time: new Date(2020, 1, 2, 0, 13, 1) },
    { price: 32.57, time: new Date(2020, 1, 2, 0, 13, 2) },
    { price: 34.59, time: new Date(2020, 1, 2, 0, 13, 3) },
    { price: 35.6, time: new Date(2020, 1, 2, 0, 13, 4) },
    { price: 124.20, time: new Date(2020, 1, 2, 0, 13, 5) },
    { price: 124.30, time: new Date(2020, 1, 2, 0, 13, 6) },
    { price: 124.40, time: new Date(2020, 1, 2, 0, 13, 7) },
    { price: 124.50, time: new Date(2020, 1, 2, 0, 13, 8) }
  ];

  const maxProfitTestCases = [
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

  const noProfitTestCases = [
    ['with single element', noProfitTestData[0].time, noProfitTestData[0].time],
    ['with same prices', noProfitTestData[1].time, noProfitTestData[4].time],
    [
      'with declining prices',
      noProfitTestData[0].time,
      noProfitTestData[7].time,
    ],
  ];

  
  const investAmountTestCases = [
    [
      'no invest amount',
      investAmountTestData[0].time,
      investAmountTestData[8].time,
      investAmountTestData[1],
      investAmountTestData[8],
      investAmountTestData[8].price - investAmountTestData[1].price,
      null,
      ],
      [
        'with invest amount',
        investAmountTestData[0].time,
        investAmountTestData[8].time,
        investAmountTestData[1],
        investAmountTestData[8],
        278.82,
        124.23,
      ],
    [
      'with invest amount which is not enought at all',
      investAmountTestData[0].time,
      investAmountTestData[8].time,
      null,
      null,
      0,
      15
    ],
  ];


  describe('findOptimalResult', () => {
    it.each(maxProfitTestCases)(
      'returns largest profit - %s',
      (
        testCase,
        startTime: Date,
        endTime: Date,
        buyPoint: StockPrice,
        sellPoint: StockPrice
      ) => {
        const result = profitService.findOptimalResult(
          profitTestData,
          startTime,
          endTime,
          null,
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
          null,
        );

        expect(result.profit).toBe(0);
        expect(result.buyTime).toBeNull();
        expect(result.sellTime).toBeNull();
      },
    );

    it.each(investAmountTestCases)(
      'returns largest profit based on invest amount - %s',
      (
        testCase,
        startTime: Date,
        endTime: Date,
        buyPoint: StockPrice | null,
        sellPoint: StockPrice | null,
        maxProfit: number | null,
        investAmount: number | null
      ) => {
        const result = profitService.findOptimalResult(
          investAmountTestData,
          startTime,
          endTime,
          investAmount,
        );

        expect(result.profit).toBe(maxProfit);
        expect(result.buyTime).toBe(buyPoint?.time ?? null);
        expect(result.sellTime).toBe(sellPoint?.time ?? null);
      },
    );
  });
});
