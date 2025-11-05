export type ID = number | string;

export interface Table {
  id: ID;
  name?: string;
  capacity: number;
  isReserved: boolean;
}

export interface Ingredient {
  id: ID;
  name: string;
  stock: number;
  unit?: string;
  imageUrl?: string;
}

export interface DrinkIngredient {
  id: ID;
  name: string;
  amount: number;
  unit?: string;
}

export interface Drink {
  id: ID;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  ingredients?: DrinkIngredient[];
}

export type OrderStatus = "OPEN" | "PAID" | "CANCELLED";

export interface OrderItem {
  drinkId: ID;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: ID;
  tableId: ID;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO
}
