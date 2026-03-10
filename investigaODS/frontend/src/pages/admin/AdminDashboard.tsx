import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { AppHeader } from '../../components/AppHeader';
import { BottomNavigation } from '../../components/mobile';
import { theme } from '../../styles/theme';
import { ROUTES } from '../../utils/constants';
import { coursesService } from '../../services/api.service';
import api from '../../utils/api';

interface AdminStats {
  openCourses: number;
  assignedInstructors: number;
  proPlanStudents: number;
  freePlanStudents: number;
}

interface RecentActivity {
  id: string;
  type: 'USER_REGISTERED' | 'COURSE_PUBLISHED' | 'INSTRUCTOR_JOINED' | 'COURSE_UPDATED';
  description: string;
  timestamp: string;
}

const getActivityTypeLabel = (type: RecentActivity['type']): string => {
  const labels: Record<RecentActivity['type'], string> = {
    'USER_REGISTERED': 'USUARIO REGISTRADO',
    'COURSE_PUBLISHED': 'CURSO PUBLICADO',
    'INSTRUCTOR_JOINED': 'INSTRUCTOR UNIDO',
    'COURSE_UPDATED': 'CURSO ACTUALIZADO',
  };
  return labels[type];
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const [stats, setStats] = useState<AdminStats>({
    openCourses: 0,
    assignedInstructors: 0,
    proPlanStudents: 0,
    freePlanStudents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentActivities();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);

      // Get all courses
      const courses = await coursesService.getAll();
      const openCourses = courses.filter(c => c.visibility === 'PUBLIC').length;

      // Get all users
      const usersResponse = await api.get('/admin/users');
      const users = usersResponse.data;

      // Count instructors
      const assignedInstructors = users.filter((u: any) => u.role === 'INSTRUCTOR').length;

      // Count students by tier
      const students = users.filter((u: any) => u.role === 'STUDENT');
      const proPlanStudents = students.filter((u: any) => u.tier === 'PRO').length;
      const freePlanStudents = students.filter((u: any) => !u.tier || u.tier === 'BASIC').length;

      setStats({
        openCourses,
        assignedInstructors,
        proPlanStudents,
        freePlanStudents,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      setIsLoadingActivities(true);

      // Get all users and courses
      const [usersResponse, courses] = await Promise.all([
        api.get('/admin/users'),
        coursesService.getAll(),
      ]);

      const users = usersResponse.data;
      const activities: RecentActivity[] = [];

      // Sort users by creation date (most recent first)
      const sortedUsers = [...users].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Sort courses by updated date (most recent first)
      const sortedCourses = [...courses].sort((a: any, b: any) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      // Add recent users (students and instructors)
      sortedUsers.slice(0, 3).forEach((user: any) => {
        const userName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.email.split('@')[0];
        
        if (user.role === 'INSTRUCTOR') {
          activities.push({
            id: `user-${user.id}`,
            type: 'INSTRUCTOR_JOINED',
            description: `Nuevo instructor: ${userName}`,
            timestamp: new Date(user.createdAt).toLocaleString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
          });
        } else if (user.role === 'STUDENT') {
          activities.push({
            id: `user-${user.id}`,
            type: 'USER_REGISTERED',
            description: `Nuevo usuario: ${userName}`,
            timestamp: new Date(user.createdAt).toLocaleString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
          });
        }
      });

      // Add recent courses
      sortedCourses.slice(0, 3).forEach((course: any) => {
        const isNew = new Date(course.createdAt).getTime() === new Date(course.updatedAt).getTime();
        activities.push({
          id: `course-${course.id}`,
          type: isNew ? 'COURSE_PUBLISHED' : 'COURSE_UPDATED',
          description: isNew 
            ? `Curso publicado: ${course.title}`
            : `Curso actualizado: ${course.title}`,
          timestamp: new Date(course.updatedAt).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => {
        const dateA = new Date(a.timestamp.split('/').reverse().join('-'));
        const dateB = new Date(b.timestamp.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });

      // Keep only the 5 most recent
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingTop: isMobile ? '72px' : '84px',
      paddingBottom: isMobile ? '80px' : '0',
      boxSizing: 'border-box',
    }}>
      <AppHeader userRole="ADMIN" />

      <main style={{
        padding: isMobile ? '20px 16px' : '60px 80px',
        maxWidth: isMobile ? '100%' : '1400px',
        margin: '0 auto',
      }}>
        <div style={{ marginBottom: isMobile ? '24px' : '50px' }}>
          <h1 style={{
            fontSize: isMobile ? theme.typography.fontSize['2xl'] : '48px',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            marginBottom: '10px',
          }}>
            Panel de Administración
          </h1>
          {!isMobile && (
            <p style={{
              fontSize: '20px',
              color: theme.colors.textSecondary,
            }}>
              Gestiona usuarios, cursos y suscripciones de la plataforma
            </p>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px' : '25px',
          marginBottom: isMobile ? '24px' : '50px',
        }}>
          <div style={{
            padding: isMobile ? '20px' : '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize.xs : theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              marginBottom: '8px',
            }}>
              {isMobile ? 'Cursos abiertos' : 'Cantidad de cursos abiertos'}
            </div>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize['2xl'] : '42px',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
            }}>
              {isLoading ? '...' : stats.openCourses}
            </div>
          </div>

          <div style={{
            padding: isMobile ? '20px' : '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize.xs : theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              marginBottom: '8px',
            }}>
              {isMobile ? 'Docentes' : 'Cant. de docentes asignados'}
            </div>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize['2xl'] : '42px',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
            }}>
              {isLoading ? '...' : stats.assignedInstructors}
            </div>
          </div>

          <div style={{
            padding: isMobile ? '20px' : '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize.xs : theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              marginBottom: '8px',
            }}>
              Alumnos PRO
            </div>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize['2xl'] : '42px',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.primary,
            }}>
              {isLoading ? '...' : stats.proPlanStudents}
            </div>
          </div>

          <div style={{
            padding: isMobile ? '20px' : '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize.xs : theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              marginBottom: '8px',
            }}>
              Alumnos free
            </div>
            <div style={{
              fontSize: isMobile ? theme.typography.fontSize['2xl'] : '42px',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
            }}>
              {isLoading ? '...' : stats.freePlanStudents}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: isMobile ? '24px' : '50px' }}>
          {isMobile && (
            <h2 style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
              marginBottom: '16px',
            }}>
              Acciones Rápidas
            </h2>
          )}
          {!isMobile && (
            <h2 style={{
              fontSize: '32px',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
              marginBottom: '25px',
            }}>
              Acciones Rápidas
            </h2>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '12px' : '20px',
          }}>
            <button
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
              style={{
                padding: isMobile ? '20px' : '25px',
                backgroundColor: theme.colors.primary,
                color: '#062860',
                border: 'none',
                borderRadius: theme.borderRadius.lg,
                fontWeight: theme.typography.fontWeight.bold,
                cursor: 'pointer',
                fontSize: isMobile ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <span style={{ fontSize: isMobile ? '24px' : '32px' }}>👥</span>
              <span>Gestionar Usuarios</span>
            </button>

            <button
              onClick={() => navigate(ROUTES.ADMIN_CATALOG)}
              style={{
                padding: isMobile ? '20px' : '25px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: theme.colors.textPrimary,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                fontWeight: theme.typography.fontWeight.bold,
                cursor: 'pointer',
                fontSize: isMobile ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <span style={{ fontSize: isMobile ? '24px' : '32px' }}>📚</span>
              <span>Gestionar Cursos</span>
            </button>

            <button
              onClick={() => navigate(ROUTES.ADMIN_SUBSCRIPTIONS)}
              style={{
                padding: isMobile ? '20px' : '25px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: theme.colors.textPrimary,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                fontWeight: theme.typography.fontWeight.bold,
                cursor: 'pointer',
                fontSize: isMobile ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <span style={{ fontSize: isMobile ? '24px' : '32px' }}>💳</span>
              <span>Gestionar Suscripciones</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          {isMobile && (
            <h2 style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
              marginBottom: '16px',
            }}>
              Actividad Reciente
            </h2>
          )}
          {!isMobile && (
            <h2 style={{
              fontSize: '32px',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
              marginBottom: '25px',
            }}>
              Actividad Reciente
            </h2>
          )}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
            minHeight: isLoadingActivities ? '200px' : 'auto',
            display: isLoadingActivities ? 'flex' : 'block',
            alignItems: isLoadingActivities ? 'center' : 'stretch',
            justifyContent: isLoadingActivities ? 'center' : 'flex-start',
          }}>
            {isLoadingActivities ? (
              <div style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.textSecondary,
              }}>
                Cargando actividades...
              </div>
            ) : recentActivities.length === 0 ? (
              <div style={{
                padding: isMobile ? '30px 16px' : '40px 30px',
                textAlign: 'center',
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.base,
              }}>
                No hay actividad reciente
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    padding: isMobile ? '16px' : '20px 30px',
                    borderBottom: index < recentActivities.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '12px' : '0',
                  }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: isMobile ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
                    color: theme.colors.textPrimary,
                    marginBottom: '5px',
                  }}>
                    {activity.description}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.textSecondary,
                  }}>
                    {activity.timestamp}
                  </div>
                </div>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(93, 187, 70, 0.2)',
                  color: theme.colors.primary,
                  borderRadius: '15px',
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.bold,
                  whiteSpace: 'nowrap',
                }}>
                  {getActivityTypeLabel(activity.type)}
                </span>
              </div>
              ))
            )}
          </div>
        </div>

        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {isMobile && <BottomNavigation role="ADMIN" />}
    </div>
  );
};
