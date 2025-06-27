import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import IncidentesList from './components/IncidentesList';
import GestionarTiposIncidente from './components/GestionarTiposIncidente';
import AdminGlobalDashboard from './pages/AdminGlobalDashboard'; // Importar el nuevo dashboard
import HomePage from './pages/HomePage'; // Importar el nuevo HomePage
import AccessDeniedPage from './pages/AccessDeniedPage'; // Importar la nueva página
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Contenedor global para las notificaciones toast */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        {/* Aquí podrías poner un Layout general con Navbar y Sidebar si lo tuvieras */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* --- Rutas Protegidas --- */}

          {/* Rutas para admin_global */}
          <Route element={<ProtectedRoute allowedRoles={['admin_global']} />}>
            <Route path="/admin-dashboard" element={<AdminGlobalDashboard />} />
            {/* Aquí podrías añadir rutas para gestionar empresas, licencias, etc. */}
          </Route>

          {/* Rutas para admin_empresa y agente */}
          <Route element={<ProtectedRoute allowedRoles={['admin_empresa', 'agente']} />}>
            <Route path="/incidentes" element={<IncidentesList />} />
            <Route path="/gestionar-tipos" element={<GestionarTiposIncidente />} />
          </Route>

          {/* Ruta para Acceso Denegado */}
          <Route path="/acceso-denegado" element={<AccessDeniedPage />} />

          {/* La ruta raíz ahora redirige de forma inteligente según el rol */}
          <Route path="/" element={<HomePage />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

/*
  Ejemplo de cómo podrías tener rutas para diferentes roles:
  <Route element={<ProtectedRoute allowedRoles={['admin_empresa']} />}>
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
  </Route>
  <Route element={<ProtectedRoute allowedRoles={['agente']} />}>
    <Route path="/agente-dashboard" element={<AgenteDashboard />} />
  </Route>
*/