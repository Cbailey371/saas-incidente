import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  // Asumimos que tu AuthContext provee el 'user' y un estado 'loading'.
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se verifica la sesión.
  }

  if (!user) {
    // Si no hay usuario, redirige a la página de login.
    return <Navigate to="/login" replace />;
  }

  // Redirige basado en el rol del usuario.
  switch (user.rol) {
    case 'admin_global':
      return <Navigate to="/admin-dashboard" replace />;
    case 'admin_empresa':
    case 'agente': // Los agentes también pueden ir a la lista de incidentes.
      return <Navigate to="/incidentes" replace />;
    default:
      return <Navigate to="/acceso-denegado" replace />;
  }
};

export default HomePage;