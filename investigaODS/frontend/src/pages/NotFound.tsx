import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BottomNavigation } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { user } = useAuth();

  const role = user?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 
               user?.role === 'ADMIN' ? 'ADMIN' :
               user?.planCode === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingTop: isMobile ? '72px' : '84px',
      paddingBottom: isMobile ? '80px' : '0',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <AppHeader userRole={role} />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '40px 16px' : '60px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: isMobile ? '72px' : '120px',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.primary,
          margin: 0,
          marginBottom: '16px',
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: isMobile ? theme.typography.fontSize['2xl'] : theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.textPrimary,
          margin: 0,
          marginBottom: '16px',
        }}>
          Página no encontrada
        </h2>

        <p style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.textSecondary,
          margin: 0,
          marginBottom: '32px',
          maxWidth: '500px',
        }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '14px 32px',
            backgroundColor: theme.colors.primary,
            color: '#062860',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 187, 70, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Volver al inicio
        </button>
      </main>

      {isMobile && <BottomNavigation role={role} />}
    </div>
  );
};
