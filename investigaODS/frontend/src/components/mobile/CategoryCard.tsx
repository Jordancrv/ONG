import React from 'react';
import { theme } from '../../styles/theme';

interface CategoryCardProps {
  code: string;
  name: string;
  color: string;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ code, name, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: color,
        border: 'none',
        borderRadius: theme.borderRadius.lg,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        minHeight: '120px',
        boxShadow: theme.shadows.md,
        width: '100%',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = theme.shadows.lg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
      aria-label={`Categoría ${name}`}
    >
      <div style={{
        fontSize: theme.typography.fontSize['3xl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: 'white',
        marginBottom: '8px',
      }}>
        {code}
      </div>
      <div style={{
        fontSize: theme.typography.fontSize.sm,
        color: 'white',
        textAlign: 'center',
        lineHeight: '1.3',
      }}>
        {name}
      </div>
    </button>
  );
};
