require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/api/routes');
const { sequelize } = require('./src/models'); // Importar sequelize

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Rutas de la API
app.use('/api/v1', apiRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    // Sincroniza los modelos con la BD. En desarrollo, { alter: true } es útil para actualizar el esquema.
    await sequelize.sync({ alter: true }); // En producción, se recomienda usar migraciones en lugar de sync({ alter: true })
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

startServer();
