const { sequelize, Empresa, Usuario } = require('./src/models');

const createTestData = async () => {
  console.log('Iniciando la creación de datos de prueba...');

  const t = await sequelize.transaction();

  try {
    // 1. Crear una empresa de prueba
    const [empresa, createdEmpresa] = await Empresa.findOrCreate({
      where: { nombre: 'Empresa Test' },
      defaults: { nombre: 'Empresa Test', activa: true },
      transaction: t,
    });

    if (createdEmpresa) {
      console.log(`Empresa "${empresa.nombre}" creada con ID: ${empresa.id}`);
    } else {
      console.log(`La empresa "${empresa.nombre}" ya existía.`);
    }

    // 2. Crear un usuario admin_empresa para esa empresa
    const adminEmail = 'admin@empresa-test.com';
    const [usuario, createdUsuario] = await Usuario.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        email: adminEmail,
        password: 'password123', // La contraseña se hasheará automáticamente por el hook del modelo
        rol: 'admin_empresa',
        empresaId: empresa.id,
      },
      transaction: t,
    });

    if (createdUsuario) {
      console.log(`Usuario administrador "${usuario.email}" creado.`);
    } else {
      console.log(`El usuario administrador "${usuario.email}" ya existía.`);
    }

    await t.commit();
    console.log('¡Datos de prueba creados exitosamente!');
  } catch (error) {
    await t.rollback();
    console.error('Error al crear los datos de prueba:', error);
  } finally {
    await sequelize.close();
  }
};

createTestData();