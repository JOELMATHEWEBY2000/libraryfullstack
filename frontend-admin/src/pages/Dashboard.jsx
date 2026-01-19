import { useEffect, useState } from "react";
import dashboardApi from "../api/dashboardApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const [insights, setInsights] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [purchaseStats, setPurchaseStats] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [pendingReturns, setPendingReturns] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const insightsRes = await dashboardApi.getInsights();
        setInsights(insightsRes.data || {});

        const revenueRes = await dashboardApi.getRevenueChart();
        setRevenueData([
          { name: "Purchase", value: revenueRes.data.purchase_revenue },
          { name: "Rental", value: revenueRes.data.rental_revenue },
        ]);

        const purchaseRes = await dashboardApi.getPurchaseStats();
        setPurchaseStats(Array.isArray(purchaseRes.data) ? purchaseRes.data : []);

        const stockRes = await dashboardApi.getLowStock();
        setLowStock(Array.isArray(stockRes.data) ? stockRes.data : []);

        const pendingRes = await dashboardApi.getPendingReturns();
        setPendingReturns(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="dashboard">

      {/* ----------------- INSIGHT CARDS ----------------- */}
      <div className="cards">
  <div className="card">
    <div>
      <p className="card-title">Total Users</p>
      <span>{insights.total_users || 0}</span>
    </div>
  </div>

  <div className="card">
    <div>
      <p className="card-title">Total Books</p>
      <span>{insights.total_books || 0}</span>
    </div>
  </div>

  <div className="card">
    <div>
      <p className="card-title">Active Rentals</p>
      <span>{insights.active_rentals || 0}</span>
    </div>
  </div>

  <div className="card">
    <div>
      <p className="card-title">Revenue</p>
      <span>₹{insights.revenue || 0}</span>
    </div>
  </div>

  <div className="card">
    <div>
      <p className="card-title">Low Stock</p>
      <span>{insights.low_stock_count || 0}</span>
    </div>
  </div>

  <div className="card">
    <div>
      <p className="card-title">Pending Returns</p>
      <span>{insights.pending_returns || 0}</span>
    </div>
  </div>
</div>

      {/* ----------------- CHARTS GRID ----------------- */}
      <div className="chart-grid">

        <div className="section-card">
          <h3>Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card">
          <h3>Top 10 Purchased Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={purchaseStats}>
              <XAxis dataKey="book__title"  />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ----------------- TABLES GRID ----------------- */}
      <div className="table-grid">

        <div className="section-card">
          <h3>Low Stock Books</h3>
          <table>
            <thead>
              <tr><th>Title</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {lowStock.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td className="danger">{b.stock_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-card">
          <h3>Pending Returns</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Book</th>
                <th>Status</th>
                <th>Start</th>
                <th>Due</th>
                <th>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {pendingReturns.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.book}</td>
                  <td>{r.status}</td>
                  <td>{r.start_date}</td>
                  <td>{r.due_date}</td>
                  <td className="danger">{r.days_overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
