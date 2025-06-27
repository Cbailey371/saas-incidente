import React, { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';
import RegistrarUsuarioForm from './RegistrarUsuarioForm'; // Reutilizamos el formulario de registro
import Pagination from './Pagination'; // Reutilizamos el componente de paginación
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [editingUser, setEditingUser] = useState(null); // null o el objeto del usuario que se está editando
  const [editFormData, setEditFormData] = useState({
    email: '',
    rol: '',
    activo: true,
  });
  const { isAuthenticated } = useAuth();

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dataService.getUsuariosPorEmpresa(pagination.currentPage);
      setUsuarios(data.usuarios);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (err) {
      toast.error('No se pudieron cargar los usuarios.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsuarios();
    }
  }, [isAuthenticated, fetchUsuarios]);

  const handleUsuarioRegistrado = (nuevoUsuario) => {
    // Opcional: añadir el nuevo usuario a la lista o simplemente recargar
    fetchUsuarios();
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handleEditClick = (usuario) => {
    setEditingUser(usuario);
    setEditFormData({
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({ email: '', rol: '', activo: true });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.email.trim()) {
      alert('El email no puede estar vacío.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await dataService.updateUsuario(editingUser.id, editFormData);
      toast.success(response.message);
      fetchUsuarios(); // Recargar la lista para ver los cambios
      handleCancelEdit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivo = async (usuario) => {
    if (!window.confirm(`¿Está seguro de que desea ${usuario.activo ? 'desactivar' : 'activar'} al usuario "${usuario.email}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await dataService.toggleUsuarioActivo(usuario.id);
      toast.success(response.message);
      fetchUsuarios(); // Recargar la lista para ver los cambios
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado del usuario.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !usuarios.length) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando usuarios...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestionar Usuarios de la Empresa</h1>

      <RegistrarUsuarioForm onUsuarioRegistrado={handleUsuarioRegistrado} />

      <div style={{ marginTop: '30px' }}>
        <h2>Usuarios Existentes</h2>
        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados aún.</p>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Rol</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>
                      {editingUser?.id === usuario.id ? (
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditFormChange}
                          required
                          style={{ padding: '5px', width: '150px' }}
                        />
                      ) : (
                        usuario.email
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {editingUser?.id === usuario.id ? (
                        <select name="rol" value={editFormData.rol} onChange={handleEditFormChange} style={{ padding: '5px' }}>
                          <option value="agente">Agente</option>
                          <option value="admin_empresa">Admin Empresa</option>
                        </select>
                      ) : (
                        usuario.rol
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: usuario.activo ? 'green' : 'red', fontWeight: 'bold' }}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {editingUser?.id === usuario.id ? (
                        <>
                          <button onClick={handleUpdateSubmit} disabled={isLoading} style={{ marginRight: '10px' }}>Guardar</button>
                          <button onClick={handleCancelEdit} disabled={isLoading}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(usuario)} disabled={isLoading} style={{ marginRight: '10px' }}>Editar</button>
                          <button
                            onClick={() => handleToggleActivo(usuario)}
                            disabled={isLoading}
                            style={{ backgroundColor: usuario.activo ? '#ffc107' : '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
                          >
                            {usuario.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '20px' }}>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GestionarUsuarios;