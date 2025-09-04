const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB"); // tu archivo de conexión TypeORM
const swaggerDocs = require("./swagger"); // configuración de Swagger

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde otros orígenes (ej. Flutter, React, etc.)
app.use(express.json()); // Para interpretar JSON en el body

// Conectar BD con TypeORM
connectDB();

// Importar rutas
const clientesRoutes = require("./routes/clientesRoute");
app.use("/api/clientes", clientesRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "Bienvenido a la API de Sistema de Ventas" });
});

// Swagger docs en /api-docs
swaggerDocs(app);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Levantar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
  console.log(`📄 Documentación en http://localhost:${port}/api-docs`);
});
