import React from 'react';
import { theme } from '../styles/theme';

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.lg,
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          zIndex: 9999,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2
          style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}
        >
          Cerrar sesión
        </h2>
        
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.textSecondary,
            margin: 0,
            marginBottom: '24px',
            lineHeight: '1.6',
          }}
        >
          ¿Estás seguro que deseas cerrar tu sesión? Deberás iniciar sesión nuevamente para acceder a tu cuenta.
        </p>
        
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '10px 24px',
              backgroundColor: 'rgba(93, 187, 70, 0.1)',
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(93, 187, 70, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(93, 187, 70, 0.1)';
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 24px',
              backgroundColor: theme.colors.danger,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c53030';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.danger;
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};
