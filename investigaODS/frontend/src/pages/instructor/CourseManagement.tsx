import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Settings, ArrowLeft, Edit2, BookOpen, CheckCircle, MessageSquare, Users as UsersIcon, Upload, FileText } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { BottomNavigation, ProgressIndicator } from '../../components/mobile';

const logoGD = "/logo.svg";

// Mock data
const COURSE_DATA = {
  title: 'Reciclaje Orgánico y Avanzado',
  category: 'Área Gestión de Residuos y Economía Circular',
  students: 45,
  courseProgress: 85,
  groupPerformance: {
    averageGrade: 91,
    dropout: 15,
    forumInteraction: 10,
    studentSatisfaction: 85,
  },
  status: 'PUBLISHED' as const,
};

const MODULES = [
  { id: 1, title: 'Generar Exámenes' },
  { id: 2, title: 'Calificar Exámenes' },
  { id: 3, title: 'Mensajería Interna' },
  { id: 4, title: 'Certificación Final' },
];

export const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingBottom: isMobile ? '80px' : '0',
    }}>
      {/* Header */}
      <header style={{
        padding: isMobile ? '16px' : '20px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isMobile && (
            <button
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.textPrimary,
                cursor: 'pointer',
                padding: '8px',
              }}
              aria-label="Menú"
            >
              <Menu size={24} />
            </button>
          )}
          <img src={logoGD} alt="Logo" style={{ width: isMobile ? '40px' : '50px', height: isMobile ? '32px' : '40px' }} />
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: isMobile ? theme.typography.fontSize.lg : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.textPrimary,
            margin: 0,
          }}>
            Investiga <span style={{ fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary }}>ODS</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', alignItems: 'center' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              padding: '8px',
              position: 'relative',
            }}
            aria-label="Notificaciones"
          >
            <Bell size={isMobile ? 20 : 24} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Configuración"
          >
            <Settings size={isMobile ? 20 : 24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/instructor/courses')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.base,
            marginBottom: '20px',
            padding: '8px 0',
          }}
        >
          <ArrowLeft size={20} />
          Gestión De Cursos
        </button>

        {/* Course Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{
              fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
              margin: 0,
              marginBottom: '8px',
            }}>
              {COURSE_DATA.title}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: theme.colors.primary,
                borderRadius: '2px',
              }} />
              <span style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.textSecondary,
              }}>
                {COURSE_DATA.category}
              </span>
            </div>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.textSecondary}`,
              borderRadius: theme.borderRadius.md,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            Editar portada
            <Edit2 size={16} />
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              marginBottom: '4px',
            }}>
              Alumnos:
            </div>
            <div style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
            }}>
              {COURSE_DATA.students}
            </div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.lg,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              marginBottom: '4px',
            }}>
              Avance del dictado:
            </div>
            <div style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
            }}>
              {COURSE_DATA.courseProgress}%
            </div>
          </div>
        </div>

        {/* Group Performance */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Desempeño Grupal
          </h3>
          
          <ProgressIndicator
            progress={COURSE_DATA.groupPerformance.averageGrade}
            label="Notas Promedio:"
            showPercentage={true}
          />
          <div style={{ height: '16px' }} />
          <ProgressIndicator
            progress={COURSE_DATA.groupPerformance.dropout}
            label="Desgranamiento"
            showPercentage={true}
          />
          <div style={{ height: '16px' }} />
          <ProgressIndicator
            progress={COURSE_DATA.groupPerformance.forumInteraction}
            label="Nivel de Interacción en Foros"
            showPercentage={true}
          />
          <div style={{ height: '16px' }} />
          <ProgressIndicator
            progress={COURSE_DATA.groupPerformance.studentSatisfaction}
            label="Encuesta Satisfacción Estudiantil"
            showPercentage={true}
          />
        </section>

        {/* Manejo del Aula */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Manejo del Aula
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {[
              { icon: <BookOpen size={32} />, label: 'Crear Módulo' },
              { icon: <CheckCircle size={32} />, label: 'Evaluar Módulo' },
              { icon: <MessageSquare size={32} />, label: 'Módulo Nuevo' },
              { icon: <UsersIcon size={32} />, label: 'Ver Foro' },
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.textPrimary,
                  cursor: 'pointer',
                  minHeight: '120px',
                }}
              >
                {action.icon}
                <span style={{
                  fontSize: theme.typography.fontSize.sm,
                  textAlign: 'center',
                }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px',
            marginTop: '12px',
          }}>
            {MODULES.map((module) => (
              <button
                key={module.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.textPrimary,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  textAlign: 'center',
                  minHeight: '60px',
                }}
              >
                {module.title}
              </button>
            ))}
          </div>
        </section>

        {/* Status */}
        <section style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: theme.borderRadius.lg,
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.textPrimary,
              fontWeight: theme.typography.fontWeight.semibold,
            }}>
              Estado
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: theme.colors.success,
              borderRadius: theme.borderRadius.md,
              color: 'white',
              fontSize: theme.typography.fontSize.sm,
            }}>
              <Upload size={16} />
              Publicada
            </div>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            <FileText size={16} />
            Volver a Borrador
          </button>
        </section>

        {/* Spacer for mobile bottom navigation */}
        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role="INSTRUCTOR" />}
    </div>
  );
};
