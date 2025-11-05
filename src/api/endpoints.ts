import { http } from "./client";
import type { Table, Drink, Order, ID, Ingredient } from "../types/domain";

const API = (import.meta as any).env?.VITE_API_URL ?? "/api";

export const Api = {
  // Tables
  listTables: () => http<Table[]>(`${API}/tables`),
  reserveTable: (id: ID) =>
    http<Table>(`${API}/tables/${id}/reserve`, { method: "POST" }),

  // Menu / Drinks
  listDrinks: () => http<Drink[]>(`${API}/drinks`),

  // Orders
  getOrder: (id: ID) => http<Order>(`${API}/orders/${id}`),
  createOrder: (tableId: ID) =>
    http<Order>(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId })
    }),
  addToOrder: (orderId: ID, drinkId: ID, qty: number) =>
    http<Order>(`${API}/orders/${orderId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drinkId, quantity: qty })
    }),

  // Storage
  listIngredients: () => http<Ingredient[]>(`${API}/ingredients`),
  addStock: (id: ID, by: number) =>
    http<Ingredient>(`${API}/ingredients/${id}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: by })
    })
};
