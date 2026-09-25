const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/catsitter', {
  dialect: 'postgres',
  logging: false,
  host: 'localhost',
});

module.exports = sequelize;
