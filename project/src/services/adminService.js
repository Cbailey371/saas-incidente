import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

/**
 * Obtiene el resumen de licencias por empresa.
 * @param {string} token - El JWT del administrador global.
 * @returns {Promise<Array>} Lista con el resumen de licencias por empresa.
 */
const getLicenciaSummary = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/licencias/summary`, config);
  return response.data;
};

/**
 * Obtiene la lista de todas las empresas.
 * @param {string} token - El JWT del administrador global.
 * @returns {Promise<Array>} Lista de empresas.
 */
const getEmpresas = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_BASE_URL}/empresas`, config);
  return response.data.empresas; // El backend devuelve { message, empresas }
};

/**
 * Activa o desactiva una empresa.
 * @param {string} id - El ID de la empresa a activar/desactivar.
 * @param {string} token - El JWT del administrador global.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const toggleEmpresaActiva = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.patch(`${API_BASE_URL}/empresas/${id}/toggle-activo`, {}, config);
  return response.data;
};

export const adminService = { getLicenciaSummary, getEmpresas, toggleEmpresaActiva };