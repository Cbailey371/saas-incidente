import axios from 'axios';

// Crea una instancia de Axios con una configuración base.
const api = axios.create({
  // Asegúrate de que esta URL apunte a tu backend.
  // Si tu frontend y backend corren en el mismo servidor en producción,
  // podrías usar una ruta relativa como '/api/v1'.
  // Para desarrollo, es común usar la URL completa.
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;