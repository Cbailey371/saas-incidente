require('dotenv').config(); // Asegúrate de tener dotenv instalado y configurado

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres'
  },
  // ... otros entornos
};
