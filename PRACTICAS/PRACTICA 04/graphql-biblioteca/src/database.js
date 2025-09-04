require("reflect-metadata");
const { DataSource } = require("typeorm");
const Prestamo = require("./entity/Prestamo");
const Libro = require("./entity/Libro");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "SerCu05/M20.", // tu contraseña si tienes
  database: "graphql_biblioteca",
  synchronize: true,
  logging: false,
  entities: [Libro, Prestamo],
});

module.exports = { AppDataSource };
