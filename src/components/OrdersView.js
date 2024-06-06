import React, {useEffect, useState} from 'react';
import Navigation from "./Navigation";
import {Loader} from "./Loader";

import './OrdersView.css';
const OrdersView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    // fetch('https://projekt-pub.onrender.com/report/orders')
    fetch('https://projekt-pub.onrender.com/report/orders')
      .then(response => response.json())
      .then(r => {
        setIsLoading(false);
        setOrdersData(r);
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
            <td data-label="Ordered Items">{order[3]}</td>
            <td data-label="Bill">${order[4].toFixed(2)}</td>
            <td data-label="Order Status">
                            <span className={`order-status ${order[5].toLowerCase()}`}>
                                {order[5]}
                            </span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>}
    </>
  );
}

export default OrdersView;