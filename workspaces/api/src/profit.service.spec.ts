import { ProfitService } from './profit.service';
import { StockPrice, TimeRange } from './profit.types';

const createDate = (year, month, day, hours, minutes, seconds) => new Date(year, month, day, hours, minutes, seconds).getTime();

const getPrices = (historicalData: Array<StockPrice>): Array<number> => historicalData.map(h => h.price); 
const getRange = (historicalData: Array<StockPrice>): TimeRange => ({from: new Date(historicalData[0].time), to: new Date(historicalData.at(-1).time)})

describe('ProfitService', () => {
  const profitService = new ProfitService();

  const profitTestData: Array<StockPrice> = [
    { price: 124.55, time: createDate(2020, 1, 2, 0, 13, 0) },
    { price: 124.56, time: createDate(2020, 1, 2, 0, 13, 1) },
    { price: 124.57, time: createDate(2020, 1, 2, 0, 13, 2) },
    { price: 124.56, time: createDate(2020, 1, 2, 0, 13, 3) },
    { price: 124.57, time: createDate(2020, 1, 2, 0, 13, 4) },
    { price: 124.58, time: createDate(2020, 1, 2, 0, 13, 5) },
    { price: 124.59, time: createDate(2020, 1, 2, 0, 13, 6) },
    { price: 124.6, time: createDate(2020, 1, 2, 0, 13, 7) },
  ];

  const noProfitTestData: Array<StockPrice> = [
    { price: 124.49, time: createDate(2020, 1, 2, 0, 13, 0) },
    { price: 124.48, time: createDate(2020, 1, 2, 0, 13, 1) },
    { price: 124.48, time: createDate(2020, 1, 2, 0, 13, 2) },
    { price: 124.48, time: createDate(2020, 1, 2, 0, 13, 3) },
    { price: 124.48, time: createDate(2020, 1, 2, 0, 13, 4) },
    { price: 124.47, time: createDate(2020, 1, 2, 0, 13, 5) },
    { price: 124.46, time: createDate(2020, 1, 2, 0, 13, 6) },
    { price: 124.45, time: createDate(2020, 1, 2, 0, 13, 7) },
  ];

  const investAmountTestData: Array<StockPrice> = [
    { price: 124.20, time: createDate(2020, 1, 2, 0, 13, 0) },
    { price: 125.20, time: createDate(2020, 1, 2, 0, 13, 1) },
    { price: 126.20, time: createDate(2020, 1, 2, 0, 13, 2) },
    { price: 127.20, time: createDate(2020, 1, 2, 0, 13, 3) },
    { price: 31.55, time: createDate(2020, 1, 2, 0, 13, 4) },
    { price: 32.55, time: createDate(2020, 1, 2, 0, 13, 5) },
    { price: 33.55, time: createDate(2020, 1, 2, 0, 13, 6) },
    { price: 34.55, time: createDate(2020, 1, 2, 0, 13, 7) },
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
      investAmountTestData[7].time,
      investAmountTestData[0],
      investAmountTestData[3],
      investAmountTestData[3].price - investAmountTestData[0].price,
      null,
    ],
    [
      'with invest amount',
      investAmountTestData[0].time,
      investAmountTestData[7].time,
      investAmountTestData[4],
      investAmountTestData[7],
      9,
      124.20,
    ],
    [
      'with invest amount which is not enought at all',
      investAmountTestData[0].time,
      investAmountTestData[7].time,
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
        startTime: number,
        endTime: number,
        buyPoint: StockPrice,
        sellPoint: StockPrice
      ) => {
        const result = profitService.findOptimalResult(
          getPrices(profitTestData),
          getRange(noProfitTestData),
          new Date(startTime),
          new Date(endTime),
          null,
        );

        expect(result.buyTime).toStrictEqual(new Date(buyPoint.time));
        expect(result.sellTime).toStrictEqual(new Date(sellPoint.time));
      },
    );

    it.each(noProfitTestCases)(
      'returns null %s',
      (testCase, startTime: number, endTime: number) => {
        const result = profitService.findOptimalResult(
          getPrices(noProfitTestData),
          getRange(noProfitTestData),
          new Date(startTime),
          new Date(endTime),
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
        startTime: number,
        endTime: number,
        buyPoint: StockPrice | null,
        sellPoint: StockPrice | null,
        maxProfit: number | null,
        investAmount: number | null
      ) => {
        const result = profitService.findOptimalResult(
          getPrices(investAmountTestData),
          getRange(noProfitTestData),
          new Date(startTime),
          new Date(endTime),
          investAmount,
        );

        expect(result.profit).toBe(maxProfit);
        expect(result.buyTime).toStrictEqual(buyPoint ? new Date(buyPoint.time) : null);
        expect(result.sellTime).toStrictEqual(sellPoint ? new Date(sellPoint.time) : null);
      },
    );
  });
});
