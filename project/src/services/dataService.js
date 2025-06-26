import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

/**
 * Obtiene la lista de tipos de incidente para la empresa.
 * @param {string} token - El JWT del usuario autenticado.
 * @returns {Promise<Array>} Lista de tipos de incidente.
 */
const getTiposIncidente = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/tipos-incidente`, config);
  return response.data;
};

/**
 * Obtiene la lista de dispositivos para la empresa.
 * @param {string} token - El JWT del usuario autenticado.
 * @returns {Promise<Array>} Lista de dispositivos.
 */
const getDispositivos = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/dispositivos`, config);
  return response.data;
};

/**
 * Crea un nuevo tipo de incidente para la empresa.
 * @param {string} nombre - El nombre del nuevo tipo de incidente.
 * @param {string} token - El JWT del usuario autenticado.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const createTipoIncidente = async (nombre, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`${API_BASE_URL}/tipos-incidente`, { nombre }, config);
  return response.data;
};

/**
 * Actualiza un tipo de incidente existente.
 * @param {string} id - El ID del tipo de incidente a actualizar.
 * @param {string} nombre - El nuevo nombre del tipo de incidente.
 * @param {string} token - El JWT del usuario autenticado.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const updateTipoIncidente = async (id, nombre, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_BASE_URL}/tipos-incidente/${id}`, { nombre }, config);
  return response.data;
};

/**
 * Activa o desactiva un tipo de incidente existente.
 * @param {string} id - El ID del tipo de incidente a activar/desactivar.
 * @param {string} token - El JWT del usuario autenticado.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const toggleTipoIncidenteActivo = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.patch(`${API_BASE_URL}/tipos-incidente/${id}/toggle-activo`, {}, config);
  return response.data;
};

/**
 * Registra un nuevo usuario (agente o admin_empresa) para la compañía.
 * @param {object} userData - Datos del usuario { email, password, rol }.
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const registrarUsuario = async (userData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`${API_BASE_URL}/usuarios`, userData, config);
  return response.data;
};

/**
 * Obtiene la lista paginada de usuarios para la empresa.
 * @param {number} page - El número de página a solicitar.
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<object>} La respuesta del servidor con los usuarios y datos de paginación.
 */
const getUsuariosPorEmpresa = async (page = 1, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit: 10 },
  };
  const response = await axios.get(`${API_BASE_URL}/usuarios`, config);
  return response.data;
};

/**
 * Actualiza los datos de un usuario (email, rol, activo).
 * @param {string} id - ID del usuario a actualizar.
 * @param {object} userData - Datos a actualizar { email, rol, activo }.
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const updateUsuario = async (id, userData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_BASE_URL}/usuarios/${id}`, userData, config);
  return response.data;
};

/**
 * Activa o desactiva un usuario.
 * @param {string} id - ID del usuario a activar/desactivar.
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const toggleUsuarioActivo = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(`${API_BASE_URL}/usuarios/${id}/toggle-activo`, {}, config);
  return response.data;
};

/**
 * Asigna o desasigna un usuario (agente) a un dispositivo.
 * @param {string} dispositivoId - ID del dispositivo.
 * @param {string|null} usuarioId - ID del usuario a asignar, o null para desasignar.
 * @param {string} token - El JWT del administrador de la empresa.
 * @returns {Promise<object>} La respuesta del servidor.
 */
const assignAgentToDevice = async (dispositivoId, usuarioId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(`${API_BASE_URL}/dispositivos/${dispositivoId}/assign-agent`, { usuarioId }, config);
  return response.data;
};

export const dataService = {
  getTiposIncidente,
  getDispositivos,
  createTipoIncidente,
  updateTipoIncidente,
  toggleTipoIncidenteActivo,
  registrarUsuario,
  getUsuariosPorEmpresa,
  updateUsuario,
  toggleUsuarioActivo,
  assignAgentToDevice,
};
