import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import OrdersAnalytics from "./OrdersAnalytics";
import {Loader} from "./Loader";
import './OrdersView.css';
import {API, authFetch} from "../api/auth";

type OrderItem = {
  items: string,
  order_id: number,
  order_time: string,
  status: "OPEN" | "CLOSED",
  table_id: number,
  total: number,
  customers_number: number,
  employee: string,
}
type OrdersResponse = { orders?: OrderItem[] };

export default function OrdersView() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ordersData, setOrdersData] = useState<OrdersResponse>({});

  useEffect(() => {
    setIsLoading(true);
    authFetch(`${API}/report/orders`)
      .then((r) => r.json())
      .then((r: OrdersResponse) => {
        setOrdersData(r);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Navigation/>
      <OrdersAnalytics />
      {isLoading ? <Loader /> : <table className="orders-table">
        <thead>
        <tr>
          <th>Order ID</th>
          <th>Table Number</th>
          <th>Number of Customers</th>
          <th>Order Date</th>
          <th>Ordered Items</th>
          <th>Employee</th>
          <th>Bill</th>
          <th>Order Status</th>
        </tr>
        </thead>
        <tbody>
        {ordersData.orders?.map((order) => (
          <tr key={order.order_id}>
            <td data-label="Order ID">{order.order_id}</td>
            <td data-label="Table Number">{order.table_id}</td>
            <td data-label="Number of Customers">{order.customers_number}</td>
            <td data-label="Order Date">{new Date(order.order_time).toLocaleString()}</td>
            <td data-label="Ordered Items">{order.items}</td>
            <td data-label="Employee">{order.employee}</td>
            <td data-label="Bill">${order.total}</td>
            <td data-label="Order Status">
                            <span className={`order-status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>}
    </>
  );
}
