export type ID = number | string;

export type BasketItem = {
  id: number;
  name: string;
  price: number;
  amount: number;
};

export type DrinkItem = {
  id: number;
  name: string;
  price: number;
};

export type OrderRow = any[];
export type SuppliesRow = any[];
