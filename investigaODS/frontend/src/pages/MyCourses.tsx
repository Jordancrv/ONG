import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BottomNavigation, CourseCard } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { HelpButton } from '../components/HelpButton';
import { useAuth } from '../hooks/useAuth';
import { useEnrollments } from '../hooks/useEnrollments';
import { useFavorites } from '../hooks/useFavorites';
import { progressService } from '../services/api.service';
import type { Enrollment } from '../types';

interface CourseWithProgress extends Enrollment {
  progressPct: number;
  isFavorite: boolean;
}

export const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { user, userPlan } = useAuth();
  const { enrollments, isLoading } = useEnrollments();
  const { favorites, loading: favoritesLoading, isFavorite, toggleFavorite } = useFavorites();
  const [coursesWithProgress, setCoursesWithProgress] = useState<CourseWithProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const hasLoadedRef = useRef(false);

  // Load progress for each enrolled course when both enrollments and favorites are ready
  useEffect(() => {
    const loadProgress = async () => {
      // Only load once when everything is ready
      if (hasLoadedRef.current) return;
      
      // Wait for both enrollments and favorites to load
      if (isLoading || favoritesLoading) return;
      
      if (!enrollments || enrollments.length === 0) {
        setCoursesWithProgress([]);
        setLoadingProgress(false);
        hasLoadedRef.current = true;
        return;
      }

      hasLoadedRef.current = true; // Mark as loaded
      setLoadingProgress(true);

      const coursesData: CourseWithProgress[] = [];

      for (const enrollment of enrollments) {
        try {
          const courseId = enrollment.course?.id;
          if (!courseId) {
            coursesData.push({
              ...enrollment,
              progressPct: 0,
              isFavorite: false,
            });
            continue;
          }
          const progress = await progressService.getCourseProgress(courseId);
          const isCourseFavorite = isFavorite(courseId);
          console.log(`Course ${courseId} isFavorite:`, isCourseFavorite);
          coursesData.push({
            ...enrollment,
            progressPct: progress.progressPct || 0,
            isFavorite: isCourseFavorite,
          });
        } catch (error) {
          // If progress fails, show course with 0% progress
          const courseId = enrollment.course?.id || 0;
          coursesData.push({
            ...enrollment,
            progressPct: 0,
            isFavorite: isFavorite(courseId),
          });
        }
      }

      console.log('Courses with progress:', coursesData);
      setCoursesWithProgress(coursesData);
      setLoadingProgress(false);
    };

    loadProgress();
  }, [enrollments, isLoading, favoritesLoading, isFavorite]);

  const handleToggleFavorite = async (courseId: number | undefined, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent navigation when clicking heart
    }
    
    if (!courseId) {
      console.error('Invalid courseId:', courseId);
      return;
    }
    
    // Optimistic update - toggle immediately
    const currentState = isFavorite(courseId);
    setCoursesWithProgress(prev => 
      prev.map(course => 
        course.course?.id === courseId 
          ? { ...course, isFavorite: !currentState }
          : course
      )
    );
    
    // Then toggle in backend
    const success = await toggleFavorite(courseId);
    
    // If failed, revert the optimistic update
    if (!success) {
      setCoursesWithProgress(prev => 
        prev.map(course => 
          course.course?.id === courseId 
            ? { ...course, isFavorite: currentState }
            : course
        )
      );
    }
  };

  const favoriteCourses = coursesWithProgress.filter(c => c.isFavorite);
  const otherCourses = coursesWithProgress.filter(c => !c.isFavorite);

  const role = userPlan === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

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

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: isMobile ? theme.typography.fontSize['2xl'] : theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.textPrimary,
          margin: 0,
          marginBottom: '32px',
        }}>
          Mis Cursos
        </h2>

        {/* Favoritos Section */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Favoritos
          </h3>

          {(isLoading || favoritesLoading || loadingProgress) ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: theme.borderRadius.lg,
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.textSecondary,
                margin: 0,
              }}>
                Cargando tus cursos...
              </p>
            </div>
          ) : favoriteCourses.length > 0 ? (
            <div style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: isMobile ? '0' : '20px',
              width: '100%',
              maxWidth: '100%',
            }}>
              {favoriteCourses.map((course) => (
                <div key={course.id} style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
                  <button
                    onClick={(e) => handleToggleFavorite(course.course?.id!, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 10,
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    aria-label="Quitar de favoritos"
                  >
                    <Heart size={20} fill={theme.colors.primary} color={theme.colors.primary} />
                  </button>
                  <div onClick={() => navigate(`/courses/${course.course?.id}`)}>
                    <CourseCard 
                      title={course.course?.title || 'Curso sin título'}
                      instructor={`${course.course?.owner?.firstName || ''} ${course.course?.owner?.lastName || ''}`.trim() || 'Instructor'}
                      thumbnailUrl={course.course?.thumbnailUrl || 'https://via.placeholder.com/300x200'}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: theme.borderRadius.lg,
            }}>
              <Heart size={48} color={theme.colors.textSecondary} style={{ marginBottom: '16px' }} />
              <p style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.textSecondary,
                margin: 0,
              }}>
                No tienes cursos marcados como favoritos
              </p>
            </div>
          )}
        </section>

        {/* Cursos Inscritos Section */}
        <section>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Otros Cursos Inscritos
          </h3>

          {(isLoading || favoritesLoading || loadingProgress) ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: theme.borderRadius.lg,
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.textSecondary,
                margin: 0,
              }}>
                Cargando tus cursos...
              </p>
            </div>
          ) : otherCourses.length > 0 ? (
            <div style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: isMobile ? '0' : '20px',
              width: '100%',
              maxWidth: '100%',
            }}>
              {otherCourses.map((course) => (
                <div key={course.id} style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
                  <button
                    onClick={(e) => handleToggleFavorite(course.course?.id!, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 10,
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    aria-label="Agregar a favoritos"
                  >
                    <Heart size={20} color={theme.colors.textSecondary} />
                  </button>
                  <div onClick={() => {
                    const courseId = course.course?.id;
                    if (courseId) {
                      navigate(`/courses/${courseId}`);
                    }
                  }}>
                    <CourseCard 
                      title={course.course?.title || 'Curso sin título'}
                      instructor={`${course.course?.owner?.firstName || ''} ${course.course?.owner?.lastName || ''}`.trim() || 'Instructor'}
                      thumbnailUrl={course.course?.thumbnailUrl || 'https://via.placeholder.com/300x200'}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : coursesWithProgress.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: theme.borderRadius.lg,
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.textSecondary,
                margin: 0,
                marginBottom: '16px',
              }}>
                Aún no estás inscrito en ningún curso
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
                  fontWeight: theme.typography.fontWeight.bold,
                  cursor: 'pointer',
                }}
              >
                Explorar Cursos
              </button>
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: theme.borderRadius.lg,
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.textSecondary,
                margin: 0,
              }}>
                Todos tus cursos están en favoritos
              </p>
            </div>
          )}
        </section>

        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role={role} />}

      {/* Help Button */}
      <HelpButton show={true} />
    </div>
  );
};
