import React, {useEffect, useState} from 'react';
import './Tables.css';
import OrderModal from "./OrderModal";
import {Loader} from "./Loader";
const Tables = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [tablesData, setTablesData] = useState([]);
  const [resStatus, setResStatus] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderToggle, setOrderToggle] = useState(false);
  const [amount, setAmount] = useState(1);

  const amountInputHandler = event => {
    setAmount(event.target.value);
  }
  const toggleOrder = () => {
    setOrderToggle(prevState => !prevState);
  }
  useEffect(() => {
    setIsLoading(true);
    // fetch('https://projekt-pub.onrender.com/lounge')
    fetch('http://localhost:5000/lounge')
      .then(response => response.json())
      .then(r => {
        setIsLoading(false);
        setTablesData(r);
      });
  }, [resStatus]);
  const openOrder = async (status, tableNumber, customersNumber) => {
    if(status === 'FREE') {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/order/open', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin':'origin',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          tableNumber,
          customersNumber,
        }),
      });
      setIsLoading(false);
      setResStatus(res);
    }
  }

  const closeOrder = async (status, tableNumber) => {
    if(status === 'BUSY') {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/order/close', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin':'origin',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber,
        }),
      });
      setIsLoading(false);
      setResStatus(res);
    }
  }

  const showOrder = async (status, tableNumber) => {
    if (status === 'BUSY') {
      setIsOrderLoading(true);
      fetch(`http://localhost:5000/order/show/${tableNumber}`)
        .then(response => response.json())
        .then(r => {
          setIsOrderLoading(false);
          setOrder(r.order);
        });
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="restaurant-tables-container">
      <div className="guest-counter">
        <label htmlFor="amount">Number of guests: </label>
        <input
          id="amount"
          type="number"
          min="1"
          max="4"
          value={amount}
          onChange={amountInputHandler}
        />
      </div>
      {tablesData.tables?.map((table) => {
        if (amount <= Number(table[2])) {
          return (
            <div key={table[0]} className={`table-card ${table[3]}`}
                 onClick={() => openOrder(table[3], table[0], amount)}>
            <div className="table-details">
              <h2 className="table-number">Table {table[1]}</h2>
              <p className="table-capacity">Capacity: {table[2]} people</p>
              <p className="table-status">{table[3]}</p>
              {table[3] === 'FREE' && (
                <div className="reserve-message">Click to reserve</div>
              )}
            </div>
            <div className="table-buttons">
              {table[3] === 'BUSY' ? <button type="button" className="table-button show-order-button" onClick={() => {
                showOrder(table[3], table[0])
                toggleOrder()
              }
              }>Show order</button> : ''}
              {table[3] === 'BUSY' ?
                <button type="button" className="table-button close-order-button"
                        onClick={() => closeOrder(table[3], table[0])}>Close order</button> : ''}
            </div>
          </div>
        )}
      })}
      {
        orderToggle && <OrderModal order={order} toggleOrder={toggleOrder} isLoading={isOrderLoading}/>
      }
    </div>
  );
};
export default Tables;