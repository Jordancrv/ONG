import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/mobile';
import { COLORS, ROUTES } from '../utils/constants';
import type { CourseTier } from '../types';

const logoGD = "/logo.svg";

// Mock data de cursos
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Reciclaje Orgánico Avanzado',
    slug: 'reciclaje-organico-avanzado',
    summary: 'Aprende técnicas avanzadas de reciclaje orgánico y compostaje.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    level: 'BEGINNER' as const,
    tierRequired: 'FREE' as CourseTier,
    instructor: 'Juan Pérez',
    duration: '4 semanas',
    students: 1250,
  },
  {
    id: '2',
    title: 'Compost Agroecológico',
    slug: 'compost-agroecologico',
    summary: 'Domina el arte del compostaje para agricultura sostenible.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
    level: 'INTERMEDIATE' as const,
    tierRequired: 'FREE' as CourseTier,
    instructor: 'Valeria Páez',
    duration: '6 semanas',
    students: 890,
  },
  {
    id: '3',
    title: 'Gestión de Residuos Industriales',
    slug: 'gestion-residuos-industriales',
    summary: 'Estrategias profesionales para gestión de residuos en industrias.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    level: 'ADVANCED' as const,
    tierRequired: 'PRO' as CourseTier,
    instructor: 'Dr. Carlos Méndez',
    duration: '8 semanas',
    students: 420,
  },
  {
    id: '4',
    title: 'Certificación Ambiental Avanzada',
    slug: 'certificacion-ambiental-avanzada',
    summary: 'Prepárate para certificaciones internacionales ambientales.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    level: 'ADVANCED' as const,
    tierRequired: 'PRO' as CourseTier,
    instructor: 'Dra. María González',
    duration: '12 semanas',
    students: 340,
  },
  {
    id: '5',
    title: 'Energías Renovables para el Hogar',
    slug: 'energias-renovables-hogar',
    summary: 'Implementa soluciones de energía limpia en tu hogar.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
    level: 'BEGINNER' as const,
    tierRequired: 'FREE' as CourseTier,
    instructor: 'Ing. Roberto Silva',
    duration: '5 semanas',
    students: 2100,
  },
  {
    id: '6',
    title: 'Liderazgo en Sostenibilidad',
    slug: 'liderazgo-sostenibilidad',
    summary: 'Desarrolla habilidades de liderazgo para proyectos sustentables.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
    level: 'INTERMEDIATE' as const,
    tierRequired: 'PRO' as CourseTier,
    instructor: 'Ana García',
    duration: '10 semanas',
    students: 580,
  },
];

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isMobile } = useBreakpoint();
  const [filter, setFilter] = useState<'ALL' | 'FREE' | 'PRO'>('ALL');

  const filteredCourses = MOCK_COURSES.filter(course => {
    if (filter === 'ALL') return true;
    return course.tierRequired === filter;
  });

  const handleCourseClick = (slug: string, tierRequired: CourseTier) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Verificar si el usuario tiene acceso
    if (tierRequired === 'PRO' && user?.planCode !== 'PRO') {
      alert('Este curso requiere una suscripción PRO. Upgrade tu plan para acceder.');
      navigate(ROUTES.PLANS);
      return;
    }

    navigate(ROUTES.COURSE_DETAIL(slug));
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      BEGINNER: '#5dbb46',
      INTERMEDIATE: '#d9d203',
      ADVANCED: '#ff6b6b',
    };
    return colors[level as keyof typeof colors] || '#888';
  };

  const role = user?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 
               user?.role === 'ADMIN' ? 'ADMIN' :
               user?.planCode === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      paddingTop: isAuthenticated && isMobile ? '72px' : '0',
      paddingBottom: isAuthenticated && isMobile ? '80px' : '0',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      {isAuthenticated ? (
        <AppHeader userRole={role} />
      ) : (
        <header style={{
        padding: '20px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          <img src={logoGD} alt="Logo" style={{ width: '50px', height: '40px' }} />
          <h1 style={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
            fontWeight: '100',
            color: 'white',
            margin: 0,
          }}>
            Investiga <span style={{ fontWeight: 'bold', color: COLORS.primary }}>ODS</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          {isAuthenticated ? (
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              style={{
                padding: '10px 24px',
                backgroundColor: COLORS.primary,
                color: COLORS.textDark,
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Mi Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: COLORS.primary,
                  color: COLORS.textDark,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </header>
      )}

      {/* Page Content */}
      <main style={{ padding: isMobile ? '20px 16px' : '60px 80px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px',
        }}>
          Catálogo de Cursos
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'white',
          marginBottom: '40px',
        }}>
          Explora nuestra colección de cursos sobre sostenibilidad y ODS
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          {(['ALL', 'FREE', 'PRO'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 24px',
                backgroundColor: filter === f ? COLORS.primary : 'transparent',
                color: filter === f ? COLORS.textDark : 'white',
                border: `2px solid ${filter === f ? COLORS.primary : 'white'}`,
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {f === 'ALL' ? 'Todos' : f}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px',
        }}>
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.slug, course.tierRequired)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Thumbnail */}
              <div style={{
                height: '200px',
                backgroundColor: '#333',
                backgroundImage: `url(${course.thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                {/* Tier Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  padding: '6px 12px',
                  backgroundColor: course.tierRequired === 'PRO' ? COLORS.primary : '#888',
                  color: COLORS.textDark,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  {course.tierRequired}
                </div>

                {/* Level Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  padding: '6px 12px',
                  backgroundColor: getLevelBadge(course.level),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  {course.level}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '10px',
                }}>
                  {course.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '15px',
                  lineHeight: '1.5',
                }}>
                  {course.summary}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '10px',
                }}>
                  <span>👤 {course.instructor}</span>
                  <span>📚 {course.students} estudiantes</span>
                </div>

                <div style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}>
                  ⏱️ {course.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation for authenticated mobile users */}
      {isAuthenticated && isMobile && <BottomNavigation role={role} />}
    </div>
  );
};
