import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Menu, X, CheckCircle, Circle, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { LogoutModal } from '../components/LogoutModal';
import { theme } from '../styles/theme';
import { ROUTES } from '../utils/constants';

interface LessonData {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Array<{ id: string; title: string; duration: number; completed?: boolean }>;
}

// Mock data
const MOCK_LESSON_DATA: Record<string, LessonData> = {
  'l1': {
    id: 'l1',
    title: '¿Qué es el reciclaje orgánico?',
    content: `
      <h2>¿Qué es el reciclaje orgánico?</h2>
      <p>El reciclaje orgánico es el proceso de <strong>transformar residuos orgánicos</strong> en compost o abono natural mediante la descomposición controlada.</p>
      
      <h3>Beneficios principales</h3>
      <ul>
        <li><strong>Reducción de residuos:</strong> Hasta un 40% de los residuos domésticos son orgánicos</li>
        <li><strong>Mejora del suelo:</strong> El compost enriquece la tierra con nutrientes</li>
        <li><strong>Reducción de emisiones:</strong> Menos residuos en vertederos = menos metano</li>
      </ul>
      
      <h3>Tipos de residuos orgánicos</h3>
      <ul>
        <li>🍎 Restos de frutas y verduras</li>
        <li>☕ Café y té</li>
        <li>🥚 Cáscaras de huevo</li>
        <li>🌿 Restos de poda y jardín</li>
      </ul>
      
      <p><strong>Importante:</strong> No todos los residuos orgánicos son compostables. Evita carnes, lácteos y aceites.</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 15,
  },
  'l2': {
    id: 'l2',
    title: 'Beneficios para el medio ambiente',
    content: `
      <h2>Beneficios ambientales del reciclaje orgánico</h2>
      <p>El compostaje no solo reduce residuos, sino que tiene un impacto positivo significativo en nuestro planeta.</p>
      
      <h3>🌍 Reducción de emisiones</h3>
      <p>Los residuos orgánicos en vertederos producen metano, un gas de efecto invernadero 25 veces más potente que el CO₂.</p>
      
      <h3>🌱 Mejora de suelos</h3>
      <p>El compost mejora la estructura del suelo, aumenta su capacidad de retención de agua y reduce la erosión.</p>
      
      <h3>💧 Conservación del agua</h3>
      <p>Los suelos enriquecidos con compost retienen mejor la humedad, reduciendo la necesidad de riego.</p>
      
      <h3>♻️ Economía circular</h3>
      <p>Convierte "residuos" en recursos valiosos, cerrando el ciclo de nutrientes de manera natural.</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 20,
  },
  'l3': {
    id: 'l3',
    title: 'Materiales reciclables',
    content: `
      <h2>Materiales reciclables en el hogar</h2>
      <p>Conocer qué materiales podemos reciclar es fundamental para un compostaje exitoso.</p>
      
      <h3>Materiales VERDES (Nitrógeno)</h3>
      <ul>
        <li>Restos de frutas y verduras</li>
        <li>Posos de café y bolsitas de té</li>
        <li>Cáscaras de huevo trituradas</li>
        <li>Restos de plantas frescas</li>
      </ul>
      
      <h3>Materiales MARRONES (Carbono)</h3>
      <ul>
        <li>Hojas secas</li>
        <li>Ramas pequeñas</li>
        <li>Cartón y papel (sin tinta)</li>
        <li>Aserrín natural</li>
      </ul>
      
      <h3>❌ NO compostar:</h3>
      <ul>
        <li>Carnes y pescados</li>
        <li>Lácteos</li>
        <li>Aceites y grasas</li>
        <li>Plantas enfermas</li>
        <li>Excrementos de mascotas</li>
      </ul>
      
      <p><strong>Regla de oro:</strong> Mantén un equilibrio 30:1 entre materiales marrones y verdes para un compost óptimo.</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 25,
  },
};

const MOCK_COURSE_STRUCTURE = {
  '1': {
    title: 'Reciclaje Orgánico Avanzado',
    modules: [
      {
        id: 'm1',
        title: 'Introducción',
        lessons: [
          { id: 'l1', title: '¿Qué es el reciclaje orgánico?', duration: 15, completed: true },
          { id: 'l2', title: 'Beneficios para el medio ambiente', duration: 20, completed: true },
          { id: 'l3', title: 'Materiales reciclables', duration: 25, completed: false },
        ],
      },
      {
        id: 'm2',
        title: 'Técnicas de Compostaje',
        lessons: [
          { id: 'l4', title: 'Tipos de compost', duration: 30, completed: false },
          { id: 'l5', title: 'Creación de una compostera', duration: 35, completed: false },
        ],
      },
    ],
  },
};

export const LessonNew: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { isAuthenticated, logout } = useAuth();
  const { isMobile } = useBreakpoint();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const lesson = lessonId ? MOCK_LESSON_DATA[lessonId] : null;
  const course = courseId ? MOCK_COURSE_STRUCTURE[courseId as keyof typeof MOCK_COURSE_STRUCTURE] : null;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate(ROUTES.HOME);
  };

  const handleLessonClick = (newLessonId: string) => {
    navigate(`/lesson/${courseId}/${newLessonId}`);
    setShowSidebar(false);
  };

  if (!lesson || !course) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: isMobile ? '24px' : '36px', color: 'white', marginBottom: '20px' }}>
            Lección no encontrada
          </h1>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            style={{
              padding: '12px 24px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

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
      }}>
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
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
          }}
        >
          <ArrowLeft size={20} />
          {!isMobile && 'Volver al curso'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 'bold',
            color: theme.colors.textPrimary,
            margin: 0,
          }}>
            {course.title}
          </h1>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
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

            {course.modules.map((module: Module) => (
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
                  {module.lessons.map((les) => (
                    <button
                      key={les.id}
                      onClick={() => handleLessonClick(les.id)}
                      style={{
                        padding: '12px',
                        backgroundColor: les.id === lessonId ? 'rgba(93, 187, 70, 0.2)' : 'transparent',
                        border: les.id === lessonId ? `1px solid ${theme.colors.primary}` : '1px solid transparent',
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
                        if (les.id !== lessonId) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (les.id !== lessonId) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {les.completed ? (
                        <CheckCircle size={18} color={theme.colors.primary} style={{ marginTop: '2px', flexShrink: 0 }} />
                      ) : (
                        <Circle size={18} color="rgba(255, 255, 255, 0.4)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: les.id === lessonId ? '600' : '500',
                          marginBottom: '4px',
                          lineHeight: 1.4,
                        }}>
                          {les.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}>
                          {les.duration} min
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
              {lesson.title}
            </h1>

            {/* Duration */}
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: isMobile ? '24px' : '32px',
            }}>
              Duración: {lesson.duration} minutos
            </p>

            {/* Video */}
            {lesson.videoUrl && (
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
                  src={lesson.videoUrl}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block', border: 'none' }}
                />
              </div>
            )}

            {/* Lesson Content */}
            <div
              style={{
                color: theme.colors.textPrimary,
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: '1.8',
              }}
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
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
