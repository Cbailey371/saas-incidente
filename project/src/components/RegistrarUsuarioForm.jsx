import React, { useState } from 'react';
import { dataService } from '../services/dataService';

const MOCK_ADMIN_EMPRESA_TOKEN = 'tu_jwt_de_admin_empresa_aqui'; // ¡Reemplaza esto!

const RegistrarUsuarioForm = ({ onUsuarioRegistrado }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rol: 'agente', // Valor por defecto
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await dataService.registrarUsuario(formData, MOCK_ADMIN_EMPRESA_TOKEN);
      setMessage({ type: 'success', text: response.message });
      // Limpiar el formulario tras el éxito
      setFormData({ email: '', password: '', rol: 'agente' });

      if (onUsuarioRegistrado) {
        onUsuarioRegistrado(response.usuario);
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(err => err.msg).join(' ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Registrar Nuevo Usuario</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@empresa.com"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="rol" style={{ display: 'block', marginBottom: '5px' }}>Rol:</label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="agente">Agente</option>
            <option value="admin_empresa">Administrador de Empresa</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px 15px' }}>
          {isLoading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
      {message.text && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          color: message.type === 'error' ? '#D8000C' : '#4F8A10',
          backgroundColor: message.type === 'error' ? '#FFD2D2' : '#DFF2BF',
          borderRadius: '4px'
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default RegistrarUsuarioForm;