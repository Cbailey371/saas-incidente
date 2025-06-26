import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1/incidentes';

/**
 * Obtiene una lista paginada de incidentes para la empresa del usuario.
 * @param {number} page - El número de página a solicitar.
 * @param {object} filters - Objeto con los filtros (startDate, endDate, tipoIncidenteId, dispositivoId).
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<object>} La respuesta del servidor con los incidentes y datos de paginación.
 */
const getIncidentes = async (page = 1, filters = {}, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit: 10, // Solicitamos 10 incidentes por página
      ...filters, // Añadir los filtros a los parámetros de la URL
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

/**
 * Llama al endpoint para exportar incidentes a CSV.
 * @param {object} filters - Objeto con los filtros (startDate, endDate, tipoIncidenteId, dispositivoId).
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<Blob>} El archivo CSV como un Blob.
 */
const exportIncidentes = async (filters = {}, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
    responseType: 'blob', // Importante para recibir el archivo como Blob
  };
  const response = await axios.get(`${API_URL}/export`, config);
  return response.data;
};

export const incidenteService = {
  getIncidentes,
  exportIncidentes,
};