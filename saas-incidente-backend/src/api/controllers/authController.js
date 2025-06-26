const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Usuario, Dispositivo, Licencia } = require('../../models');

exports.login = async (req, res) => {
  // 1. Validar la entrada
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, identificadorUnico } = req.body;

  try {
    // 2. Buscar el usuario por email
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    let dispositivoId = null;
    // 4. Lógica específica para el rol 'agente'
    if (usuario.rol === 'agente') {
      if (!identificadorUnico) {
        return res.status(400).json({ message: 'El identificador del dispositivo es requerido para los agentes.' });
      }

      // Validar que el dispositivo esté registrado y tenga una licencia activa
      const dispositivo = await Dispositivo.findOne({
        where: {
          identificadorUnico: identificadorUnico,
          empresaId: usuario.empresaId
        },
        include: { model: Licencia } // Incluimos la licencia para verificar su estado
      });

      if (!dispositivo) {
        return res.status(404).json({ message: 'Dispositivo no registrado para esta empresa.' });
      }

      if (!dispositivo.Licencia || dispositivo.Licencia.status !== 'activa') {
        return res.status(403).json({ message: 'El dispositivo no tiene una licencia activa.' });
      }
      dispositivoId = dispositivo.id;
    }

    // 5. Generar el JWT
    const payload = {
      userId: usuario.id,
      rol: usuario.rol,
      empresaId: usuario.empresaId, // Incluir el ID de la empresa en el token
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }); // Expiración más larga para móvil

    res.status(200).json({
      token,
      dispositivoId, // Se devuelve el ID del dispositivo validado
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });

