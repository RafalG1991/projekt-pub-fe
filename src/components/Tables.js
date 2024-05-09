import React, {useEffect, useState} from 'react';
import './Tables.css';
import OrderModal from "./OrderModal";
const Tables = () => {
  const [tablesData, setTablesData] = useState([]);
  const [resStatus, setResStatus] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderToggle, setOrderToggle] = useState(false);
  const toggleOrder = () => {
    setOrderToggle(prevState => !prevState);
  }
  useEffect(() => {
    fetch('http://127.0.0.1:5000/lounge')
      .then(response => response.json())
      .then(r => {
        setTablesData(r);
      });
  }, [resStatus]);
  const openOrder = async (status, tableNumber, customersNumber) => {
    if(status === 'FREE') {
      const res = await fetch('http://127.0.0.1:5000/order/open', {
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
      setResStatus(res);
    }
  }

  const closeOrder = async (status, tableNumber) => {
    if(status === 'BUSY') {
      const res = await fetch('http://127.0.0.1:5000/order/close', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin':'origin',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber,
        }),
      });
      setResStatus(res);
    }
  }

  const showOrder = async (status, tableNumber) => {
    if (status === 'BUSY') {
      fetch(`http://127.0.0.1:5000/order/show/${tableNumber}`)
        .then(response => response.json())
        .then(r => {
          setOrder(r.order);
        });
    }
  }

  return (
    <div className="restaurant-tables-container">
      {tablesData.tables?.map((table) => (
          <div key={table[0]} className={`table-card ${table[3]}`} onClick={() => openOrder(table[3], table[0], 1)}>
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
        )
      )}
      {
        orderToggle && <OrderModal order={order} toggleOrder={toggleOrder}/>
      }
    </div>
  );
};
export default Tables;