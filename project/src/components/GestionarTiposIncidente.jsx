import React, { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';
import CrearTipoIncidenteForm from './CrearTipoIncidenteForm'; // Reutilizamos el formulario de creación
import { useAuth } from '../context/AuthContext'; // 1. Importar el hook
import { toast } from 'react-toastify';
import { confirmToast } from '../utils/toastHelper';

// const MOCK_ADMIN_EMPRESA_TOKEN = 'tu_jwt_de_admin_empresa_aqui'; // ¡Ya no se necesita!

const GestionarTiposIncidente = () => {
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipo, setEditingTipo] = useState(null); // null o el objeto del tipo que se está editando
  const [editNombre, setEditNombre] = useState('');
  const { isAuthenticated } = useAuth(); // 2. Obtener el estado de autenticación

  const fetchTiposIncidente = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTipos = await dataService.getTiposIncidente();
      setTiposIncidente(fetchedTipos);
    } catch (err) {
      setError('No se pudieron cargar los tipos de incidente. Por favor, intente más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) { // Solo buscar datos si el usuario está autenticado
      fetchTiposIncidente();
    }
  }, [isAuthenticated, fetchTiposIncidente]); // 3. Re-ejecutar si el estado de autenticación o la función cambian

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
      toast.warn('El nombre no puede estar vacío.');
      return;
    }
    if (editingTipo && editNombre === editingTipo.nombre) {
      handleCancelEdit(); // No hay cambios, solo cerrar
      return;
    }

    setIsLoading(true);
    try {
      const response = await dataService.updateTipoIncidente(editingTipo.id, editNombre);
      toast.success(response.message);
      fetchTiposIncidente(); // Recargar la lista para ver los cambios
      handleCancelEdit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el tipo de incidente.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivo = async (tipo) => {
    try {
      await confirmToast(`¿Está seguro de que desea ${tipo.activo ? 'desactivar' : 'activar'} el tipo "${tipo.nombre}"?`);

      // Si el usuario confirma, el código continúa. Si cancela, la promesa rechaza y salta al catch.
      setIsLoading(true);
      const response = await dataService.toggleTipoIncidenteActivo(tipo.id);
      toast.success(response.message);
      fetchTiposIncidente(); // Recargar la lista para ver los cambios
    } catch (err) {
      // Si el error es por cancelación del usuario, no mostramos un toast de error.
      if (err.message !== 'Acción cancelada por el usuario.') {
        const errorMessage = err.response?.data?.message || 'Error al cambiar el estado del tipo de incidente.';
        toast.error(errorMessage);
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Por favor, inicie sesión para gestionar los tipos de incidente.</div>;
  }

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