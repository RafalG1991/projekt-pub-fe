import React, { useEffect, useState } from "react";
import { API, authFetch } from "../api/auth";
import "./OrdersAnalytics.css";

type Summary = {
  from: string;
  to: string;
  total_turnover: number;
  orders_count: number;
  avg_order_value: number;
};

type PopularItem = {
  drink_id: number;
  name: string;
  total_qty: number;
  revenue: number;
};

type PopularResponse = {
  from: string;
  to: string;
  items: PopularItem[];
};

const OrdersAnalytics: React.FC = () => {
  const [days, setDays] = useState<number>(7);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [popular, setPopular] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (rangeDays: number) => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, pRes] = await Promise.all([
        authFetch(`${API}/report/summary?days=${rangeDays}`),
        authFetch(`${API}/report/popular-items?days=${rangeDays}&limit=5`),
      ]);

      if (!sRes.ok) throw new Error(`Summary error: ${sRes.status}`);
      if (!pRes.ok) throw new Error(`Popular items error: ${pRes.status}`);

      const sData: Summary = await sRes.json();
      const pData: PopularResponse = await pRes.json();

      setSummary(sData);
      setPopular(pData.items || []);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  return (
    <div className="orders-analytics">
      <div className="orders-analytics-header">
        <h2>Analytics</h2>
        <div className="orders-analytics-range">
          <span>Range:</span>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={1}>Today</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading analytics...</p>}
      {error && <p className="orders-analytics-error">Error: {error}</p>}

      {!loading && !error && summary && (
        <>
          <div className="orders-analytics-cards">
            <div className="analytics-card">
              <h3>Turnover</h3>
              <p className="analytics-value">
                {summary.total_turnover.toFixed(2)} zł
              </p>
              <span className="analytics-sub">
                From {summary.from} to {summary.to}
              </span>
            </div>
            <div className="analytics-card">
              <h3>Orders</h3>
              <p className="analytics-value">{summary.orders_count}</p>
              <span className="analytics-sub">Number of orders</span>
            </div>
            <div className="analytics-card">
              <h3>Avg order</h3>
              <p className="analytics-value">
                {summary.avg_order_value.toFixed(2)} zł
              </p>
              <span className="analytics-sub">Average order value</span>
            </div>
          </div>

          <div className="orders-analytics-table">
            <h3>Most popular items</h3>
            {popular.length === 0 ? (
              <p>No data in selected range.</p>
            ) : (
              <table>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Turnover</th>
                </tr>
                </thead>
                <tbody>
                {popular.map((item, idx) => (
                  <tr key={item.drink_id}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.total_qty}</td>
                    <td>{item.revenue.toFixed(2)} zł</td>
                  </tr>
                ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersAnalytics;