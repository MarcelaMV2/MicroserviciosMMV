const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./db'); 
const path = require('path');
const port = 3000;

const app = express();
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Página principal: listar contactos
app.get('/', (req, res) => {
  const query = 'SELECT * FROM agenda';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('index', { agenda: results });
  });
});

// Mostrar formulario para agregar contacto
app.get('/add', (req, res) => {
  res.render('add');
});

// Procesar formulario para agregar contacto
app.post('/add', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  const query = 'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nombres, apellidos, fecha_nacimiento, direccion, celular, correo], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});

// Mostrar formulario para editar contacto
app.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM agenda WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('edit', { data: results[0] });
  });
});

// Procesar formulario para editar contacto
app.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  const query = 'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?';
  db.query(query, [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});

// Eliminar contacto
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM agenda WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});

// Corregido: usar "port" en lugar de "PORT"
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
