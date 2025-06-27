import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GestionarEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const fetchEmpresas = useCallback(async () => {
    if (user?.rol !== 'admin_global') {
      setError('Acceso denegado. Esta vista es solo para administradores globales.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEmpresas = await adminService.getEmpresas();
      setEmpresas(fetchedEmpresas);
    } catch (err) {
      toast.error('No se pudieron cargar las empresas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.rol]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmpresas();
    }
  }, [isAuthenticated, fetchEmpresas]);

  const handleToggleActiva = async (empresa) => {
    if (!window.confirm(`¿Está seguro de que desea ${empresa.activa ? 'desactivar' : 'activar'} la empresa "${empresa.nombre}"? Esto afectará a todos sus usuarios y licencias.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminService.toggleEmpresaActiva(empresa.id);
      toast.success(response.message);
      fetchEmpresas(); // Recargar la lista para ver los cambios
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado de la empresa.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando empresas...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestionar Empresas</h1>

      {empresas.length === 0 ? (
        <p>No hay empresas registradas aún.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Nombre de la Empresa</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{empresa.nombre}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: empresa.activa ? 'green' : 'red', fontWeight: 'bold' }}>
                    {empresa.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleToggleActiva(empresa)}
                    disabled={isLoading}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: empresa.activa ? '#dc3545' : '#28a745', // Rojo para desactivar, verde para activar
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {empresa.activa ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GestionarEmpresas;