import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // No mostrar paginación si solo hay una página
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginación de incidentes">
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', padding: 0, gap: '8px' }}>
        <li>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Anterior
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              style={{
                fontWeight: currentPage === number ? 'bold' : 'normal',
                border: currentPage === number ? '2px solid blue' : '1px solid grey',
              }}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

