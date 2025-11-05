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

export type OrderRow = any[];     // na razie — backend zwraca krotki/arraye
export type SuppliesRow = any[];  // jw. (np. [id, name, qty, unit] itp.)
