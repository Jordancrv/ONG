import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, CheckCircle, Circle, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { LogoutModal } from '../components/LogoutModal';
import { theme } from '../styles/theme';
import { ROUTES } from '../utils/constants';

interface Module {
  id: string;
  title: string;
  lessons: Array<{ id: number; title: string; duration: number; completed?: boolean }>;
}

const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Introducción',
    lessons: [
      { id: 1, title: '¿Qué es el reciclaje orgánico?', duration: 15, completed: true },
      { id: 2, title: 'Beneficios para el medio ambiente', duration: 20, completed: true },
      { id: 3, title: 'Materiales reciclables', duration: 25, completed: false },
    ],
  },
  {
    id: 'm2',
    title: 'Técnicas de Compostaje',
    lessons: [
      { id: 4, title: 'Tipos de compost', duration: 30, completed: false },
      { id: 5, title: 'Creación de una compostera', duration: 35, completed: false },
    ],
  },
];

export const LeccionDemo: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isMobile } = useBreakpoint();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate(ROUTES.HOME);
  };

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lecciones/${lessonId}`);
    setShowSidebar(false);
  };

  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: theme.colors.background,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px',
        backgroundColor: theme.colors.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.colors.border}`,
        flexShrink: 0,
        zIndex: 90,
        position: 'relative',
      }}>
        <button
          onClick={() => navigate('/courses/reciclaje-organico-avanzado')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: theme.colors.primary,
            cursor: 'pointer',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '600',
            padding: '8px',
            zIndex: 1,
          }}
        >
          <ArrowLeft size={20} />
          {!isMobile && 'Volver al curso'}
        </button>

        <h1 style={{
          fontSize: isMobile ? '14px' : '18px',
          fontWeight: 'bold',
          color: theme.colors.textPrimary,
          margin: 0,
          position: isMobile ? 'absolute' : 'relative',
          left: isMobile ? '50%' : 'auto',
          transform: isMobile ? 'translateX(-50%)' : 'none',
        }}>
          Reciclaje Orgánico Avanzado
        </h1>

        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.textPrimary,
            cursor: 'pointer',
            padding: '8px',
            zIndex: 1,
          }}
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content with Sidebar */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Sidebar Overlay (Mobile) */}
        {isMobile && showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
            }}
          />
        )}

        {/* Sidebar */}
        <aside style={{
          width: isMobile ? '280px' : '320px',
          backgroundColor: theme.colors.backgroundLight,
          borderRight: `1px solid ${theme.colors.border}`,
          overflowY: 'auto',
          flexShrink: 0,
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? (showSidebar ? 0 : '-280px') : 'auto',
          height: isMobile ? '100vh' : 'auto',
          zIndex: 999,
          transition: 'left 0.3s ease',
          paddingTop: isMobile ? '70px' : '0',
        }}>
          {/* Close button (Mobile) */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: theme.colors.textPrimary,
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <X size={24} />
            </button>
          )}

          <div style={{ padding: '24px 20px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: theme.colors.textPrimary,
              marginBottom: '20px',
              marginTop: 0,
            }}>
              Contenido del Curso
            </h2>

            {MOCK_MODULES.map((module: Module) => (
              <div key={module.id} style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.colors.primary,
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {module.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson.id)}
                      style={{
                        padding: '12px',
                        backgroundColor: lesson.id === 3 ? 'rgba(93, 187, 70, 0.2)' : 'transparent',
                        border: lesson.id === 3 ? `1px solid ${theme.colors.primary}` : '1px solid transparent',
                        borderRadius: '8px',
                        color: theme.colors.textPrimary,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (lesson.id !== 3) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (lesson.id !== 3) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {lesson.completed ? (
                        <CheckCircle size={18} color={theme.colors.primary} style={{ marginTop: '2px', flexShrink: 0 }} />
                      ) : (
                        <Circle size={18} color="rgba(255, 255, 255, 0.4)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: lesson.id === 3 ? '600' : '500',
                          marginBottom: '4px',
                          lineHeight: 1.4,
                        }}>
                          {lesson.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}>
                          {lesson.duration} min
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: theme.colors.background,
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: isMobile ? '20px 16px 40px 16px' : '40px 60px',
          }}>
            {/* Lesson Title */}
            <h1 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: theme.colors.textPrimary,
              marginBottom: '8px',
              lineHeight: 1.3,
            }}>
              Materiales reciclables
            </h1>

            {/* Duration */}
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: isMobile ? '24px' : '32px',
            }}>
              Duración: 25 minutos
            </p>

            {/* Video */}
            <div style={{
              marginBottom: isMobile ? '32px' : '40px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#000',
              width: '100%',
              aspectRatio: '16/9',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Materiales reciclables"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block', border: 'none' }}
              />
            </div>

            {/* Lesson Content */}
            <div
              style={{
                color: theme.colors.textPrimary,
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: '1.8',
              }}
            >
              <h2 style={{ fontSize: isMobile ? '20px' : '24px', marginTop: 0 }}>Materiales reciclables en el hogar</h2>
              <p>Conocer qué materiales podemos reciclar es fundamental para un compostaje exitoso.</p>
              
              <h3 style={{ fontSize: isMobile ? '18px' : '20px', color: theme.colors.primary, marginTop: '32px' }}>Materiales VERDES (Nitrógeno)</h3>
              <ul style={{ paddingLeft: '24px', lineHeight: '2' }}>
                <li>Restos de frutas y verduras</li>
                <li>Posos de café y bolsitas de té</li>
                <li>Cáscaras de huevo trituradas</li>
                <li>Restos de plantas frescas</li>
              </ul>
              
              <h3 style={{ fontSize: isMobile ? '18px' : '20px', color: theme.colors.primary, marginTop: '32px' }}>Materiales MARRONES (Carbono)</h3>
              <ul style={{ paddingLeft: '24px', lineHeight: '2' }}>
                <li>Hojas secas</li>
                <li>Ramas pequeñas</li>
                <li>Cartón y papel (sin tinta)</li>
                <li>Aserrín natural</li>
              </ul>
              
              <h3 style={{ fontSize: isMobile ? '18px' : '20px', color: theme.colors.danger, marginTop: '32px' }}>❌ NO compostar:</h3>
              <ul style={{ paddingLeft: '24px', lineHeight: '2' }}>
                <li>Carnes y pescados</li>
                <li>Lácteos</li>
                <li>Aceites y grasas</li>
                <li>Plantas enfermas</li>
                <li>Excrementos de mascotas</li>
              </ul>
              
              <div style={{
                marginTop: '32px',
                padding: isMobile ? '16px' : '20px',
                backgroundColor: 'rgba(93, 187, 70, 0.1)',
                borderRadius: '8px',
                borderLeft: `4px solid ${theme.colors.primary}`,
              }}>
                <p style={{ margin: 0 }}>
                  <strong>Regla de oro:</strong> Mantén un equilibrio 30:1 entre materiales marrones y verdes para un compost óptimo.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Menu Button (Mobile Only) */}
      {isMobile && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: theme.colors.primary,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Menu size={28} color="white" />
        </button>
      )}

      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};
