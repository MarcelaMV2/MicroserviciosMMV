const { DataSource } = require("typeorm");
const Medico = require("./entity/medico");

const dbConfig = {
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'bd_medicos',
    port: process.env.DB_PORT || 3307

};

const AppDataSource = new DataSource({
  type: "mysql",
  host: dbConfig.host, 
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: true,  
  logging: false,
  entities: [Medico],
});

module.exports = AppDataSource;
