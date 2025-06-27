import axios from 'axios';

const setupAxiosInterceptor = () => {
  // Interceptor para añadir el token a las cabeceras de todas las solicitudes
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas de error (ej. token expirado o inválido)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error('Token expirado o inválido. Redirigiendo al login...');
        localStorage.removeItem('authToken'); // Limpiar el token inválido
        // window.location.href = '/login'; // Descomentar para redirigir automáticamente al login
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptor;