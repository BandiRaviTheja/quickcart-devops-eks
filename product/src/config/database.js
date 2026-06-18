const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    
    // USE THE SAME SSL CONFIG THAT WORKS
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Connected to PostgreSQL DB'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

module.exports = sequelize;