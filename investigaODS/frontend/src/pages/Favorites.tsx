import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BottomNavigation, CourseCard } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

// Mock data - should come from API/state management
const MOCK_FAVORITES = [
  {
    id: '1',
    title: 'Reciclaje Orgánico Avanzado',
    instructor: 'Dr. Juan Ariel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
  },
  {
    id: '2',
    title: 'Compost Agroecológico',
    instructor: 'Dra. Valeria Páez',
    thumbnailUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
  },
  {
    id: '3',
    title: 'Energías Renovables',
    instructor: 'Ing. Roberto Silva',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
  },
  {
    id: '4',
    title: 'Gestión de Residuos Urbanos',
    instructor: 'Dr. Carlos Méndez',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
  },
];

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const userRole = user?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 
                   user?.role === 'ADMIN' ? 'ADMIN' :
                   user?.tier === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleRemoveFavorite = (courseId: string) => {
    setFavorites(favorites.filter(course => course.id !== courseId));
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingTop: isMobile ? '72px' : '84px',
      paddingBottom: isMobile ? '80px' : '0',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      <AppHeader userRole={userRole} />

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <Heart size={isMobile ? 28 : 32} color={theme.colors.primary} fill={theme.colors.primary} />
          <h2 style={{
            fontSize: isMobile ? theme.typography.fontSize['2xl'] : theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
          }}>
            Mis Favoritos
          </h2>
        </div>

        {favorites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}>
            <Heart size={64} color={theme.colors.textTertiary} style={{ marginBottom: '16px' }} />
            <h3 style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.textSecondary,
              margin: 0,
              marginBottom: '8px',
            }}>
              No tienes cursos favoritos
            </h3>
            <p style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.textTertiary,
              margin: 0,
              marginBottom: '24px',
            }}>
              Explora nuestro catálogo y marca tus cursos favoritos
            </p>
            <button
              onClick={() => navigate('/explore')}
              style={{
                padding: '12px 24px',
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                cursor: 'pointer',
              }}
            >
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
          }}>
            {favorites.map((course) => (
              <div
                key={course.id}
                style={{
                  position: 'relative',
                }}
              >
                <CourseCard
                  title={course.title}
                  instructor={course.instructor}
                  thumbnailUrl={course.thumbnailUrl}
                  onClick={() => handleCourseClick(course.id)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(course.id);
                  }}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                  aria-label="Quitar de favoritos"
                >
                  <Heart size={24} color={theme.colors.danger} fill={theme.colors.danger} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info section */}
        {favorites.length > 0 && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'rgba(93, 187, 70, 0.1)',
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.primary}`,
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              margin: 0,
              textAlign: 'center',
            }}>
              💡 Tip: Puedes acceder rápidamente a tus cursos favoritos desde aquí
            </p>
          </div>
        )}

        {/* Spacer for mobile bottom navigation */}
        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role={userRole} />}
    </div>
  );
};
