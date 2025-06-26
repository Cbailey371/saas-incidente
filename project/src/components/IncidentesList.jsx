import React, { useState, useEffect } from 'react';
import { incidenteService } from '../services/incidenteService';
import { dataService } from '../services/dataService'; // Importar el nuevo servicio
import Pagination from './Pagination';

// En una aplicación real, el token vendría de un Contexto de Autenticación.
// const { token } = useAuth();
const MOCK_ADMIN_EMPRESA_TOKEN = 'tu_jwt_de_admin_empresa_aqui'; // ¡Reemplaza esto!

// Helper para formatear fechas a YYYY-MM-DD para inputs de tipo date
const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const IncidentesList = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    tipoIncidenteId: '',
    dispositivoId: '',
  });
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const fetchedTipos = await dataService.getTiposIncidente(MOCK_ADMIN_EMPRESA_TOKEN);
        setTiposIncidente(fetchedTipos);
        const fetchedDispositivos = await dataService.getDispositivos(MOCK_ADMIN_EMPRESA_TOKEN);
        setDispositivos(fetchedDispositivos);
      } catch (err) {
        console.error('Error al cargar datos para filtros:', err);
        // Podrías establecer un mensaje de error específico para esto
      }
    };
    fetchFilterData();
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Convertir fechas a formato ISO para el backend si existen
    const formattedFilters = { ...filters };

    const fetchIncidentes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await incidenteService.getIncidentes(pagination.currentPage, formattedFilters, MOCK_ADMIN_EMPRESA_TOKEN);
        setIncidentes(data.incidentes);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
      } catch (err) {
        setError('No se pudieron cargar los incidentes. Por favor, intente más tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Pequeño retraso para evitar múltiples llamadas rápidas al cambiar filtros
    const handler = setTimeout(() => {
      fetchIncidentes();
    }, 300); // 300ms de debounce

    return () => clearTimeout(handler); // Limpiar el timeout si el componente se desmonta o los filtros cambian de nuevo
  }, [pagination.currentPage, filters]); // Se ejecuta cada vez que cambia la página actual o los filtros

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando incidentes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Lista de Incidentes</h1>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <h3>Filtros</h3>
        <div>
          <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>Fecha Inicio:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formatDateForInput(filters.startDate)}
            onChange={handleFilterChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>Fecha Fin:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formatDateForInput(filters.endDate)}
            onChange={handleFilterChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="tipoIncidenteId" style={{ display: 'block', marginBottom: '5px' }}>Tipo de Incidente:</label>
          <select
            id="tipoIncidenteId"
            name="tipoIncidenteId"
            value={filters.tipoIncidenteId}
            onChange={handleFilterChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Todos</option>
            {tiposIncidente.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dispositivoId" style={{ display: 'block', marginBottom: '5px' }}>Dispositivo:</label>
          <select
            id="dispositivoId"
            name="dispositivoId"
            value={filters.dispositivoId}
            onChange={handleFilterChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Todos</option>
            {dispositivos.map(dispositivo => (
              <option key={dispositivo.id} value={dispositivo.id}>{dispositivo.nombre}</option>
            ))}
          </select>
        </div>
        {/* Botón para limpiar filtros (opcional) */}
        {/* <button onClick={() => setFilters({ startDate: '', endDate: '', tipoIncidenteId: '', dispositivoId: '' })} style={{ gridColumn: '1 / -1', padding: '10px 15px', marginTop: '10px' }}>
          Limpiar Filtros
        </button> */}
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              const csvBlob = await incidenteService.exportIncidentes(filters, MOCK_ADMIN_EMPRESA_TOKEN);
              const url = window.URL.createObjectURL(new Blob([csvBlob]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `reporte_incidentes_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (err) {
              alert('Error al exportar el reporte. Por favor, intente más tarde.');
              console.error('Error al exportar:', err);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading || incidentes.length === 0}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isLoading ? 'Exportando...' : 'Exportar a CSV'}
        </button>
      </div>

      {incidentes.length === 0 ? (
        <p>No hay incidentes reportados.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f2f2f2' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Fecha</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Título</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Reportado por</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Dispositivo</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {incidentes.map((incidente) => (
                <tr key={incidente.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{new Date(incidente.fecha).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>{incidente.titulo}</td>
                  <td style={{ padding: '12px' }}>{incidente.reportadoPor.email}</td>
                  <td style={{ padding: '12px' }}>{incidente.Dispositivo.nombre}</td>
                  <td style={{ padding: '12px' }}>{incidente.TipoIncidente.nombre}</td>
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
  );
};

export default IncidentesList;