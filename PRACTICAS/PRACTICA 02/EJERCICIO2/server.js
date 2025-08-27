const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Configuración EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MySQL (servicio "mysql" definido en docker-compose)
const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "1234",
  database: "usuariosdb"
});

// Verificar conexión
db.connect(err => {
  if (err) {
    console.error("Error de conexión:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Ruta principal: listar usuarios
app.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) throw err;
    res.render("index", { usuarios: results });
  });
});

// Formulario para agregar usuario
app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const { nombre, correo } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre, correo, fecha_registro) VALUES (?, ?, NOW())",
    [nombre, correo],
    err => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Eliminar usuario
app.get("/delete/:id", (req, res) => {
  db.query("DELETE FROM usuarios WHERE id = ?", [req.params.id], err => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
