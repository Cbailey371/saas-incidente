import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mientras se verifica el estado de autenticación, no renderizar nada o un spinner
  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no tiene el rol permitido, redirigir a una página de "Acceso Denegado" o al dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/acceso-denegado" replace />; // O a tu dashboard principal
  }

  return <Outlet />;
};

export default ProtectedRoute;