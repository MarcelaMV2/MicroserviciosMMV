const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'userapp',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'db_usuarios',
    port: process.env.DB_PORT || 3306
//    user: 'userapp',
//    password: '12345',
//    database: 'db_usuarios',
//    port: 3307
};

app.get('/', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query('SELECT * FROM usuarios');
  await connection.end();
  res.render('index', { usuarios: rows });
});


app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { nombre, correo } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(
    'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)',
    [nombre, correo]
  );
  await connection.end();
  res.redirect('/');
});


app.get('/delete/:id', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
  await connection.end();
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
///stackoverflow en tecnologia puedo ver cual es el mas popular