import React from 'react';
import { theme } from '../../styles/theme';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 8,
}) => {
  const getColor = () => {
    if (progress >= 70) return theme.colors.success;
    if (progress >= 40) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textPrimary,
          }}>
            {label}
          </span>
          {showPercentage && (
            <span style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textPrimary,
              fontWeight: theme.typography.fontWeight.semibold,
            }}>
              {progress}%
            </span>
          )}
        </div>
      )}
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: getColor(),
            transition: 'width 0.3s ease, background-color 0.3s ease',
            borderRadius: theme.borderRadius.full,
          }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
