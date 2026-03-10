import React from 'react';
import { Play } from 'lucide-react';
import { theme } from '../../styles/theme';

interface CourseCardProps {
  title: string;
  instructor: string;
  thumbnailUrl?: string;
  onClick?: () => void;
  compact?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  instructor,
  thumbnailUrl,
  onClick,
  compact = false,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        gap: compact ? '12px' : '16px',
        alignItems: 'center',
        width: '100%',
        padding: compact ? '12px' : '16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${theme.colors.border}`,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.2s ease',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{
        width: compact ? '100px' : '140px',
        height: compact ? '60px' : '80px',
        backgroundColor: '#E0E0E0',
        borderRadius: theme.borderRadius.md,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Play size={32} color="#666" />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: compact ? theme.typography.fontSize.base : theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.textPrimary,
          margin: 0,
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.textSecondary,
          margin: 0,
        }}>
          {instructor}
        </p>
      </div>
    </button>
  );
};
