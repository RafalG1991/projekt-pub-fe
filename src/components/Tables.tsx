import React, {useEffect, useState} from 'react';
import './Tables.css';
import OrderModal from "./OrderModal";
import {Loader} from "./Loader";
import {API, authFetch} from "../api/auth";
import {useAuth} from "../auth/AuthContext";
import { io, Socket } from "socket.io-client";


type TableRow = {
  table_id: number;
  table_number: number;
  capacity: number;
  lounge_id: number;
  lounge_name: string;
  table_status: "FREE" | "BUSY" | string;
};

type Lounge = { lounge_id: number; name: string };

const Tables = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);
  const [tablesData, setTablesData] = useState<{ tables: TableRow[] }>({ tables: [] });
  const [resStatus, setResStatus] = useState<Response | null>(null);
  const [order, setOrder] = useState([]);
  const [orderToggle, setOrderToggle] = useState(false);
  const [amount, setAmount] = useState(1);
  const { user } = useAuth();

  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [activeLounge, setActiveLounge] = useState<number | 'all'>('all');

  const amountInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  }
  const toggleOrder = () => {
    setOrderToggle(prevState => !prevState);
  }
  useEffect(() => {
    authFetch(`${API}/lounge/areas`)
      .then(r => r.json())
      .then((r: { lounges: Lounge[] }) => setLounges(r.lounges));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const url =
      activeLounge === 'all'
        ? `${API}/lounge/tables`
        : `${API}/lounge/tables/by-area/${activeLounge}`;
    // fetch('https://projekt-pub.onrender.com/lounge')
    authFetch(url)
      .then(response => response.json())
      .then(r => {
        setIsLoading(false);
        setTablesData(r);
      });
  }, [resStatus, activeLounge]);

  useEffect(() => {
    const socket: Socket = io(API, {
      transports: ["polling"],   // 👈 tylko long-polling, bez websocket
    });

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("table_updated", (payload: any) => {
      console.log("table_updated", payload);

      setTablesData(prev => {
        if (!prev || !prev.tables) return prev;

        return {
          tables: prev.tables.map(t =>
            t.table_id === payload.table_id
              ? { ...t, table_status: payload.table_status as any }
              : t
          ),
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [activeLounge]);

  const openOrder = async (status: string, tableNumber: number, customersNumber: number, employeeId: number) => {
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
          employeeId,
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

  const confirmOrder = async (status: string, tableId: number, employeeId: number) => {
    if (status === 'PENDING') {
      setIsLoading(true);
      const res = await authFetch(`${API}/order/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, employeeId }),
      });
      setIsLoading(false);
      setResStatus(res);
    }
  };

  const rejectOrder = async (status: string, tableId: number, employeeId: number) => {
    if (status === 'PENDING') {
      setIsLoading(true);
      const res = await authFetch(`${API}/order/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, employeeId }),
      });
      setIsLoading(false);
      setResStatus(res);
    }
  };

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="restaurant-tables-container">
      <div className="toolbar">
        <div className="lounge-filter">
          <label htmlFor="lounge">Area: </label>
          <select
            id="lounge"
            value={activeLounge === 'all' ? 'all' : String(activeLounge)}
            onChange={e => {
              const v = e.target.value;
              setActiveLounge(v === 'all' ? 'all' : Number(v));
            }}
          >
            <option value="all">All areas</option>
            {lounges.map(l => (
              <option key={l.lounge_id} value={l.lounge_id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="guest-counter">
          <label htmlFor="amount">Number of guests: </label>
          <input id="amount" type="number" min="1" max="4" value={amount} onChange={amountInputHandler}/>
        </div>
      </div>
      {tablesData.tables
        .filter(t => amount <= Number(t.capacity))
        .map((table) => (
            <div key={table.table_id} className={`table-card ${table.table_status}`}
                 onClick={() => openOrder(table.table_status, table.table_id, amount, user!.id)}>
              <div className="table-details">
                <h2 className="table-number">Table {table.table_number}</h2>
                <p className="table-capacity">Capacity: {table.capacity} people</p>
                <p className="table-status">{table.table_status}</p>
                {table.table_status === 'FREE' && (
                  <div className="reserve-message">Click to reserve</div>
                )}
              </div>
              <div className="table-buttons">
                {table.table_status === 'BUSY' ?
                  <button type="button" className="table-button show-order-button" onClick={() => {
                    showOrder(table.table_status, table.table_id)
                    toggleOrder()
                  }
                  }>Show order</button> : ''}
                {table.table_status === 'BUSY' ?
                  <button type="button" className="table-button close-order-button"
                          onClick={() => closeOrder(table.table_status, table.table_id)}>Close order</button> : ''}
                {table.table_status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      className="table-button show-order-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmOrder(table.table_status, table.table_id, user!.id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="table-button close-order-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rejectOrder(table.table_status, table.table_id, user!.id);
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}
      {
        orderToggle && <OrderModal order={order} toggleOrder={toggleOrder} isLoading={isOrderLoading}/>
      }
    </div>
  );
};
export default Tables;