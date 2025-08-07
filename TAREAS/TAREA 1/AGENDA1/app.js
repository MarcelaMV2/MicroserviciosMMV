const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const bodyParser = require('body-parser');
const db = require('./db'); 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});