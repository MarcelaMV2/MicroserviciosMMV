require("reflect-metadata");
const { DataSource } = require("typeorm");
const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "SerCu05/M20.", // tu contraseña si tienes
  database: "graphql_practica",
  synchronize: true,
  logging: false,
  entities: [Mesa, Padron],
});

module.exports = { AppDataSource };
