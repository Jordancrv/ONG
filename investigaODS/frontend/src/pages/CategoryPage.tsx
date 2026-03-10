import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BottomNavigation, CourseCard } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

// Mock data de cursos por categoría
const CATEGORY_INFO: Record<string, { name: string; color: string; icon: string }> = {
  'ecs': { name: 'ECS - Economía Circular y Sostenibilidad', color: '#1E88E5', icon: '♻️' },
  'ecc': { name: 'ECC - Energías Limpias y Cambio Climático', color: '#FF9800', icon: '☀️' },
  'grec': { name: 'GREC - Gestión de Recursos y Ecosistemas', color: '#4CAF50', icon: '🌱' },
  'cysb': { name: 'CySB - Ciudades y Salud/Bienestar', color: '#9C27B0', icon: '🏙️' },
  'ae': { name: 'AE - Agricultura y Ecosistemas', color: '#8BC34A', icon: '🌾' },
  'gs': { name: 'GS - Gobernanza y Sociedad', color: '#2196F3', icon: '🤝' },
  'eir': { name: 'EIR - Educación, Innovación y Responsabilidad', color: '#FFC107', icon: '💡' },
  'vyc': { name: 'VyC - Vida y Conservación', color: '#00BCD4', icon: '🐋' },
};

const MOCK_COURSES_BY_CATEGORY: Record<string, any[]> = {
  'ecs': [
    {
      id: '1',
      title: 'Reciclaje Orgánico Avanzado',
      thumbnail: 'https://via.placeholder.com/300x200',
      progress: 0,
      difficulty: 'Intermedio',
      modality: 'Autoguiado',
      tier: 'FREE',
      instructor: 'Dr. Juan Pérez',
    },
    {
      id: '2',
      title: 'Economía Circular en la Industria',
      thumbnail: 'https://via.placeholder.com/300x200',
      progress: 0,
      difficulty: 'Avanzado',
      modality: 'Guiado',
      tier: 'PRO',
      instructor: 'Dra. María García',
    },
    {
      id: '3',
      title: 'Compost y Sostenibilidad',
      thumbnail: 'https://via.placeholder.com/300x200',
      progress: 0,
      difficulty: 'Básico',
      modality: 'Autoguiado',
      tier: 'FREE',
      instructor: 'Ing. Carlos López',
    },
  ],
  'ecc': [
    {
      id: '4',
      title: 'Energías Renovables',
      thumbnail: 'https://via.placeholder.com/300x200',
      progress: 0,
      difficulty: 'Intermedio',
      modality: 'Autoguiado',
      tier: 'FREE',
      instructor: 'Ing. Ana Martínez',
    },
    {
      id: '5',
      title: 'Cambio Climático y Adaptación',
      thumbnail: 'https://via.placeholder.com/300x200',
      progress: 0,
      difficulty: 'Avanzado',
      modality: 'Guiado',
      tier: 'PRO',
      instructor: 'Dr. Pedro Sánchez',
    },
  ],
  'grec': [
    {
      id: '6',
      title: 'Gestión de Residuos Urbanos',
      thumbnail: 'https://via.placeholder.com/300x200',
      progress: 0,
      difficulty: 'Intermedio',
      modality: 'Autoguiado',
      tier: 'FREE',
      instructor: 'Ing. Laura Torres',
    },
  ],
};

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { user } = useAuth();

  const category = categoryId ? CATEGORY_INFO[categoryId] : null;
  const courses = categoryId ? (MOCK_COURSES_BY_CATEGORY[categoryId] || []) : [];

  const role = user?.planCode === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

  if (!category) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: theme.colors.textPrimary, marginBottom: '20px' }}>
            Categoría no encontrada
          </h2>
          <button
            onClick={() => navigate('/explore')}
            style={{
              padding: '12px 24px',
              backgroundColor: theme.colors.primary,
              color: '#062860',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            Volver a Explorar
          </button>
        </div>
      </div>
    );
  }

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
      <AppHeader userRole={role} />

      {/* Back Button - Posicionado sobre el contenido */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '80px' : '100px',
        left: isMobile ? '16px' : '80px',
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/explore')}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: 'none',
            color: theme.colors.textPrimary,
            cursor: 'pointer',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: theme.borderRadius.md,
          }}
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Category Header */}
        <div style={{
          marginBottom: '32px',
          padding: isMobile ? '24px' : '40px',
          backgroundColor: category.color + '20',
          borderRadius: theme.borderRadius.lg,
          border: `2px solid ${category.color}`,
        }}>
          <div style={{
            fontSize: isMobile ? '48px' : '64px',
            marginBottom: '16px',
          }}>
            {category.icon}
          </div>
          <h2 style={{
            fontSize: isMobile ? theme.typography.fontSize['2xl'] : theme.typography.fontSize['4xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
          }}>
            {category.name}
          </h2>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: isMobile ? '0' : '20px',
            width: '100%',
            maxWidth: '100%',
          }}>
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                style={{ cursor: 'pointer', width: '100%', maxWidth: '100%' }}
              >
                <CourseCard 
                  title={course.title}
                  instructor={course.instructor}
                  thumbnailUrl={course.thumbnail}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.textSecondary,
              margin: 0,
            }}>
              Próximamente habrá cursos disponibles en esta categoría
            </p>
          </div>
        )}

        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role={role} />}
    </div>
  );
};
