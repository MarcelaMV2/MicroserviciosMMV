const { createConnection } = require("typeorm");
const { Usuario } = require("./entity/Usuario");

const connectDB = async () => {
  try {
    const DB_HOST = 'localhost';  
    const DB_USER = 'root';       
    const DB_PASS = '123456'; 
    const DB_NAME = 'usuarios_db';

    await createConnection({
      type: "mysql",
      host: DB_HOST,
      port: 3306,
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,  
      entities: [Usuario],
      synchronize: true,  
    });

    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); 
  }
};

module.exports = connectDB;
