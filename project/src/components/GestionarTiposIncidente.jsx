import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import CrearTipoIncidenteForm from './CrearTipoIncidenteForm'; // Reutilizamos el formulario de creación

const MOCK_ADMIN_EMPRESA_TOKEN = 'tu_jwt_de_admin_empresa_aqui'; // ¡Reemplaza esto!

const GestionarTiposIncidente = () => {
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipo, setEditingTipo] = useState(null); // null o el objeto del tipo que se está editando
  const [editNombre, setEditNombre] = useState('');

  const fetchTiposIncidente = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTipos = await dataService.getTiposIncidente(MOCK_ADMIN_EMPRESA_TOKEN);
      setTiposIncidente(fetchedTipos);
    } catch (err) {
      setError('No se pudieron cargar los tipos de incidente. Por favor, intente más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposIncidente();
  }, []);

  const handleTipoCreado = (nuevoTipo) => {
    // Añadir el nuevo tipo a la lista y refrescar
    setTiposIncidente((prev) => [...prev, nuevoTipo]);
    // Opcional: volver a cargar todos los tipos para asegurar el orden y la consistencia
    fetchTiposIncidente();
  };

  const handleEditClick = (tipo) => {
    setEditingTipo(tipo);
    setEditNombre(tipo.nombre);
  };

  const handleCancelEdit = () => {
    setEditingTipo(null);
    setEditNombre('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editNombre.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }
    if (editingTipo && editNombre === editingTipo.nombre) {
      handleCancelEdit(); // No hay cambios, solo cerrar
      return;
    }

    setIsLoading(true);
    try {
      const response = await dataService.updateTipoIncidente(editingTipo.id, editNombre, MOCK_ADMIN_EMPRESA_TOKEN);
      alert(response.message);
      fetchTiposIncidente(); // Recargar la lista para ver los cambios
      handleCancelEdit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el tipo de incidente.';
      alert(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivo = async (tipo) => {
    if (!window.confirm(`¿Está seguro de que desea ${tipo.activo ? 'desactivar' : 'activar'} el tipo "${tipo.nombre}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await dataService.toggleTipoIncidenteActivo(tipo.id, MOCK_ADMIN_EMPRESA_TOKEN);
      alert(response.message);
      fetchTiposIncidente(); // Recargar la lista para ver los cambios
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado del tipo de incidente.';
      alert(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !tiposIncidente.length) { // Mostrar cargando solo al inicio o si no hay datos
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando tipos de incidente...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestionar Tipos de Incidente</h1>

      <CrearTipoIncidenteForm onTipoCreado={handleTipoCreado} />

      <div style={{ marginTop: '30px' }}>
        <h2>Tipos de Incidente Existentes</h2>
        {tiposIncidente.length === 0 ? (
          <p>No hay tipos de incidente creados aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposIncidente.map((tipo) => (
                <tr key={tipo.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>
                    {editingTipo?.id === tipo.id ? (
                      <form onSubmit={handleUpdateSubmit} style={{ display: 'inline-flex', gap: '5px' }}>
                        <input
                          type="text"
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                          required
                          style={{ padding: '5px', width: '150px' }}
                        />
                        <button type="submit" disabled={isLoading}>Guardar</button>
                        <button type="button" onClick={handleCancelEdit} disabled={isLoading}>Cancelar</button>
                      </form>
                    ) : (
                      tipo.nombre
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: tipo.activo ? 'green' : 'red', fontWeight: 'bold' }}>
                      {tipo.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editingTipo?.id !== tipo.id && (
                      <>
                        <button
                          onClick={() => handleEditClick(tipo)}
                          disabled={isLoading}
                          style={{ marginRight: '10px', padding: '8px 12px' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleActivo(tipo)}
                          disabled={isLoading}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: tipo.activo ? '#ffc107' : '#28a745',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {tipo.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GestionarTiposIncidente;