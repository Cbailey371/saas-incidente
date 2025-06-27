const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT en las solicitudes.
 * Adjunta los datos del usuario decodificados (userId, rol, empresaId) a req.user.
 */
exports.verifyToken = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1]; // Espera el formato "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Formato de token inválido.' });
  }

  try {
    // Verificar el token usando la clave secreta del entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adjuntar los datos del usuario decodificados al objeto de solicitud
    req.user = decoded; // Ahora puedes acceder a req.user.userId, req.user.rol, req.user.empresaId
    next(); // Continuar con la siguiente función de middleware/ruta
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    res.status(403).json({ message: 'Token inválido.' });
  }
};

/**
 * Middleware para verificar si el usuario autenticado tiene uno de los roles permitidos.
 * @param {Array<string>} allowedRoles - Un array de roles permitidos (ej. ['admin_empresa', 'agente']).
 */
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado. No tiene el rol necesario para esta acción.' });
    }
    next();
  };
};