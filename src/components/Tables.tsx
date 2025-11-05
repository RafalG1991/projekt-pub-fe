import React, {useEffect, useState} from 'react';
import './Tables.css';
import OrderModal from "./OrderModal";
import {Loader} from "./Loader";
import {API, authFetch} from "../api/auth";

type TableRow = {
  table_id: number;
  table_number: number;
  capacity: number;
  lounge_id: number;
  lounge_name: string;
  table_status: "FREE" | "BUSY" | string;
};

const Tables = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);
  const [tablesData, setTablesData] = useState<{ tables: TableRow[] }>({ tables: [] });
  const [resStatus, setResStatus] = useState<Response | null>(null);
  const [order, setOrder] = useState([]);
  const [orderToggle, setOrderToggle] = useState(false);
  const [amount, setAmount] = useState(1);

  const amountInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  }
  const toggleOrder = () => {
    setOrderToggle(prevState => !prevState);
  }
  useEffect(() => {
    setIsLoading(true);
    // fetch('https://projekt-pub.onrender.com/lounge')
    authFetch(`${API}/lounge/tables`)
      .then(response => response.json())
      .then(r => {
        setIsLoading(false);
        setTablesData(r);
      });
  }, [resStatus]);
  const openOrder = async (status: string, tableNumber: number, customersNumber: number) => {
    if(status === 'FREE') {
      setIsLoading(true);
      const res = await authFetch(`${API}/order/open`, {
        method: 'POST',
        headers: {
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

  const closeOrder = async (status: string, tableNumber: number) => {
    if(status === 'BUSY') {
      setIsLoading(true);
      const res = await authFetch(`${API}/order/close`, {
        method: 'POST',
        headers: {
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

  const showOrder = async (status: string, tableNumber: number) => {
    if (status === 'BUSY') {
      setIsOrderLoading(true);
      authFetch(`${API}/order/show/${tableNumber}`)
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
        if (amount <= Number(table.capacity)) {
          return (
            <div key={table.table_id} className={`table-card ${table.table_status}`}
                 onClick={() => openOrder(table.table_status, table.table_id, amount)}>
              <div className="table-details">
                <h2 className="table-number">Table {table.table_number}</h2>
                <p className="table-capacity">Capacity: {table.capacity} people</p>
                <p className="table-status">{table.table_status}</p>
                {table.table_status === 'FREE' && (
                  <div className="reserve-message">Click to reserve</div>
                )}
              </div>
              <div className="table-buttons">
                {table.table_status === 'BUSY' ? <button type="button" className="table-button show-order-button" onClick={() => {
                  showOrder(table.table_status, table.table_id)
                  toggleOrder()
                }
                }>Show order</button> : ''}
                {table.table_status === 'BUSY' ?
                  <button type="button" className="table-button close-order-button"
                          onClick={() => closeOrder(table.table_status, table.table_id)}>Close order</button> : ''}
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