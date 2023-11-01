export type StockPrice = {
  price: number;
  time: number;
};

export type MaxProfit = {
  buyPrice: number;
  sellPrice: number;
  buyTime: Date;
  sellTime: Date;
  profit: number;
  stocksToBuy: number;
  investAmount?: number | null;
};

export type TimeRange = {
  from: Date;
  to: Date;
};

export type HighLow = {
  from: number;
  to: number;
  low: StockPrice;
  high: StockPrice;
};
