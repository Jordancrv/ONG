import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { AppHeader } from '../../components/AppHeader';
import { BottomNavigation } from '../../components/mobile';
import { theme } from '../../styles/theme';
import { ROUTES } from '../../utils/constants';
import { coursesService, tagsService } from '../../services/api.service';

interface Tag {
  id: number;
  name: string;
}

export const CourseCreate: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Principiante',
    tierRequired: 'FREE',
    visibility: 'PUBLIC',
    tags: [] as string[],
  });

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await tagsService.getAll();
      setAvailableTags(tags);
    } catch (err: any) {
      console.error('Error loading tags:', err);
      // No mostrar error si no hay tags, simplemente continuar
      setAvailableTags([]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleTag = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName],
    }));
  };

  const addNewTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      // Agregar a los tags seleccionados
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      
      // Agregar a la lista de tags disponibles visualmente (con ID temporal)
      if (!availableTags.some(tag => tag.name === trimmedTag)) {
        setAvailableTags(prev => [...prev, { id: Date.now(), name: trimmedTag }]);
      }
      
      setNewTag('');
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Descartar los cambios y volver?')) {
      navigate(ROUTES.INSTRUCTOR_COURSES);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      setError('Por favor ingresa un título para el curso');
      return;
    }
    if (!formData.description.trim()) {
      setError('Por favor ingresa una descripción para el curso');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        tierRequired: formData.tierRequired,
        visibility: formData.visibility,
        tags: formData.tags,
      };

      const createdCourse = await coursesService.create(courseData);
      
      setIsLoading(false);
      
      // Mostrar mensaje de éxito y redirigir
      alert(`✅ Curso "${createdCourse.title}" creado exitosamente`);
      navigate(ROUTES.INSTRUCTOR_COURSES);
    } catch (err: any) {
      setIsLoading(false);
      
      // Extraer mensaje de error del backend
      let errorMsg = 'Error al crear el curso. Por favor, intenta nuevamente.';
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      console.error('Error creating course:', err);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingTop: isMobile ? '72px' : '84px',
      paddingBottom: isMobile ? '90px' : '0',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <AppHeader userRole="INSTRUCTOR" />

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '60px 80px',
        maxWidth: isMobile ? '100%' : '1200px',
        margin: '0 auto',
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: isMobile ? '24px' : '40px',
          gap: isMobile ? '16px' : '0',
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '42px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '10px',
            }}>
              Crear Nuevo Curso
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              Completa la información básica para comenzar
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: isMobile ? '12px' : '15px',
            width: isMobile ? '100%' : 'auto',
          }}>
            <button
              onClick={handleCancel}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '12px 16px' : '14px 30px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid white',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ✖️ Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '12px 16px' : '14px 30px',
                backgroundColor: isLoading ? 'rgba(93, 187, 70, 0.5)' : theme.colors.primary,
                color: theme.colors.textDark,
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '1';
              }}
            >
              {isLoading ? '⏳ Creando...' : '✨ Crear Curso'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: isMobile ? '20px' : '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Título */}
          <div style={{ marginBottom: isMobile ? '24px' : '30px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: isMobile ? '15px' : '16px',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}>
              Título del Curso <span style={{ color: theme.colors.primary }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ej: Reciclaje Orgánico Avanzado"
              style={{
                width: '100%',
                padding: isMobile ? '12px' : '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: isMobile ? '15px' : '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(93, 187, 70, 0.1)';
                e.target.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = theme.colors.primary;
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: isMobile ? '24px' : '30px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: isMobile ? '15px' : '16px',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}>
              Descripción <span style={{ color: theme.colors.primary }}>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe de qué trata tu curso, qué aprenderán los estudiantes..."
              rows={isMobile ? 5 : 6}
              style={{
                width: '100%',
                padding: isMobile ? '12px' : '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: isMobile ? '15px' : '16px',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(93, 187, 70, 0.1)';
                e.target.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = theme.colors.primary;
              }}
            />
          </div>

          {/* Nivel y Tier */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '24px' : '30px',
          }}>
            {/* Nivel */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: isMobile ? '15px' : '16px',
                marginBottom: '10px',
                fontWeight: 'bold',
              }}>
                Nivel <span style={{ color: theme.colors.primary }}>*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '12px' : '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: '8px',
                  fontSize: isMobile ? '15px' : '16px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(93, 187, 70, 0.1)';
                  e.target.style.borderColor = theme.colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = theme.colors.primary;
                }}
              >
                <option value="Principiante" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>Principiante</option>
                <option value="Intermedio" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>Intermedio</option>
                <option value="Avanzado" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>Avanzado</option>
              </select>
            </div>

            {/* Tier */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: isMobile ? '15px' : '16px',
                marginBottom: '10px',
                fontWeight: 'bold',
              }}>
                Tier <span style={{ color: theme.colors.secondary }}>*</span>
              </label>
              <select
                value={formData.tierRequired}
                onChange={(e) => handleInputChange('tierRequired', e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '12px' : '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: `2px solid ${theme.colors.secondary}`,
                  borderRadius: '8px',
                  fontSize: isMobile ? '15px' : '16px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(217, 210, 3, 0.1)';
                  e.target.style.borderColor = theme.colors.secondary;
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = theme.colors.secondary;
                }}
              >
                <option value="FREE" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>FREE</option>
                <option value="PRO" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>PRO</option>
              </select>
            </div>
          </div>

          {/* Visibilidad */}
          <div style={{ marginTop: isMobile ? '24px' : '30px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: isMobile ? '15px' : '16px',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}>
              Visibilidad <span style={{ color: theme.colors.primary }}>*</span>
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => handleInputChange('visibility', e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '12px' : '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: isMobile ? '15px' : '16px',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(93, 187, 70, 0.1)';
                e.target.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = theme.colors.primary;
              }}
            >
              <option value="PUBLIC" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>Público</option>
              <option value="PRIVATE" style={{ backgroundColor: theme.colors.background, color: 'white', padding: '10px' }}>Oculto</option>
            </select>
          </div>

          {/* Categorías */}
          <div style={{ marginTop: isMobile ? '24px' : '30px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: isMobile ? '15px' : '16px',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}>
              Categorías
            </label>
            
            {/* Tags disponibles */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '15px',
            }}>
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: formData.tags.includes(tag.name) 
                      ? theme.colors.primary 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: formData.tags.includes(tag.name) ? theme.colors.textDark : 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {tag.name} {formData.tags.includes(tag.name) ? '✓' : ''}
                </button>
              ))}
            </div>

            {/* Agregar nueva categoría */}
            <div style={{
              display: 'flex',
              gap: '10px',
            }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewTag())}
                placeholder="Nueva categoría..."
                style={{
                  flex: 1,
                  padding: isMobile ? '10px' : '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={addNewTag}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(93, 187, 70, 0.2)',
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: isMobile ? '20px' : '24px',
              padding: isMobile ? '12px' : '16px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 0, 0, 0.3)',
            }}>
              <p style={{
                color: '#ff6b6b',
                fontSize: isMobile ? '13px' : '14px',
                margin: 0,
              }}>
                ❌ {error}
              </p>
            </div>
          )}

          {/* Info adicional */}
          <div style={{
            marginTop: isMobile ? '24px' : '30px',
            padding: isMobile ? '16px' : '20px',
            backgroundColor: 'rgba(93, 187, 70, 0.1)',
            borderRadius: '10px',
            border: `1px solid ${theme.colors.primary}`,
          }}>
            <p style={{
              color: 'white',
              fontSize: isMobile ? '13px' : '14px',
              lineHeight: '1.6',
              margin: 0,
            }}>
              💡 <strong>Nota:</strong> Una vez creado el curso, podrás agregar módulos, lecciones, videos y más contenido desde el editor de cursos.
            </p>
          </div>
        </div>
      </main>

      <BottomNavigation role="INSTRUCTOR" />
    </div>
  );
};
