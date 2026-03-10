import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BottomNavigation, ProgressIndicator } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { HelpButton } from '../components/HelpButton';
import { theme } from '../styles/theme';
import { MOCK_COURSES_BASIC } from '../utils/constants';

const PRO_COURSES = [
  'Reciclaje con IA',
  'Hidrocarburos y su impacto ambiental',
  'Mediciones acuáticas',
];

export const DashboardPro: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

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
      <AppHeader userRole="STUDENT_PRO" />

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
          
          {MOCK_COURSES_BASIC.map((course) => (
            <div
              key={course.title}
              style={{
                marginBottom: '20px',
                padding: isMobile ? '16px' : '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: theme.borderRadius.lg,
              }}
            >
              <div style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.textPrimary,
                marginBottom: '8px',
              }}>
                {course.title}
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.textSecondary,
                marginBottom: '12px',
              }}>
                Profesor: {course.professor}
              </div>
              <ProgressIndicator
                progress={course.progress}
                label="Avance:"
                showPercentage={true}
              />
            </div>
          ))}
        </section>

        {/* PRO Courses Section */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Cursos disponibles con PRO
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {PRO_COURSES.map((course, index) => (
              <li
                key={course}
                onClick={() => navigate(`/courses/${index + 1}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.textPrimary,
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: 'rgba(93, 187, 70, 0.1)',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.primary}`,
                  cursor: 'pointer',
                }}
              >
                <Leaf size={20} color={theme.colors.primary} />
                {course}
              </li>
            ))}
          </ul>
        </section>

        {/* Spacer for mobile bottom navigation */}
        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role="STUDENT_PRO" />}

      {/* Help Button */}
      <HelpButton show={true} />
    </div>
  );
};
