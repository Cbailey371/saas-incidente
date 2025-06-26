import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

// En una aplicación real, el token vendría de un Contexto de Autenticación.
const MOCK_ADMIN_GLOBAL_TOKEN = 'tu_jwt_de_admin_global_aqui'; // ¡Reemplaza esto!

const GestionarEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmpresas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEmpresas = await adminService.getEmpresas(MOCK_ADMIN_GLOBAL_TOKEN);
      setEmpresas(fetchedEmpresas);
    } catch (err) {
      setError('No se pudieron cargar las empresas. Por favor, intente más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleToggleActiva = async (empresa) => {
    if (!window.confirm(`¿Está seguro de que desea ${empresa.activa ? 'desactivar' : 'activar'} la empresa "${empresa.nombre}"? Esto afectará a todos sus usuarios y licencias.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminService.toggleEmpresaActiva(empresa.id, MOCK_ADMIN_GLOBAL_TOKEN);
      alert(response.message);
      fetchEmpresas(); // Recargar la lista para ver los cambios
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado de la empresa.';
      alert(errorMessage);
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