import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { coursesService } from '../services/api.service';
import { BottomNavigation, CourseCard } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';
import type { Course } from '../types';

export const CoursesByTag: React.FC = () => {
  const navigate = useNavigate();
  const { tagName } = useParams<{ tagName: string }>();
  const { isMobile } = useBreakpoint();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!tagName) return;
      
      setIsLoading(true);
      try {
        console.log('🔍 Loading courses for tag:', tagName);
        const data = await coursesService.getAll({ tag: tagName });
        console.log('✅ Courses loaded:', data);
        setCourses(data);
      } catch (error) {
        console.error('❌ Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [tagName]);

  const userRole = user?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 
                   user?.role === 'ADMIN' ? 'ADMIN' :
                   user?.planCode === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

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
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/explore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: theme.colors.primary,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: '8px 0',
              marginBottom: '16px',
            }}
          >
            <ArrowLeft size={20} />
            Volver a Explorar
          </button>

          <h1 style={{
            fontSize: isMobile ? theme.typography.fontSize['2xl'] : theme.typography.fontSize['4xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '8px',
          }}>
            Cursos de: {tagName}
          </h1>
          
          {!isLoading && (
            <p style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              margin: 0,
            }}>
              {courses.length} {courses.length === 1 ? 'curso disponible' : 'cursos disponibles'}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: theme.colors.textSecondary,
          }}>
            Cargando cursos...
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses.length > 0 && (
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
                onClick={() => {
                  if (course.id) {
                    navigate(`/courses/${course.id}`);
                  }
                }}
                style={{ cursor: 'pointer', width: '100%', maxWidth: '100%' }}
              >
                <CourseCard 
                  title={course.title}
                  instructor={`${course.owner?.firstName || ''} ${course.owner?.lastName || ''}`.trim() || 'Instructor'}
                  thumbnailUrl={course.thumbnailUrl || 'https://via.placeholder.com/300x200'}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && courses.length === 0 && (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.textPrimary,
              margin: 0,
              marginBottom: '12px',
              fontWeight: theme.typography.fontWeight.semibold,
            }}>
              No hay cursos disponibles
            </p>
            <p style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              margin: 0,
              marginBottom: '24px',
            }}>
              Aún no hay cursos con esta categoría
            </p>
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
              Explorar otras categorías
            </button>
          </div>
        )}

        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role={userRole} />}
    </div>
  );
};
