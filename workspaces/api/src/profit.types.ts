export type StockPrice = {
  price: number;
  time: number;
};

export type MaxProfit = {
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
