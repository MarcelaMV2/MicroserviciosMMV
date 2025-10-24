const express = require('express');
const net = require('net');
const winston = require('winston');
const app = express();
const PORT = 3000;

app.use(express.json());

// === Conexión a Logstash con reintento ===
let logstashStream = null;
function connectLogstash(retries = 10) {
  console.log(`Intentando conectar a Logstash (${retries} intentos restantes)...`);
  const client = net.createConnection({ host: 'logstash', port: 5044 }, () => {
    console.log('Conectado a Logstash');
    logstashStream = client;
    sendToLogstash({ level: "info", message: "Log de prueba desde microservicio", route: "startup", statusCode: 200 });
  });
  client.on('error', (err) => {
    console.error('Error stream logstash:', err.message);
    if (retries > 0) setTimeout(() => connectLogstash(retries - 1), 10000);
  });
}
connectLogstash();

// === Logger local ===
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

// === Helper para enviar logs a Logstash ===
function sendToLogstash(obj) {
  if (logstashStream && !logstashStream.destroyed) {
    try {
      logstashStream.write(JSON.stringify(obj) + '\n');
    } catch (err) {
      console.error('No se pudo enviar a Logstash:', err.message);
    }
  }
}

// === Base de datos simulada ===
let personas = [
  { id: 1, nombre: "Carlos", edad: 30 },
  { id: 2, nombre: "Ana", edad: 25 }
];

// === Rutas ===
app.get('/personas', (req, res) => {
  const msg = 'Consulta de todas las personas';
  logger.info(msg);
  sendToLogstash({ level: 'info', route: '/personas', statusCode: 200, message: msg, personas_count: personas.length });
  res.json(personas);
});

app.get('/personas/:id', (req, res) => {
  const persona = personas.find(p => p.id == req.params.id);
  if (!persona) {
    const msg = `Persona con ID ${req.params.id} no encontrada`;
    logger.warn(msg);
    sendToLogstash({ level: 'warn', route: `/personas/${req.params.id}`, statusCode: 404, message: msg });
    return res.status(404).json({ error: 'No encontrada' });
  }
  const msg = `Persona encontrada: ${persona.nombre}`;
  logger.info(msg);
  sendToLogstash({ level: 'info', route: `/personas/${req.params.id}`, statusCode: 200, message: msg });
  res.json(persona);
});

app.post('/personas', (req, res) => {
  const nueva = req.body;
  if (!nueva || !nueva.id || !nueva.nombre) {
    const msg = 'Payload inválido al crear persona';
    logger.error(msg);
    sendToLogstash({ level: 'error', route: '/personas', statusCode: 400, message: msg, payload: nueva });
    return res.status(400).json({ error: 'Payload inválido' });
  }
  personas.push(nueva);
  const msg = `Nueva persona agregada: ${nueva.nombre}`;
  logger.info(msg);
  sendToLogstash({ level: 'info', route: '/personas', statusCode: 201, message: msg, persona: nueva });
  res.status(201).json(nueva);
});

app.get('/health', (req, res) => {
  const msg = 'Health check OK';
  logger.info(msg);
  sendToLogstash({ level: 'info', route: '/health', statusCode: 200, message: msg });
  res.json({ status: 'ok' });
});

app.get('/error', (req, res) => {
  const msg = 'Error intencional generado para prueba';
  logger.error(msg);
  sendToLogstash({ level: 'error', route: '/error', statusCode: 500, message: msg });
  res.status(500).json({ error: msg });
});

app.get('/warn', (req, res) => {
  const msg = 'Advertencia: conexión lenta simulada';
  logger.warn(msg);
  sendToLogstash({ level: 'warn', route: '/warn', statusCode: 200, message: msg });
  res.json({ warning: msg });
});

// === Inicio del servidor ===
app.listen(PORT, () => {
  const msg = `Microservicio corriendo en puerto ${PORT}`;
  logger.info(msg);
  sendToLogstash({ level: 'info', route: 'startup', statusCode: 200, message: msg });
});
