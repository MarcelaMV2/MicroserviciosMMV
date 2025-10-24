const express = require("express");
const http = require("http");
const app = express();
const PORT = 4000;

let personas = [
  { id: 1, nombre: "Carlos", edad: 30 },
  { id: 2, nombre: "Ana", edad: 25 }
];

let metrics = {
  totalRequests: 0,
  successCount: 0,
  errorCount: 0,
  avgResponseTime: 0
};

// Middleware para medir tiempos y errores
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    metrics.totalRequests++;
    metrics.avgResponseTime = (metrics.avgResponseTime + duration) / 2;
    if (res.statusCode >= 400) metrics.errorCount++;
    else metrics.successCount++;
  });
  next();
});

// Rutas del microservicio
app.get("/personas", (req, res) => res.json(personas));

app.get("/personas/:id", (req, res) => {
  const persona = personas.find(p => p.id == req.params.id);
  if (!persona)
    return res.status(404).json({ error: "No encontrada" });
  res.json(persona);
});

app.get("/metrics", (req, res) => res.json(metrics));

// Simular error
app.get('/error', (req, res) => {
  metrics.totalRequests++;
  metrics.errorCount++;
  res.status(500).json({ error: 'Simulated error for monitoring' });
});

// Enviar métricas cada 5 segundos a Telegraf
setInterval(() => {
  const data = JSON.stringify(metrics);
  const options = {
    hostname: "telegraf", // nombre del contenedor
    port: 8080,
    path: "/metrics",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  };

  const req = http.request(options, res => {});
  req.on("error", err => {
    console.error("Error enviando métricas a Telegraf:", err.message);
  });
  req.write(data);
  req.end();
}, 5000);

app.listen(PORT, () => {
  console.log(`Microservicio corriendo en puerto ${PORT}`);
});
