const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/api/routes');
const { sequelize } = require('./src/models'); // Importar sequelize

const app = express();
const PORT = process.env.PORT || 3000;
// Rutas de la API
app.use('/api/v1', apiRoutes);

const startServer = async () => {
  try {
    await sequelize.sync(); // Sincroniza los modelos con la BD. En prod, usar migraciones.
    console.log('Conexión a la base de datos establecida.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

startServer();

