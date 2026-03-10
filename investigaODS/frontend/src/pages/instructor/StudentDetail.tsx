import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Settings, ArrowLeft, Edit2 } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { BottomNavigation, ProgressIndicator } from '../../components/mobile';

const logoGD = "/logo.svg";

// Mock data
const STUDENT_DATA = {
  name: 'Lábaque Federico',
  dni: 'DNI: 27548064',
  email: 'federicolabaque@gmail.com',
  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  courses: [
    'Reciclaje Orgánico y Avanzado',
    'Compost Agroecológico',
  ],
};

const ACTIVITIES = [
  { module: 'M1', grades: ['', '', '', ''] },
  { module: 'M2', grades: ['', '', '', ''] },
];

const MODULES = [
  { id: 1, title: 'Introducción al Reciclaje', progress: 85 },
  { id: 2, title: 'Reciclaje Avanzado', progress: 52 },
  { id: 3, title: 'Reciclando ando', progress: 20 },
  { id: 4, title: 'Reciclando ando', progress: 0, label: 'S/D' },
];

export const StudentDetail: React.FC = () => {
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
          onClick={() => navigate('/instructor/students')}
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
          Gestión Estudiantes
        </button>

        {/* Student Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: theme.borderRadius.lg,
        }}>
          <div style={{
            position: 'relative',
          }}>
            <div style={{
              width: isMobile ? '80px' : '100px',
              height: isMobile ? '80px' : '100px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: theme.colors.card,
            }}>
              <img
                src={STUDENT_DATA.photoUrl}
                alt={STUDENT_DATA.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <button
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Editar"
            >
              <Edit2 size={16} color="white" />
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.textPrimary,
              margin: 0,
              marginBottom: '4px',
            }}>
              {STUDENT_DATA.name}
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              margin: 0,
            }}>
              {STUDENT_DATA.dni} / {STUDENT_DATA.email}
            </p>
          </div>
        </div>

        {/* Courses */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            CURSOS:
          </h3>
          {STUDENT_DATA.courses.map((course, index) => (
            <div
              key={index}
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: theme.borderRadius.md,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: theme.colors.primary,
                borderRadius: '2px',
              }} />
              <span style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.textPrimary,
              }}>
                {course}
              </span>
            </div>
          ))}
        </section>

        {/* Calificar Actividades */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Calificar Actividades
          </h3>
          <div style={{
            overflowX: 'auto',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: theme.borderRadius.lg,
            }}>
              <thead>
                <tr style={{
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.textSecondary,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}>
                    
                  </th>
                  {['M1', 'M2', 'M3', 'M4'].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.textSecondary,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.map((activity, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      borderBottom: rowIndex < ACTIVITIES.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                    }}
                  >
                    <td style={{
                      padding: '12px',
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.textPrimary,
                    }}>
                      {activity.module}
                    </td>
                    {activity.grades.map((grade, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: theme.borderRadius.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                        }}>
                          {grade}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Module Progress */}
        <section>
          {MODULES.map((module) => (
            <div key={module.id} style={{ marginBottom: '20px' }}>
              <ProgressIndicator
                progress={module.progress}
                label={`Módulo ${module.id} - ${module.title}`}
                showPercentage={!module.label}
              />
              {module.label && (
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                  textAlign: 'right',
                  marginTop: '4px',
                }}>
                  {module.label}
                </div>
              )}
            </div>
          ))}

          <button
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '24px',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.textSecondary}`,
              borderRadius: theme.borderRadius.md,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            VER MODO IA
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
