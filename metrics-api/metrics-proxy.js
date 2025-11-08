const express = require("express");
const app = express();

// Configuration centralisée
const CONFIG = {
  port: 4000,
  metricsPort: 9100,
  requestTimeout: 5000, // 5 secondes timeout
  thresholds: {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 70, critical: 85 },
    disk: { warning: 80, critical: 90 }
  }
};

// Liste de tes serveurs à surveiller
const servers = [
  { name: "ansible", ip: "98.84.200.201" },
  { name: "jenkins", ip: "184.73.163.15" }
];

// Fonction helper pour extraire une métrique
function extractMetric(text, pattern) {
  const match = text.match(pattern);
  return match ? parseFloat(match[1]) : null;
}

// Fonction pour calculer le CPU load en %
function calculateCpuLoad(text) {
  const loadMatch = text.match(/node_load1\s+([0-9.]+)/);
  const cpuCountMatches = text.match(/node_cpu_seconds_total{[^}]*mode="idle"[^}]*}/g);
  
  if (loadMatch && cpuCountMatches) {
    const loadValue = parseFloat(loadMatch[1]);
    const cpuCount = cpuCountMatches.length;
    return ((loadValue / cpuCount) * 100).toFixed(1);
  }
  return null;
}

// Fonction pour calculer la mémoire utilisée en %
function calculateMemoryUsage(text) {
  const memTotal = extractMetric(text, /node_memory_MemTotal_bytes\s+([0-9.]+)/);
  if (!memTotal) return null;

  // Priorité à MemAvailable (métrique moderne)
  let memAvail = extractMetric(text, /node_memory_MemAvailable_bytes\s+([0-9.]+)/);
  
  // Fallback pour anciens exporters
  if (!memAvail) {
    const memFree = extractMetric(text, /node_memory_MemFree_bytes\s+([0-9.]+)/) || 0;
    const memBuffers = extractMetric(text, /node_memory_Buffers_bytes\s+([0-9.]+)/) || 0;
    const memCached = extractMetric(text, /node_memory_Cached_bytes\s+([0-9.]+)/) || 0;
    memAvail = memFree + memBuffers + memCached;
  }

  const used = (100 - (memAvail / memTotal) * 100).toFixed(1);
  return Math.min(100, Math.max(0, parseFloat(used))).toFixed(1);
}

// Fonction pour calculer l'utilisation disque en %
function calculateDiskUsage(text) {
  const diskTotal = extractMetric(text, /node_filesystem_size_bytes{[^}]*mountpoint="\/"[^}]*}\s+([0-9.]+)/);
  const diskAvail = extractMetric(text, /node_filesystem_avail_bytes{[^}]*mountpoint="\/"[^}]*}\s+([0-9.]+)/);
  
  if (!diskTotal || !diskAvail) return null;

  const used = (100 - (diskAvail / diskTotal) * 100).toFixed(1);
  return Math.min(100, Math.max(0, parseFloat(used))).toFixed(1);
}

// Fonction pour déterminer l'état de santé
function determineHealth(cpuLoad, memUsed, diskUsed) {
  const cpu = parseFloat(cpuLoad) || 0;
  const mem = parseFloat(memUsed) || 0;
  const disk = parseFloat(diskUsed) || 0;

  const { thresholds } = CONFIG;

  if (
    cpu > thresholds.cpu.critical ||
    mem > thresholds.memory.critical ||
    disk > thresholds.disk.critical
  ) {
    return "Critical";
  }

  if (
    cpu > thresholds.cpu.warning ||
    mem > thresholds.memory.warning ||
    disk > thresholds.disk.warning
  ) {
    return "Warning";
  }

  return "Healthy";
}

// Fonction de parsing métriques avec gestion d'erreurs améliorée
async function getMetrics(server) {
  const startTime = Date.now();
  
  try {
    // Fetch avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);
    
    const res = await fetch(`http://${server.ip}:${CONFIG.metricsPort}/metrics`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    const responseTime = Date.now() - startTime;

    // Calcul des métriques
    const cpuLoad = calculateCpuLoad(text) || "N/A";
    const memUsed = calculateMemoryUsage(text) || "N/A";
    const diskUsed = calculateDiskUsage(text) || "N/A";
    const health = determineHealth(cpuLoad, memUsed, diskUsed);

    return {
      name: server.name,
      ip: server.ip,
      status: "online",
      cpu_load: cpuLoad,
      memory_used: memUsed,
      disk_used: diskUsed,
      health,
      response_time_ms: responseTime,
      timestamp: new Date().toISOString()
    };

  } catch (e) {
    const responseTime = Date.now() - startTime;
    
    // Gestion spécifique des erreurs
    let errorType = "unknown";
    let errorMessage = e.message;

    if (e.name === "AbortError") {
      errorType = "timeout";
      errorMessage = `Request timeout after ${CONFIG.requestTimeout}ms`;
    } else if (e.message.includes("fetch failed")) {
      errorType = "connection_failed";
      errorMessage = "Unable to connect to server";
    }

    return {
      name: server.name,
      ip: server.ip,
      status: "offline",
      error_type: errorType,
      error: errorMessage,
      response_time_ms: responseTime,
      timestamp: new Date().toISOString()
    };
  }
}

// Endpoint principal
app.get("/metrics", async (req, res) => {
  try {
    const results = await Promise.all(servers.map(getMetrics));
    
    // Statistiques globales
    const summary = {
      total_servers: servers.length,
      online: results.filter(r => r.status === "online").length,
      offline: results.filter(r => r.status === "offline").length,
      healthy: results.filter(r => r.health === "Healthy").length,
      warning: results.filter(r => r.health === "Warning").length,
      critical: results.filter(r => r.health === "Critical").length
    };

    res.json({
      summary,
      servers: results,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error in /metrics endpoint:", err);
    res.status(500).json({ 
      error: "Internal server error",
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint de santé du proxy lui-même
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint pour un serveur spécifique
app.get("/metrics/:serverName", async (req, res) => {
  const server = servers.find(s => s.name === req.params.serverName);
  
  if (!server) {
    return res.status(404).json({ 
      error: "Server not found",
      available_servers: servers.map(s => s.name)
    });
  }

  const result = await getMetrics(server);
  res.json(result);
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(CONFIG.port, () => {
  console.log(`Metrics proxy running on http://localhost:${CONFIG.port}/metrics`);
  console.log(`Monitoring ${servers.length} server(s):`);
  servers.forEach(s => console.log(`   - ${s.name} (${s.ip})`));
  console.log(`Endpoints available:`);
  console.log(`   - GET /metrics           (all servers)`);
  console.log(`   - GET /metrics/:name     (specific server)`);
  console.log(`   - GET /health            (proxy health)`);
});

// Gestion de l'arrêt propre
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received, shutting down gracefully...");
  process.exit(0);
});