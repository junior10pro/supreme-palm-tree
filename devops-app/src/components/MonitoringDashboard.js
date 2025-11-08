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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ IP hardcodée - change ici si besoin
  const API_URL = "http://172.26.54.239:4000";

  const fetchData = async () => {
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/metrics`, {
        timeout: 10000,
      });
      setMetrics(res.data);
      setLoading(false);
    } catch (e) {
      console.error("API error:", e);
      
      let errorMsg = "Unable to fetch metrics";
      if (e.code === "ECONNABORTED") {
        errorMsg = "Request timeout - Server not responding";
      } else if (e.code === "ERR_NETWORK") {
        errorMsg = `Cannot connect to ${API_URL}`;
      } else if (e.response) {
        errorMsg = `Server error: ${e.response.status}`;
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "2rem",
        backgroundColor: "#fee2e2",
        borderRadius: "8px",
        margin: "2rem auto",
        maxWidth: "600px"
      }}>
        <h2 style={{ color: "#dc2626" }}>⚠️ Connection Error</h2>
        <p style={{ color: "#666" }}>{error}</p>
        <button 
          onClick={fetchData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          🔄 Retry
        </button>
        <p style={{ fontSize: "12px", color: "#999", marginTop: "1rem" }}>
          Trying to connect to: {API_URL}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "48px" }}>⏳</div>
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (!metrics) return null;

  const { summary, servers } = metrics;

  return (
    <div className="dashboard">
      <h1 className="title">Infrastructure Monitoring Dashboard</h1>

      {/* Status */}
      <div style={{ 
        textAlign: "center", 
        padding: "10px", 
        backgroundColor: "#d1fae5",
        color: "#065f46",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        ✅ Connected to {API_URL}
      </div>

      {/* Summary */}
      <section className="summary">
        <h2>Global Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">Total: {summary.total_servers}</div>
          <div className="summary-item" style={{ color: COLORS.online }}>
            Online: {summary.online}
          </div>
          <div className="summary-item" style={{ color: COLORS.offline }}>
            Offline: {summary.offline}
          </div>
          <div className="summary-item" style={{ color: COLORS.Healthy }}>
            Healthy: {summary.healthy}
          </div>
          <div className="summary-item" style={{ color: COLORS.Warning }}>
            Warning: {summary.warning}
          </div>
          <div className="summary-item" style={{ color: COLORS.Critical }}>
            Critical: {summary.critical}
          </div>
        </div>

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

      {/* Servers */}
      <section className="servers">
        <h2>Servers Detail</h2>
        <div className="server-grid">
          {servers.map((srv) => (
            <div key={srv.name} className="server-card">
              <h3>{srv.name} ({srv.ip})</h3>
              <p>
                Status:{" "}
                <strong style={{ color: COLORS[srv.status] }}>
                  {srv.status === "online" ? "🟢 Online" : "🔴 Offline"}
                </strong>
                {srv.health && (
                  <> | <span style={{ color: COLORS[srv.health] }}>{srv.health}</span></>
                )}
              </p>
              <p>Response: {srv.response_time_ms ?? "N/A"} ms</p>
              
              {srv.status === "online" ? (
                <div className="charts">
                  <MetricDonut label="CPU" value={srv.cpu_load} color="#3b82f6" />
                  <MetricDonut label="RAM" value={srv.memory_used} color="#f59e0b" />
                  <MetricDonut label="Disk" value={srv.disk_used} color="#22c55e" />
                </div>
              ) : (
                <div style={{ 
                  padding: "20px", 
                  textAlign: "center", 
                  color: "#999",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px"
                }}>
                  <p>⚠️ Server offline</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: "center", marginTop: "2rem", color: "#999" }}>
        Last update: {new Date(metrics.timestamp).toLocaleTimeString()}
      </footer>
    </div>
  );
}