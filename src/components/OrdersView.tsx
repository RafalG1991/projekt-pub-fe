import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import {Loader} from "./Loader";
import './OrdersView.css';
import {API, authFetch} from "../api/auth";

type OrderRow = any[]; // [id, table, customers, ..., total]
type OrdersResponse = { orders?: OrderRow[] };

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
      {isLoading ? <Loader /> : <table className="orders-table">
        <thead>
        <tr>
          <th>Order ID</th>
          <th>Table Number</th>
          <th>Number of Customers</th>
          <th>Ordered Items</th>
          <th>Bill</th>
          <th>Order Status</th>
        </tr>
        </thead>
        <tbody>
        {ordersData.orders?.map((order) => (
          <tr key={order[0]}>
            <td data-label="Order ID">{order[0]}</td>
            <td data-label="Table Number">{order[1]}</td>
            <td data-label="Number of Customers">{order[2]}</td>
            <td data-label="Ordered Items">{order[5]}</td>
            <td data-label="Bill">${order[4]}</td>
            <td data-label="Order Status">
                            <span className={`order-status ${order[3].toLowerCase()}`}>
                                {order[3]}
                            </span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>}
    </>
  );
}
