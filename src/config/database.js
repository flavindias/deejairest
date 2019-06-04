// Configuração da aplicação.
'use strict';
const sequelize = require("sequelize");
const config = module.exports;
const Op = sequelize.Op;

config.debug = true;

var localConfig = {
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
        ssl:'Amazon RDS'
    },
    pool: {
        maxConnections: 8,
        maxIdleTime: 30
    },
    language: 'en'
}

config.db = {
    user: config.debug ? 'root' : process.env.AWS_RDS_DB_USER,
    password: config.debug ? '' : process.env.AWS_RDS_DB_PASSWORD,
    name: config.debug ? 'deejaidb' : process.env.AWS_RDS_DB_NAME
};

config.db.details = config.debug ? localConfig : awsConfig;

