import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { COLORS, ROUTES } from '../utils/constants';

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
  'l2': {
    id: 'l2',
    title: 'Beneficios para el medio ambiente',
    content: `
# Beneficios Ambientales del Reciclaje Orgánico

El reciclaje orgánico tiene un **impacto significativo** en la salud del planeta.

## Impacto en el cambio climático

- Reduce las emisiones de gases de efecto invernadero
- Secuestra carbono en el suelo
- Disminuye la necesidad de fertilizantes químicos

## Conservación de recursos

El compostaje casero puede reducir hasta **30% de los residuos domésticos** que terminan en vertederos.
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 20,
    resources: [],
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
      {
        id: 'm2',
        title: 'Técnicas de Compostaje',
        lessons: [
          { id: 'l3', title: 'Tipos de compost' },
          { id: 'l4', title: 'Creación de una compostera' },
        ],
      },
    ],
  },
};

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user, logout } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  const lesson = lessonId ? MOCK_LESSON_DATA[lessonId] : null;
  const course = courseId ? MOCK_COURSE_STRUCTURE[courseId as keyof typeof MOCK_COURSE_STRUCTURE] : null;

  if (!lesson || !course) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', color: 'white', marginBottom: '20px' }}>
            Lección no encontrada
          </h1>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            style={{
              padding: '12px 30px',
              backgroundColor: COLORS.primary,
              color: COLORS.textDark,
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    setIsCompleted(true);
    // TODO: Llamar API para marcar como completada
    console.log('Marking lesson as completed:', lessonId);
  };

  const handleNextLesson = () => {
    // Lógica simplificada para ir a la siguiente lección
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    if (currentIndex < allLessons.length - 1) {
      navigate(ROUTES.LEARN(courseId!, allLessons[currentIndex + 1].id));
      setIsCompleted(false);
    } else {
      alert('¡Felicidades! Has completado el curso.');
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      display: 'flex',
    }}>
      {/* Sidebar - Course Navigation */}
      <aside style={{
        width: '300px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '20px',
        overflowY: 'auto',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          ← Volver al Dashboard
        </button>

        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px',
        }}>
          {course.title}
        </h2>

        {course.modules.map((module) => (
          <div key={module.id} style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: COLORS.primary,
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}>
              {module.title}
            </h3>
            {module.lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  navigate(ROUTES.LEARN(courseId!, l.id));
                  setIsCompleted(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: l.id === lessonId ? COLORS.primary : 'transparent',
                  color: l.id === lessonId ? COLORS.textDark : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '8px',
                  fontSize: '14px',
                }}
              >
                {l.id === lessonId && '▶ '}
                {l.title}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top Bar */}
        <div style={{
          padding: '20px 40px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}>
              {lesson.title}
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '5px 0 0',
            }}>
              Estudiante: {user?.firstName} {user?.lastName} • Duración: {lesson.duration} min
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {isCompleted ? (
              <span style={{
                padding: '10px 20px',
                backgroundColor: COLORS.primary,
                color: COLORS.textDark,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
                ✓ Completada
              </span>
            ) : (
              <button
                onClick={handleMarkComplete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: COLORS.primary,
                  color: COLORS.textDark,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Marcar como Completada
            </button>
          )}
            
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Video Player */}
        {lesson.videoUrl && (
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#000',
          }}>
            <iframe
              width="100%"
              height="100%"
              src={lesson.videoUrl}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          </div>
        )}

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '40px',
          overflowY: 'auto',
        }}>
          {/* Lesson Content (Markdown) */}
          <div style={{
            color: 'white',
            fontSize: '16px',
            lineHeight: '1.8',
            maxWidth: '800px',
          }}>
            {lesson.content.split('\n').map((line: string, idx: number) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={idx} style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                    {line.replace('# ', '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: COLORS.primary }}>
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={idx} style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    {line.replace('- ', '')}
                  </li>
                );
              }
              if (line.startsWith('> ')) {
                return (
                  <blockquote key={idx} style={{
                    borderLeft: `4px solid ${COLORS.primary}`,
                    paddingLeft: '20px',
                    margin: '20px 0',
                    fontStyle: 'italic',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}>
                    {line.replace('> ', '')}
                  </blockquote>
                );
              }
              if (line.trim() === '') {
                return <br key={idx} />;
              }
              return <p key={idx} style={{ marginBottom: '15px' }}>{line}</p>;
            })}
          </div>

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '15px',
              }}>
                📚 Recursos Adicionales
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lesson.resources.map((resource: { title: string; url: string; type: string }, idx: number) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '15px 20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{resource.title}</span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: COLORS.primary,
                      color: COLORS.textDark,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {resource.type}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
          }}>
            <button
              onClick={handleNextLesson}
              disabled={!isCompleted}
              style={{
                padding: '14px 30px',
                backgroundColor: isCompleted ? COLORS.primary : '#888',
                color: isCompleted ? COLORS.textDark : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: isCompleted ? 'pointer' : 'not-allowed',
                fontSize: '16px',
              }}
            >
              Siguiente Lección →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
