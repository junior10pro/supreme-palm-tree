import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

const COLORS = {
  Healthy: "#22c55e",
  Warning: "#facc15",
  Critical: "#ef4444",
  online: "#3b82f6",
  offline: "#9ca3af"
};

function MetricDonut({ label, value, color }) {
  const val = parseFloat(value);
  const data = [
    { name: "Used", value: val },
    { name: "Free", value: 100 - val }
  ];
  return (
    <div style={{ width: 120, height: 120 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={45}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <p style={{ textAlign: "center", fontWeight: 600, marginTop: -8 }}>
        {label}
      </p>
    </div>
  );
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://172.26.54.239:4000/metrics");
      setMetrics(res.data);
    } catch (e) {
      console.error("API error:", e.message);
      setMetrics(null);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading metrics...</p>;

  const { summary, servers } = metrics;

  return (
    <div className="dashboard">
      <h1 className="title">Infrastructure Monitoring Dashboard</h1>

      {/* === SUMMARY SECTION === */}
      <section className="summary">
        <h2>Global Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">Total servers: {summary.total_servers}</div>
          <div className="summary-item" style={{ color: COLORS.online }}>Online: {summary.online}</div>
          <div className="summary-item" style={{ color: COLORS.offline }}>Offline: {summary.offline}</div>
          <div className="summary-item" style={{ color: COLORS.Healthy }}>Healthy: {summary.healthy}</div>
          <div className="summary-item" style={{ color: COLORS.Warning }}>Warning: {summary.warning}</div>
          <div className="summary-item" style={{ color: COLORS.Critical }}>Critical: {summary.critical}</div>
        </div>

        {/* Bar chart global */}
        <div style={{ width: "100%", height: 300, marginTop: 20 }}>
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "CPU", value: summary.avg_cpu || 0 },
                { name: "Memory", value: summary.avg_memory || 0 },
                { name: "Disk", value: summary.avg_disk || 0 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Average %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* === SERVERS SECTION === */}
      <section className="servers">
        <h2>Servers Detail</h2>
        <div className="server-grid">
          {servers.map((srv) => (
            <div key={srv.name} className="server-card">
              <h3>
                {srv.name} ({srv.ip})
              </h3>
              <p>
                Status:{" "}
                <strong style={{ color: COLORS[srv.status] }}>{srv.status}</strong> |{" "}
                <span style={{ color: COLORS[srv.health] }}>{srv.health}</span>
              </p>
              <p>Response Time: {srv.response_time_ms ?? "N/A"} ms</p>
              <div className="charts">
                <MetricDonut label="CPU" value={srv.cpu_load} color="#3b82f6" />
                <MetricDonut label="RAM" value={srv.memory_used} color="#f59e0b" />
                <MetricDonut label="Disk" value={srv.disk_used} color="#22c55e" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>Last update : {new Date(metrics.timestamp).toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}
