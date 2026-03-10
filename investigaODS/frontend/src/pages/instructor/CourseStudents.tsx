import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, ROUTES } from '../../utils/constants';

const logoGD = "/logo.svg";

interface StudentProgress {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledAt: string;
  progress: number;
  lastAccess: string;
  completedLessons: number;
  totalLessons: number;
}

// Mock data
const MOCK_COURSE_STUDENTS: Record<string, {
  courseTitle: string;
  students: StudentProgress[];
}> = {
  '1': {
    courseTitle: 'Reciclaje Orgánico Avanzado',
    students: [
      {
        id: 'st-1',
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
        enrolledAt: '2025-01-05',
        progress: 85,
        lastAccess: '2025-01-29',
        completedLessons: 7,
        totalLessons: 8,
      },
      {
        id: 'st-2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@example.com',
        enrolledAt: '2025-01-10',
        progress: 62,
        lastAccess: '2025-01-28',
        completedLessons: 5,
        totalLessons: 8,
      },
      {
        id: 'st-3',
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@example.com',
        enrolledAt: '2025-01-15',
        progress: 100,
        lastAccess: '2025-01-27',
        completedLessons: 8,
        totalLessons: 8,
      },
      {
        id: 'st-4',
        firstName: 'Luis',
        lastName: 'Fernández',
        email: 'luis.fernandez@example.com',
        enrolledAt: '2025-01-20',
        progress: 25,
        lastAccess: '2025-01-26',
        completedLessons: 2,
        totalLessons: 8,
      },
    ],
  },
};

export const CourseStudents: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user, logout } = useAuth();

  const courseData = courseId ? MOCK_COURSE_STUDENTS[courseId] : null;

  const [searchTerm, setSearchTerm] = useState('');

  if (!courseData) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: COLORS.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ color: 'white', fontSize: '24px' }}>
          Curso no encontrado
        </div>
      </div>
    );
  }

  const filteredStudents = courseData.students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    alert('Exportar a CSV (próximamente)');
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return COLORS.primary;
    if (progress >= 50) return COLORS.secondary;
    return '#ff6b6b';
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          <img src={logoGD} alt="Logo" style={{ width: '50px', height: '40px' }} />
          <h1 style={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
            fontWeight: '100',
            color: 'white',
            margin: 0,
          }}>
            Investiga <span style={{ fontWeight: 'bold', color: COLORS.primary }}>ODS</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => navigate(ROUTES.INSTRUCTOR_COURSES)}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Mis Cursos
          </button>
          <span style={{ color: 'white', fontSize: '14px' }}>
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '60px 80px' }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
          <div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '10px',
            }}>
              Estudiantes
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              {courseData.courseTitle} • {courseData.students.length} estudiantes
            </p>
          </div>

          <button
            onClick={handleExport}
            style={{
              padding: '14px 30px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid white',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            📥 Exportar CSV
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '14px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              fontSize: '16px',
            }}
          />
        </div>

        {/* Students Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr',
            padding: '20px 25px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              NOMBRE
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              EMAIL
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              INSCRIPCIÓN
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              ÚLTIMO ACCESO
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              PROGRESO
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              LECCIONES
            </div>
          </div>

          {/* Table Body */}
          {filteredStudents.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '16px',
            }}>
              No se encontraron estudiantes
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr',
                  padding: '20px 25px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                  {student.firstName} {student.lastName}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {student.email}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {new Date(student.enrolledAt).toLocaleDateString('es-ES')}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {new Date(student.lastAccess).toLocaleDateString('es-ES')}
                </div>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${student.progress}%`,
                        height: '100%',
                        backgroundColor: getProgressColor(student.progress),
                        borderRadius: '10px',
                      }} />
                    </div>
                    <span style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}>
                      {student.progress}%
                    </span>
                  </div>
                </div>
                <div style={{ color: 'white', fontSize: '14px' }}>
                  {student.completedLessons}/{student.totalLessons}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }}>
          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
            }}>
              {courseData.students.length}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Total Estudiantes
            </div>
          </div>

          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.primary,
              marginBottom: '8px',
            }}>
              {Math.round(
                courseData.students.reduce((acc, s) => acc + s.progress, 0) / courseData.students.length
              )}%
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Progreso Promedio
            </div>
          </div>

          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.primary,
              marginBottom: '8px',
            }}>
              {courseData.students.filter(s => s.progress === 100).length}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Completados
            </div>
          </div>

          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.secondary,
              marginBottom: '8px',
            }}>
              {courseData.students.filter(s => s.progress > 0 && s.progress < 100).length}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              En Progreso
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
