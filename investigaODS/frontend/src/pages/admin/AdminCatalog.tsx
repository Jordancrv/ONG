import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { AppHeader } from '../../components/AppHeader';
import { BottomNavigation } from '../../components/mobile';
import { theme } from '../../styles/theme';
import { ROUTES } from '../../utils/constants';
import { coursesService } from '../../services/api.service';
import api from '../../utils/api';
import type { Course } from '../../types';

interface CourseData {
  id: number;
  title: string;
  instructorName: string;
  tierRequired: 'FREE' | 'BASIC' | 'PRO';
  level: string | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  students: number;
  createdAt: string;
}

export const AdminCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMobile } = useBreakpoint();

  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'FREE' | 'PRO'>('ALL');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      // Usar endpoint de admin para obtener todos los cursos (incluyendo privados)
      const response = await api.get('/admin/courses');
      const allCourses = response.data;
      
      // Cargar el conteo de estudiantes para cada curso
      const coursesWithStats = await Promise.all(
        allCourses.map(async (course: Course) => {
          try {
            const stats = await coursesService.getStats(course.id);
            return {
              id: course.id,
              title: course.title,
              instructorName: course.owner?.firstName && course.owner?.lastName
                ? `${course.owner.firstName} ${course.owner.lastName}`
                : course.owner?.email?.split('@')[0] || 'Sin instructor',
              tierRequired: course.tierRequired,
              level: course.level,
              visibility: course.visibility,
              students: stats.students?.total || 0,
              createdAt: course.createdAt,
            };
          } catch (error) {
            // Si falla stats, usar datos sin conteo de estudiantes
            return {
              id: course.id,
              title: course.title,
              instructorName: course.owner?.firstName && course.owner?.lastName
                ? `${course.owner.firstName} ${course.owner.lastName}`
                : course.owner?.email?.split('@')[0] || 'Sin instructor',
              tierRequired: course.tierRequired,
              level: course.level,
              visibility: course.visibility,
              students: 0,
              createdAt: course.createdAt,
            };
          }
        })
      );
      
      setCourses(coursesWithStats);
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Error al cargar cursos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Agrupar FREE y BASIC como "FREE" para el filtro
    const courseTier = (course.tierRequired === 'FREE' || course.tierRequired === 'BASIC') ? 'FREE' : 'PRO';
    const matchesTier = tierFilter === 'ALL' || courseTier === tierFilter;
    
    return matchesSearch && matchesTier;
  });

  const handleTogglePublish = async (courseId: number, courseTitle: string, currentVisibility: 'PUBLIC' | 'PRIVATE') => {
    const action = currentVisibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    if (window.confirm(`¿${action === 'PRIVATE' ? 'Ocultar' : 'Publicar'} "${courseTitle}"?`)) {
      try {
        await coursesService.update(courseId, {
          visibility: action
        });
        await loadCourses();
        alert(`Curso ${action === 'PUBLIC' ? 'publicado' : 'ocultado'} correctamente`);
      } catch (error) {
        console.error('Error updating course visibility:', error);
        alert('Error al actualizar la visibilidad del curso');
      }
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

      {/* Main Content */}
      <main style={{ padding: isMobile ? '20px 16px' : '60px 80px' }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? '24px' : '40px',
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '42px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '10px',
            }}>
              Gestión de Catálogo
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              {filteredCourses.length} cursos en el catálogo
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '20px',
          marginBottom: isMobile ? '20px' : '30px',
          alignItems: isMobile ? 'stretch' : 'center',
        }}>
          <input
            type="text"
            placeholder="Buscar por título o instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: isMobile ? '100%' : '500px',
              padding: isMobile ? '12px 16px' : '14px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              fontSize: '16px',
            }}
          />

          <div style={{ display: 'flex', gap: isMobile ? '8px' : '10px' }}>
            {(['ALL', 'FREE', 'PRO'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '10px 12px' : '10px 20px',
                  backgroundColor: tierFilter === tier ? theme.colors.primary : 'transparent',
                  color: tierFilter === tier ? theme.colors.textDark : 'white',
                  border: `2px solid ${tierFilter === tier ? theme.colors.primary : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: isMobile ? '13px' : '14px',
                }}
              >
                {tier === 'ALL' ? 'Todos' : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Courses List */}
        {isLoading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
          }}>
            Cargando cursos...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            No se encontraron cursos
          </div>
        ) : isMobile ? (
          /* Mobile Card View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Course Title */}
                <div>
                  <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {course.title}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                    {course.instructorName}
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: course.tierRequired === 'PRO' ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: course.tierRequired === 'PRO' ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {course.tierRequired}
                  </span>
                  {course.level && (
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {course.level}
                    </span>
                  )}
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: course.visibility === 'PUBLIC' ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                    color: course.visibility === 'PUBLIC' ? theme.colors.primary : '#ff6b6b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {course.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
                  </span>
                </div>

                {/* Students Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                    Estudiantes:
                  </span>
                  <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                    {course.students}
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleTogglePublish(course.id, course.title, course.visibility)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: course.visibility === 'PUBLIC' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(93, 187, 70, 0.2)',
                      color: course.visibility === 'PUBLIC' ? '#ff6b6b' : theme.colors.primary,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    {course.visibility === 'PRIVATE' ? '✅ Publicar' : '🔒 Ocultar'}
                  </button>
                  <button
                    onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr',
              padding: '20px 25px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                CURSO
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                INSTRUCTOR
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                TIER
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                NIVEL
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                ESTUDIANTES
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                ESTADO
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                ACCIONES
              </div>
            </div>

            {/* Table Body */}
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr',
                  padding: '20px 25px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {course.title}
                  </div>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {course.instructorName}
                </div>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: course.tierRequired === 'PRO' ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: course.tierRequired === 'PRO' ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {course.tierRequired}
                  </span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {course.level || '-'}
                </div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                  {course.students}
                </div>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: course.visibility === 'PUBLIC' ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                    color: course.visibility === 'PUBLIC' ? theme.colors.primary : '#ff6b6b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {course.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleTogglePublish(course.id, course.title, course.visibility)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: course.visibility === 'PUBLIC' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(93, 187, 70, 0.2)',
                      color: course.visibility === 'PUBLIC' ? '#ff6b6b' : theme.colors.primary,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {course.visibility === 'PRIVATE' ? '✅' : '🔒'}
                  </button>
                  <button
                    onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {isMobile && <BottomNavigation role="ADMIN" />}
    </div>
  );
};
