import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api'; // Asegúrate de que esta ruta sea correcta para tu instancia de Axios
import { jwtDecode } from 'jwt-decode'; // Importa jwtDecode

// 1. Crea el objeto de contexto
const AuthContext = createContext(null);

// 2. Crea el proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga inicial
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Verifica si el token ha expirado
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUser(null);
            toast.info('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          } else {
            // Si el token es válido, establece el usuario
            setUser({
              userId: decodedToken.userId,
              rol: decodedToken.rol,
              empresaId: decodedToken.empresaId,
            });
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error decodificando token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password, identificadorUnico) => {
    try {
      const response = await api.post('/auth/login', { email, password, identificadorUnico });
      const { token, rol, dispositivoId } = response.data;
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setUser({ userId: decodedToken.userId, rol: decodedToken.rol, empresaId: decodedToken.empresaId, dispositivoId });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, rol };
    } catch (error) {
      console.error('Error en el login:', error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión.');
      return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
    toast.info('Has cerrado sesión.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Exporta el objeto de contexto para que HomePage.jsx pueda usarlo
export { AuthContext };

// Opcional: un hook personalizado para consumir el contexto más fácilmente
export const useAuth = () => {
  return React.useContext(AuthContext);
};