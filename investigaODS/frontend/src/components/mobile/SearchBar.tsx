import React from 'react';
import { Search } from 'lucide-react';
import { theme } from '../../styles/theme';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '¿Qué aprendemos hoy?',
  value,
  onChange,
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{
        position: 'relative',
        width: '100%',
      }}>
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.colors.textTertiary,
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.base,
            color: '#333',
            outline: 'none',
            fontFamily: theme.typography.fontFamily.primary,
          }}
          aria-label="Buscar cursos"
        />
      </div>
    </form>
  );
};
