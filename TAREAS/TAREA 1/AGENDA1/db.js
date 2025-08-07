const mysql = require('mysql2');
// Configuración de la conexión
const connection = mysql.createConnection({
host: 'localhost',
user: 'root', 
password: 'SerCu05/M20.', 
database: 'bd_agenda' 
});
// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;