import { useEffect, useState } from "react";
import reportsApi from "../api/reportsApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line
} from "recharts";
import "./Reports.css";


export default function Report() {
  const [activeTab, setActiveTab] = useState("sales");
  const [data, setData] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const loadData = async () => {
    if (activeTab === "sales") {
      const res = await reportsApi.sales(start, end);
      setData(res.data);
    }
    if (activeTab === "rentals") {
      const res = await reportsApi.rentals(start, end);
      setData(res.data);
    }
    if (activeTab === "revenue") {
      const res = await reportsApi.revenue(start, end);
      setRevenue(res.data.total_revenue);
    }
    if (activeTab === "popularity") {
      const res = await reportsApi.popularity(start, end);
      setData(res.data);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const download = (promise, filename) => {
    promise.then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    });
  };

  return (
    <div>
      <h1>Reports</h1>

      {/* Tabs */}
      <div className="tab-container">
        <button onClick={() => setActiveTab("sales")} className={activeTab === "sales" ? "active" : ""}>Sales</button>
        <button onClick={() => setActiveTab("rentals")} className={activeTab === "rentals" ? "active" : ""}>Rentals</button>
        <button onClick={() => setActiveTab("revenue")} className={activeTab === "revenue" ? "active" : ""}>Revenue</button>
        <button onClick={() => setActiveTab("popularity")} className={activeTab === "popularity" ? "active" : ""}>Popularity</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input type="date" onChange={(e) => setStart(e.target.value)} />
        <input type="date" onChange={(e) => setEnd(e.target.value)} />
        <button onClick={loadData}>Filter</button>
      </div>

      {/* EXPORT BUTTONS */}
      <div className="exports">
        {activeTab === "sales" && (
          <>
            <button onClick={() => download(reportsApi.exportSalesExcel(), "sales.xlsx")}>Export Excel</button>
            <button onClick={() => download(reportsApi.exportSalesPDF(), "sales.pdf")}>Export PDF</button>
          </>
        )}

        {activeTab === "rentals" && (
          <>
            <button onClick={() => download(reportsApi.exportRentalsExcel(), "rentals.xlsx")}>Export Excel</button>
            <button onClick={() => download(reportsApi.exportRentalsPDF(), "rentals.pdf")}>Export PDF</button>
          </>
        )}

        {activeTab === "popularity" && (
          <>
            <button onClick={() => download(reportsApi.exportPopularityExcel(), "popularity.xlsx")}>Export Excel</button>
            <button onClick={() => download(reportsApi.exportPopularityPDF(), "popularity.pdf")}>Export PDF</button>
          </>
        )}
      </div>

      {/* SALES REPORT */}
{activeTab === "sales" && (
  <>
    <h2>Sales Report</h2>

    <div className="chart-card">
      {data.length === 0 ? (
        <p className="empty">No sales data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
          >
            <XAxis
              dataKey="book_title"
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>

    <div className="section-card">
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.book_title}>
              <td>{r.book_title}</td>
              <td>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}


    
      {/* RENTALS REPORT */}
{activeTab === "rentals" && (
  <>
    <h2>Rentals Report</h2>

    <div className="chart-card">
      {data.length === 0 ? (
        <p className="empty">No rental data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
          >
            <XAxis
              dataKey="book_title"
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>

    <div className="section-card">
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Total Rentals</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.book_title}>
              <td>{r.book_title}</td>
              <td>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}



      {/* REVENUE REPORT */}
      {activeTab === "revenue" && ( 
        <>
          <h2>Revenue Report</h2>

          <div className="card big">
            <h3>Total Revenue</h3>
            <p style={{ fontSize: "40px" }}>₹{revenue || 0}</p>
          </div>
        </>
      )}

      {/* POPULARITY REPORT */}
      {activeTab === "popularity" && (
        <>
          <h2>Book Popularity Report</h2>

          <LineChart width={700} height={350} data={data}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Line dataKey="total_activity" stroke="#ff8042" />
          </LineChart>

          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Purchases</th>
                <th>Rentals</th>
                <th>Total Activity</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => (
                <tr key={r.book_id}>
                  <td>{r.title}</td>
                  <td>{r.purchases}</td>
                  <td>{r.rentals}</td>
                  <td>{r.total_activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
