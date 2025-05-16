import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend
} from "recharts";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState([]);
  const [deviceStats, setDeviceStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = "ya29.a0AW4Xtxj2kCn-8q7AzAP3ljTJ_gfxS1i7r6RQQ-G59q1zaiAG4n3LQ3Shxz9hjGBuBhjHY6lWKdPY2vPnDPzUyT-WDjpioiFOQzsX68BSrpdQZAtQD7eBJHzBKVOj4C6juJM4GL79GAG_hq8kQ2WBTbHmnktDaud-N-HwBomLaCgYKAaASARYSFQHGX2Mi6GNFWAPAb2oSakI7nT05Eg0175";

      try {
        const response = await axios.post(
          "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fseoscientist.agency%2F/searchAnalytics/query",
          {
            startDate: "2025-04-01",
            endDate: "2025-05-01",
            dimensions: ["query", "date"],
            rowLimit: 10,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setData(response.data.rows || []);

        const deviceData = await axios.post(
          "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fseoscientist.agency%2F/searchAnalytics/query",
          {
            startDate: "2025-04-01",
            endDate: "2025-05-01",
            dimensions: ["device"],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const stats = {};
        (deviceData.data.rows || []).forEach(row => {
          stats[row.keys[0]] = row.clicks;
        });

        setDeviceStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const renderOverview = () => (
    <div className="content">
      <div className="card chart">
        <h2>Top 10 Queries</h2>
        <BarChart width={500} height={300} data={data}>
          <XAxis dataKey={row => row.keys[0]} angle={-30} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="clicks" fill="#4285F4" />
        </BarChart>
      </div>
      <div className="card chart">
        <h2>Device Breakdown</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={Object.entries(deviceStats).map(([key, value]) => ({ name: key.toUpperCase(), value }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {Object.keys(deviceStats).map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="table-wrapper">
      <h2>Search Analytics Table</h2>
      <table>
        <thead>
          <tr>
            <th>Query</th>
            <th>Date</th>
            <th>Clicks</th>
            <th>Impressions</th>
            <th>CTR</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.keys[0]}</td>
              <td>{row.keys[1]}</td>
              <td>{row.clicks}</td>
              <td>{row.impressions}</td>
              <td>{(row.ctr * 100).toFixed(2)}%</td>
              <td>{row.position.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>📊 Dashboard</h1>
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
          Overview
        </button>
        <button className={activeTab === "table" ? "active" : ""} onClick={() => setActiveTab("table")}>
          Table View
        </button>
      </aside>
      <main className="main">
        <header>
          <h2>Search Console Dashboard</h2>
        </header>
        {activeTab === "overview" ? renderOverview() : renderTable()}
      </main>
    </div>
  );
};

export default App;
