import React from 'react';
import { toast } from 'react-toastify';

// Un componente simple para el contenido del toast de confirmación
const ConfirmContent = ({ message, onConfirm, onCancel }) => (
  <div>
    <p style={{ margin: '0 0 10px 0' }}>{message}</p>
    <button onClick={onConfirm} style={{ marginRight: '10px', padding: '8px 12px', cursor: 'pointer' }}>
      Sí, continuar
    </button>
    <button onClick={onCancel} style={{ padding: '8px 12px', cursor: 'pointer' }}>
      Cancelar
    </button>
  </div>
);

/**
 * Muestra un toast de confirmación y devuelve una promesa que se resuelve o rechaza
 * según la elección del usuario.
 * @param {string} message El mensaje de confirmación a mostrar.
 * @returns {Promise<void>} Una promesa que se resuelve si se confirma y se rechaza si se cancela.
 */
export const confirmToast = (message) => {
  return new Promise((resolve, reject) => {
    const toastId = toast(
      <ConfirmContent
        message={message}
        onConfirm={() => {
          toast.dismiss(toastId);
          resolve();
        }}
        onCancel={() => {
          toast.dismiss(toastId);
          reject(new Error('Acción cancelada por el usuario.'));
        }}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        position: "top-center",
      }
    );
  });
};