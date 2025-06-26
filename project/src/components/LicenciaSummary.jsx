import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

// En una aplicación real, el token vendría de un Contexto de Autenticación.
const MOCK_ADMIN_GLOBAL_TOKEN = 'tu_jwt_de_admin_global_aqui'; // ¡Reemplaza esto!

const LicenciaSummary = () => {
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await adminService.getLicenciaSummary(MOCK_ADMIN_GLOBAL_TOKEN);
        setSummary(data);
      } catch (err) {
        setError('No se pudo cargar el resumen de licencias.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []); // Se ejecuta solo una vez al montar el componente

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando resumen de licencias...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Resumen de Licencias por Empresa</h1>
      {summary.length === 0 ? (
        <p>No hay empresas con licencias asignadas.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Empresa</th>
              <th style={{ textAlign: 'center', padding: '12px' }}>Total</th>
              <th style={{ textAlign: 'center', padding: '12px' }}>Activas</th>
              <th style={{ textAlign: 'center', padding: '12px' }}>Disponibles</th>
              <th style={{ textAlign: 'center', padding: '12px' }}>Inactivas</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item) => (
              <tr key={item.empresaId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.nombreEmpresa}</td>
                <td style={{ textAlign: 'center', padding: '12px' }}>{item.totalLicencias}</td>
                <td style={{ textAlign: 'center', padding: '12px', color: 'green' }}>{item.licenciasActivas}</td>
                <td style={{ textAlign: 'center', padding: '12px', color: 'blue' }}>{item.licenciasDisponibles}</td>
                <td style={{ textAlign: 'center', padding: '12px', color: 'red' }}>{item.licenciasInactivas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LicenciaSummary;