import React from 'react';
import { Calendar } from 'lucide-react';
import { theme } from '../../styles/theme';

interface EventCardProps {
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: theme.shadows.md,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
        padding: '40px 16px 16px',
      }}>
        <h3 style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: 'white',
          margin: 0,
          marginBottom: '8px',
        }}>
          {title}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: theme.typography.fontSize.sm,
          color: 'rgba(255, 255, 255, 0.9)',
        }}>
          <Calendar size={14} />
          <span>{date}</span>
          {location && (
            <>
              <span>•</span>
              <span>{location}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
