// Configuração da aplicação.
'use strict';
const sequelize = require("sequelize");
const config = module.exports;
const Op = sequelize.Op;

config.debug = true;

var localConfig = {
    // host: process.env.DB_HOST,
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: Op,
    pool: {
        max: 5,
        min: 0,
        idle: 40000,
        acquire: 40000
    }
}

var awsConfig = {
    host: process.env.AWS_RDS_DB_HOST,
    port: process.env.AWS_RDS_DB_PORT,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    operatorsAliases: Op, // use Sequelize.Op
    dialectOptions: {
        ssl: 'Amazon RDS'
    },
    pool: {
        maxConnections: 8,
        maxIdleTime: 30
    },
    language: 'en'
}

config.db = {
    // user: process.env.DB_USER,
    user: 'root',
    // password: process.env.DB_PASSWORD,
    password: '',
    // name: process.env.DB_NAME
    name: 'deejaidb'
};




config.db.details = config.debug ? localConfig : awsConfig;


config.keys = {
    crypto: process.env.DATABASE_CRYPTO,
    secret: process.env.DATABASE_SECRET,

};
