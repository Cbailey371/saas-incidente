import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const MOCK_ADMIN_EMPRESA_TOKEN = 'tu_jwt_de_admin_empresa_aqui'; // ¡Reemplaza esto!

const GestionarDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDispositivosYAgentes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Obtener dispositivos (incluyendo el usuario asignado si existe)
      const fetchedDispositivos = await dataService.getDispositivos(MOCK_ADMIN_EMPRESA_TOKEN);
      // Para mostrar el usuario asignado, el endpoint de listar dispositivos debería incluir el usuario.
      // Por ahora, asumimos que `getDispositivos` devuelve `usuarioId` si está asignado.
      // Si no, necesitaríamos modificar `listarDispositivosPorEmpresa` en el backend para incluir el usuario.
      setDispositivos(fetchedDispositivos);

      // Obtener solo los usuarios con rol 'agente'
      const fetchedUsuarios = await dataService.getUsuacd ..riosPorEmpresa(1, MOCK_ADMIN_EMPRESA_TOKEN); // Asumimos una sola página para agentes
      const soloAgentes = fetchedUsuarios.usuarios.filter(user => user.rol === 'agente' && user.activo);
      setAgentes(soloAgentes);

    } catch (err) {
      setError('No se pudieron cargar los datos. Por favor, intente más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDispositivosYAgentes();
  }, []);

  const handleAssignAgent = async (dispositivoId, currentAssignedAgentId, newAgentId) => {
    // Si el nuevo agente es el mismo que el actual, no hacer nada
    if (currentAssignedAgentId === newAgentId) {
      return;
    }

    // Confirmación para desasignar
    if (newAgentId === '' && currentAssignedAgentId) {
      if (!window.confirm('¿Está seguro de que desea desasignar el agente de este dispositivo?')) {
        return;
      }
    }

    // Confirmación para reasignar
    if (newAgentId !== '' && currentAssignedAgentId && newAgentId !== currentAssignedAgentId) {
      if (!window.confirm('Este dispositivo ya tiene un agente asignado. ¿Desea reasignarlo?')) {
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await dataService.assignAgentToDevice(
        dispositivoId,
        newAgentId === '' ? null : newAgentId, // Enviar null si se selecciona "Sin asignar"
        MOCK_ADMIN_EMPRESA_TOKEN
      );
      alert(response.message);
      fetchDispositivosYAgentes(); // Recargar la lista para ver los cambios
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al asignar/desasignar agente.';
      alert(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando dispositivos y agentes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestionar Dispositivos y Asignación de Agentes</h1>

      {dispositivos.length === 0 ? (
        <p>No hay dispositivos registrados aún.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Nombre Dispositivo</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Identificador Único</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Agente Asignado</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dispositivos.map((dispositivo) => (
              <tr key={dispositivo.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{dispositivo.nombre}</td>
                <td style={{ padding: '12px' }}>{dispositivo.identificadorUnico}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={dispositivo.usuarioId || ''} // Si no hay usuario, el valor es ''
                    onChange={(e) => handleAssignAgent(dispositivo.id, dispositivo.usuarioId, e.target.value)}
                    disabled={isLoading}
                    style={{ padding: '5px', width: '100%' }}
                  >
                    <option value="">Sin asignar</option>
                    {agentes.map((agente) => (
                      <option key={agente.id} value={agente.id}>
                        {agente.email}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  {/* Aquí podrías añadir botones para editar el dispositivo, etc. */}
                  {dispositivo.usuarioId && (
                    <button
                      onClick={() => handleAssignAgent(dispositivo.id, dispositivo.usuarioId, '')}
                      disabled={isLoading}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#dc3545', // Rojo para desasignar
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      Desasignar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {agentes.length === 0 && (
        <p style={{ marginTop: '20px', color: 'orange' }}>
          No hay agentes activos disponibles para asignar. Por favor, registre agentes.
        </p>
      )}
    </div>
  );
};

export default GestionarDispositivos;