import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Obtiene el resumen de licencias por empresa.
 * @returns {Promise<Array>} Lista con el resumen de licencias por empresa.
 */
const getLicenciaSummary = async () => {
  const response = await axios.get(`${API_BASE_URL}/licencias/summary`);
  return response.data;
};

/**
 * Obtiene la lista de todas las empresas.
 * @returns {Promise<Array>} Lista de empresas.
 */
const getEmpresas = async () => {
  const response = await axios.get(`${API_BASE_URL}/empresas`);
  return response.data.empresas; // El backend devuelve { message, empresas }
};

/**
 * Activa o desactiva una empresa.
 * @param {string} id - El ID de la empresa a activar/desactivar.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const toggleEmpresaActiva = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/empresas/${id}/toggle-activo`, {});
  return response.data;
};

export const adminService = { getLicenciaSummary, getEmpresas, toggleEmpresaActiva };