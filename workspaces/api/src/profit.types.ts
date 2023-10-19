export type StockPrice = {
  price: number;
  time: Date;
};

export type MaxProfit = {
  buyTime: Date;
  sellTime: Date;
  profit: number;
  stocksToBuy: number;
  investAmount?: number | null;
};
