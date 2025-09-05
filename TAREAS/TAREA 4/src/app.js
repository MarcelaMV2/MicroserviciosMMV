require("dotenv").config();
const express = require("express");

const connectDB = require("./database");
const clienteRoutes  = require("./routes/clienteRoutes");
const productoRoutes = require("./routes/productoRoutes")
const facturaRoutes = require("./routes/facturaRoutes")
const detalleFacturaRoutes = require("./routes/detalleFacturaRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
//const port = process.env.PORT || 3000;
const path = require("path");

// Configuracion de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//definir rutas
app.use("/clientes", clienteRoutes);
app.use("/api/clientes", clienteRoutes);
//definir rutas
app.use("/productos", productoRoutes);
app.use("/api/productos", productoRoutes);
//definir rutas
app.use("/facturas", facturaRoutes);
app.use("/api/facturas", facturaRoutes);
//definir rutas
app.use("/detalles", detalleFacturaRoutes);
//app.use("/api/detalle", facturaRoutes);



// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Clientes",
      version: "1.0.0",
      description: "Documentación de la API de Clientes con Node.js y TypeORM",
    },
    servers: [{ url: "http://localhost:3000", description: "Servidor Local" }],
  },
  apis: [path.join(__dirname, "routes/*.js")]
  //apis: ["./routes/*.js"], // Cargar todas las rutas
};
console.log(swaggerOptions);
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
  });
