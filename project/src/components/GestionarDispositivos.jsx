import React, { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GestionarDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchDispositivosYAgentes = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedDispositivos, fetchedUsuariosData] = await Promise.all([
        dataService.getDispositivos(),
        dataService.getUsuariosPorEmpresa(1, 100) // Fetch up to 100 agents
      ]);

      setDispositivos(fetchedDispositivos);

      const soloAgentes = fetchedUsuariosData.usuarios.filter(user => user.rol === 'agente' && user.activo);
      setAgentes(soloAgentes);

    } catch (err) {
      toast.error('Error al cargar dispositivos y agentes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDispositivosYAgentes();
    }
  }, [isAuthenticated, fetchDispositivosYAgentes]);

  const handleAssignAgent = async (dispositivoId, newAgentId) => {
    setIsLoading(true);
    try {
      const response = await dataService.assignAgentToDevice(
        dispositivoId,
        newAgentId === '' ? null : newAgentId // Enviar null si se selecciona "Sin asignar"
      );
      toast.success(response.message);
      fetchDispositivosYAgentes(); // Recargar la lista para ver los cambios
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al asignar/desasignar agente.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Por favor, inicie sesión para gestionar los dispositivos.</div>;
  }

  if (isLoading && !dispositivos.length) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando dispositivos y agentes...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestionar Dispositivos</h1>
      {dispositivos.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Nombre Dispositivo</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>ID Único</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Agente Asignado</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {dispositivos.map((dispositivo) => (
              <tr key={dispositivo.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{dispositivo.nombre}</td>
                <td style={{ padding: '12px' }}>{dispositivo.identificadorUnico}</td>
                <td style={{ padding: '12px' }}>{dispositivo.Usuario ? dispositivo.Usuario.email : <em>Sin asignar</em>}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={dispositivo.usuarioId || ''}
                    onChange={(e) => handleAssignAgent(dispositivo.id, e.target.value)}
                    disabled={isLoading}
                    style={{ padding: '8px', width: '200px' }}
                  >
                    <option value="">-- Seleccionar Agente --</option>
                    {agentes.map(agente => (
                      <option key={agente.id} value={agente.id}>
                        {agente.email}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay dispositivos registrados para esta empresa.</p>
      )}
    </div>
  );
};

export default GestionarDispositivos;
