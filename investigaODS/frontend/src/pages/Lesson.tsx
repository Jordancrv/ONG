import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, FileText, Link as LinkIcon, LogOut } from 'lucide-react';
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
  resources: Array<{ title: string; url: string; type: string }>;
}

// Mock data - debe venir de API
const MOCK_LESSON_DATA: Record<string, LessonData> = {
  'l1': {
    id: 'l1',
    title: '¿Qué es el reciclaje orgánico?',
    content: `
# ¿Qué es el reciclaje orgánico?

El reciclaje orgánico es el proceso de **transformar residuos orgánicos** en compost o abono natural mediante la descomposición controlada.

## Beneficios principales

1. **Reducción de residuos**: Hasta un 40% de los residuos domésticos son orgánicos
2. **Mejora del suelo**: El compost enriquece la tierra con nutrientes
3. **Reducción de emisiones**: Menos residuos en vertederos = menos metano

## Tipos de residuos orgánicos

- 🍎 Restos de frutas y verduras
- ☕ Café y té
- 🥚 Cáscaras de huevo
- 🌿 Restos de poda y jardín

> **Importante**: No todos los residuos orgánicos son compostables. Evita carnes, lácteos y aceites.
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 15,
    resources: [
      { title: 'Guía de Reciclaje Orgánico PDF', url: '#', type: 'PDF' },
      { title: 'Lista de Materiales Compostables', url: '#', type: 'LINK' },
    ],
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
          { id: 'l1', title: '¿Qué es el reciclaje orgánico?' },
          { id: 'l2', title: 'Beneficios para el medio ambiente' },
        ],
      },
    ],
  },
};

export const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { isAuthenticated, logout } = useAuth();
  const { isMobile } = useBreakpoint();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const lesson = lessonId ? MOCK_LESSON_DATA[lessonId] : null;
  const course = courseId ? MOCK_COURSE_STRUCTURE[courseId as keyof typeof MOCK_COURSE_STRUCTURE] : null;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate(ROUTES.HOME);
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
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Simple Header for Lessons */}
      <header style={{
        padding: isMobile ? '16px' : '16px 40px',
        backgroundColor: theme.colors.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.colors.border}`,
        flexShrink: 0,
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
          }}
        >
          <ArrowLeft size={isMobile ? 20 : 22} />
          {isMobile ? 'Volver' : 'Volver al curso'}
        </button>

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
          <LogOut size={isMobile ? 20 : 22} />
        </button>
      </header>

      {/* Main Content - Full Width Scrollable */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: theme.colors.background,
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '1200px',
          margin: '0 auto',
          padding: isMobile ? '20px 16px 40px 16px' : '40px 60px',
        }}>
          {/* Course Info - Mobile */}
          {isMobile && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: 'rgba(93, 187, 70, 0.1)',
              borderRadius: '12px',
              borderLeft: `4px solid ${theme.colors.primary}`,
            }}>
              <p style={{
                fontSize: '12px',
                color: theme.colors.primary,
                fontWeight: '600',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {course.title}
              </p>
              <p style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
              }}>
                Duración: {lesson.duration} min
              </p>
            </div>
          )}

          {/* Lesson Title */}
          <h1 style={{
            fontSize: isMobile ? '22px' : '32px',
            fontWeight: 'bold',
            color: theme.colors.textPrimary,
            marginBottom: isMobile ? '20px' : '24px',
            lineHeight: 1.3,
          }}>
            {lesson.title}
          </h1>

          {/* Video */}
          {lesson.videoUrl && (
            <div style={{
              marginBottom: isMobile ? '24px' : '32px',
              borderRadius: isMobile ? '8px' : '12px',
              overflow: 'hidden',
              backgroundColor: '#000',
              width: '100%',
              aspectRatio: '16/9',
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
          <div style={{
            color: theme.colors.textPrimary,
            fontSize: isMobile ? '15px' : '16px',
            lineHeight: isMobile ? '1.7' : '1.8',
            marginBottom: isMobile ? '32px' : '40px',
          }}
            dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }}
          />

          {/* Resources */}
          {lesson.resources.length > 0 && (
            <div style={{
              marginBottom: isMobile ? '32px' : '40px',
              padding: isMobile ? '16px' : '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: isMobile ? '8px' : '12px',
              border: `1px solid ${theme.colors.border}`,
            }}>
              <h3 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 'bold',
                color: theme.colors.textPrimary,
                marginBottom: '16px',
                marginTop: 0,
              }}>
                📚 Recursos adicionales
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lesson.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isMobile ? '12px' : '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: theme.colors.primary,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      fontSize: isMobile ? '14px' : '15px',
                      fontWeight: '500',
                    }}
                  >
                    {resource.type === 'PDF' ? (
                      <Download size={isMobile ? 18 : 20} />
                    ) : resource.type === 'LINK' ? (
                      <LinkIcon size={isMobile ? 18 : 20} />
                    ) : (
                      <FileText size={isMobile ? 18 : 20} />
                    )}
                    <span style={{ flex: 1 }}>{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: isMobile ? '12px' : '16px',
            marginTop: 'auto',
          }}>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              style={{
                padding: isMobile ? '14px 20px' : '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: theme.colors.textPrimary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: isMobile ? '15px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: isMobile ? '100%' : 'auto',
                transition: 'all 0.2s',
              }}
            >
              <ArrowLeft size={18} />
              Lección anterior
            </button>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              style={{
                padding: isMobile ? '14px 20px' : '12px 24px',
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: isMobile ? '15px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: isMobile ? '100%' : 'auto',
                transition: 'all 0.2s',
              }}
            >
              Siguiente lección
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>

      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};
