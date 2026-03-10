import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useEnrollments } from '../hooks/useEnrollments';
import { progressService } from '../services/api.service';
import { BottomNavigation, ProgressIndicator } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { HelpButton } from '../components/HelpButton';
import { theme } from '../styles/theme';
import type { Enrollment } from '../types';

interface CourseWithProgress extends Enrollment {
  progressPct: number;
}

export const DashboardBasic: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const { enrollments, isLoading: isLoadingEnrollments } = useEnrollments();
  const [coursesWithProgress, setCoursesWithProgress] = useState<CourseWithProgress[]>([]);

  // Load progress for each enrollment
  useEffect(() => {
    const loadProgress = async () => {
      if (!enrollments || enrollments.length === 0) {
        setCoursesWithProgress([]);
        return;
      }

      try {
        const coursesWithProgressData = await Promise.all(
          enrollments.map(async (enrollment) => {
            try {
              const courseId = enrollment.course?.id;
              if (!courseId) {
                return { ...enrollment, progressPct: 0 };
              }
              const progress = await progressService.getCourseProgress(courseId);
              return {
                ...enrollment,
                progressPct: progress?.overallProgress || 0,
              };
            } catch (error) {
              return {
                ...enrollment,
                progressPct: 0,
              };
            }
          })
        );
        setCoursesWithProgress(coursesWithProgressData);
      } catch (error) {
        // If there's an error, still show courses with 0 progress
        setCoursesWithProgress(
          enrollments.map(enrollment => ({
            ...enrollment,
            progressPct: 0,
          }))
        );
      }
    };

    loadProgress();
  }, [enrollments]);

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
      <AppHeader userRole="STUDENT_FREE" />

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Welcome Section */}
        <h2 style={{
          fontSize: isMobile ? theme.typography.fontSize['3xl'] : theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.textPrimary,
          margin: 0,
          marginBottom: '24px',
        }}>
          ¡Bienvenido {user?.firstName}!
        </h2>

        {/* Courses in Progress */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Tus cursos iniciados
          </h3>
          
          {isLoadingEnrollments ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}>
              Cargando tus cursos...
            </div>
          ) : coursesWithProgress.length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}>
              Aún no estás inscrito en ningún curso. <br />
              <span 
                onClick={() => navigate('/explore')}
                style={{
                  color: theme.colors.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Explora cursos disponibles
              </span>
            </div>
          ) : (
            coursesWithProgress.map((enrollment) => (
              <div
                key={enrollment.id}
                onClick={() => {
                  const courseId = enrollment.course?.id;
                  if (courseId) {
                    navigate(`/courses/${courseId}`);
                  }
                }}
                style={{
                  marginBottom: '20px',
                  padding: isMobile ? '16px' : '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: theme.borderRadius.lg,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.textPrimary,
                  marginBottom: '8px',
                }}>
                  {enrollment.course?.title || 'Curso sin título'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                  marginBottom: '12px',
                }}>
                  Profesor: {enrollment.course?.owner?.firstName} {enrollment.course?.owner?.lastName}
                </div>
                <ProgressIndicator
                  progress={enrollment.progressPct}
                  label="Avance:"
                  showPercentage={true}
                />
              </div>
            ))
          )}
        </section>

        {/* PRO Section */}
        <section style={{
          marginBottom: '32px',
          padding: isMobile ? '24px 16px' : '32px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: theme.borderRadius.lg,
          borderTop: `3px solid ${theme.colors.primary}`,
        }}>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Desbloquea tu siguiente nivel de aprendizaje con PRO
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginBottom: '20px',
          }}>
            {['Reciclaje con IA', 'Hidrocarburos y su impacto ambiental', 'Mediciones acuáticas'].map((course) => (
              <li
                key={course}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.textPrimary,
                  marginBottom: '12px',
                }}
              >
                <Leaf size={20} color={theme.colors.primary} />
                {course}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/plans')}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            CONTRATAR MEMBRESÍA
          </button>
        </section>

        {/* Spacer for mobile bottom navigation */}
        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role="STUDENT_FREE" />}

      {/* Help Button */}
      <HelpButton show={true} />
    </div>
  );
};
