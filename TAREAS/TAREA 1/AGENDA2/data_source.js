const { DataSource } = require("typeorm");
const Agenda = require("./entity/agenda");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "SerCu05/M20.", 
  database: "bd_agenda",
  synchronize: true,
  logging: false,
  entities: [Agenda],
});

module.exports = AppDataSource;
