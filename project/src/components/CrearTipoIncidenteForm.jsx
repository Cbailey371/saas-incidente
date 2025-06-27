import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';

const CrearTipoIncidenteForm = ({ onTipoCreado }) => {
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.warn('El nombre no puede estar vacío.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await dataService.createTipoIncidente(nombre);
      toast.success(response.message);
      setNombre(''); // Limpiar el input en caso de éxito

      // Notificar al componente padre que un nuevo tipo fue creado, para refrescar la lista.
      if (onTipoCreado) {
        onTipoCreado(response.tipoIncidente);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Crear Nuevo Tipo de Incidente</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nombre-tipo-incidente" style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
          <input
            type="text"
            id="nombre-tipo-incidente"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Falla eléctrica"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px 15px' }}>
          {isLoading ? 'Creando...' : 'Crear Tipo'}
        </button>
      </form>
    </div>
  );
};

export default CrearTipoIncidenteForm;