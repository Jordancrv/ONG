import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BottomNavigation } from '../components/mobile';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

const COMMUNITY_MEMBERS = [
  { name: 'ANDREA HIJAR', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'PIERO CONTRERAS', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'BARBARA BELTRAN', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
];

const FORUM_CATEGORIES = [
  'Categoría 1',
  'Categoría 2',
  'Categoría 3',
  'Categoría 4',
  'Categoría 1',
  'Categoría 2',
  'Categoría 3',
  'Categoría 4',
];

const AGENDA_ITEMS = [
  { date: '12/10/25', location: '23 Hs. Perú' },
  { date: '12/10/25', location: '22 Hs. Col.' },
  { date: '12/10/25', location: '21 Hs. Arg.' },
];

export const Community: React.FC = () => {
  const { isMobile } = useBreakpoint();
  const { user } = useAuth();

  const userRole = user?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 
                   user?.role === 'ADMIN' ? 'ADMIN' :
                   user?.tier === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

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
      <AppHeader userRole={userRole} />

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '20px 16px' : '40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: isMobile ? theme.typography.fontSize['2xl'] : theme.typography.fontSize['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.textPrimary,
          margin: 0,
          marginBottom: '24px',
        }}>
          Comunidad ODS
        </h2>

        {/* Ruta a la Acción Banner */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{
            position: 'relative',
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
            height: isMobile ? '200px' : '250px',
          }}>
            <div style={{
              display: 'flex',
              height: '100%',
            }}>
              {COMMUNITY_MEMBERS.map((member, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    position: 'relative',
                  }}
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.primary,
                    fontWeight: theme.typography.fontWeight.bold,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    padding: '4px 8px',
                    borderRadius: theme.borderRadius.sm,
                  }}>
                    {member.name}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: theme.colors.primary,
              padding: isMobile ? '12px 16px' : '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{
                  fontSize: isMobile ? theme.typography.fontSize.lg : theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: 'white',
                  margin: 0,
                }}>
                  Ruta a la Acción
                </h3>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: 'white',
                  margin: 0,
                }}>
                  Esta semana: Ruta a la Acción!
                </p>
              </div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                aria-label="Agendar"
              >
                <CalendarIcon size={24} />
              </button>
            </div>
          </div>

          {/* Agéndalo Section */}
          <div style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '16px',
            borderRadius: theme.borderRadius.lg,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                backgroundColor: theme.colors.primary,
                padding: '8px',
                borderRadius: theme.borderRadius.md,
              }}>
                <CalendarIcon size={24} color="white" />
              </div>
              <h4 style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.textPrimary,
                margin: 0,
              }}>
                Agéndalo
              </h4>
            </div>
            {AGENDA_ITEMS.map((item, index) => (
              <div
                key={index}
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                  marginBottom: '4px',
                }}
              >
                {item.date} {item.location}
              </div>
            ))}
          </div>
        </section>

        {/* Foros y debates */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Foros y debates
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: isMobile ? '12px' : '16px',
          }}>
            {FORUM_CATEGORIES.map((category, index) => (
              <button
                key={index}
                style={{
                  height: '100px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.textPrimary,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Red de aliados */}
        <section>
          <h3 style={{
            fontSize: isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: '16px',
          }}>
            Red de aliados
          </h3>
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Greenpeace.svg/320px-Greenpeace.svg.png"
              alt="Greenpeace"
              style={{
                height: '40px',
                filter: 'brightness(0) invert(1)',
                opacity: 0.8,
              }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Greenpeace.svg/320px-Greenpeace.svg.png"
              alt="Partner 2"
              style={{
                height: '40px',
                filter: 'brightness(0) invert(1)',
                opacity: 0.8,
              }}
            />
          </div>
        </section>

        {/* Spacer for mobile bottom navigation */}
        {isMobile && <div style={{ height: '20px' }} />}
      </main>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation role={userRole} />}
    </div>
  );
};
