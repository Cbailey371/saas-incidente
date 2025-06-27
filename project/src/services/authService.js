import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Realiza la petición de login al backend.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @param {string} [identificadorUnico] - El identificador único del dispositivo (opcional, para agentes).
 * @returns {Promise<Object>} La respuesta del servidor, que incluye el token.
 */
const login = async (email, password, identificadorUnico) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      identificadorUnico, // Enviar el identificador
    });
    return response.data; // Devuelve { token, dispositivoId }
  } catch (error) {
    // Asegurarnos de que siempre lanzamos un objeto Error con un mensaje útil.
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Error de red o servidor no responde.');
  }
};

export const authService = { login };