import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { COLORS, ROUTES } from '../utils/constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
    }}>
      <style>{`
        @media (max-width: 768px) {
          .home-header {
            padding: 15px 20px !important;
            flex-wrap: wrap;
          }
          .home-logo-section {
            gap: 10px !important;
          }
          .home-logo {
            width: 35px !important;
            height: 28px !important;
          }
          .home-logo-text {
            font-size: 18px !important;
          }
          .home-nav-desktop {
            display: none !important;
          }
          .home-nav-mobile {
            display: flex !important;
          }
          .home-mobile-menu {
            display: flex !important;
            width: 100%;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
          }
          .home-mobile-menu button {
            width: 100%;
          }
          .home-user-name {
            font-size: 14px !important;
          }
          .home-hero {
            padding: 40px 20px !important;
            gap: 20px !important;
          }
          .home-hero-title {
            font-size: 32px !important;
            max-width: 100% !important;
          }
          .home-hero-subtitle {
            font-size: 16px !important;
            max-width: 100% !important;
          }
          .home-hero-buttons {
            flex-direction: column !important;
            width: 100%;
            gap: 15px !important;
          }
          .home-hero-buttons button {
            width: 100%;
            padding: 14px 30px !important;
            font-size: 16px !important;
          }
          .home-features {
            padding: 40px 20px !important;
          }
          .home-features-title {
            font-size: 28px !important;
            margin-bottom: 30px !important;
          }
          .home-features-grid {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
          .home-feature-card {
            padding: 25px 20px !important;
          }
          .home-feature-title {
            font-size: 20px !important;
          }
          .home-feature-desc {
            font-size: 15px !important;
          }
          .home-cta {
            padding: 50px 20px !important;
          }
          .home-cta-title {
            font-size: 28px !important;
          }
          .home-cta-subtitle {
            font-size: 16px !important;
          }
          .home-cta-button {
            width: 100%;
            padding: 14px 40px !important;
            font-size: 16px !important;
          }
          .home-footer {
            padding: 30px 20px !important;
          }
        }
        .home-nav-mobile {
          display: none;
        }
        .home-mobile-menu {
          display: none;
        }
      `}</style>
      {/* Header */}
      <header className="home-header" style={{
        padding: '20px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}>
        <div className="home-logo-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.svg" alt="Logo" className="home-logo" style={{ width: '50px', height: '40px' }} />
          <h1 className="home-logo-text" style={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
            fontWeight: '100',
            color: 'white',
            margin: 0,
          }}>
            Investiga <span style={{ fontWeight: 'bold', color: COLORS.primary }}>ODS</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="home-nav-desktop" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              {user && (
                <span className="home-user-name" style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '400',
                }}>
                  {user.firstName} {user.lastName}
                </span>
              )}
              <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: COLORS.primary,
                  color: COLORS.textDark,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Mi Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: COLORS.primary,
                  color: COLORS.textDark,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="home-nav-mobile"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            padding: '8px 12px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ☰
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="home-mobile-menu">
            {isAuthenticated ? (
              <>
                {user && (
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '400',
                    textAlign: 'center',
                  }}>
                    {user.firstName} {user.lastName}
                  </span>
                )}
                <button
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: COLORS.primary,
                    color: COLORS.textDark,
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Mi Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: COLORS.primary,
                    color: COLORS.textDark,
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="home-hero" style={{
        padding: '80px 80px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
      }}>
        <h1 className="home-hero-title" style={{
          fontSize: '56px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          maxWidth: '900px',
          lineHeight: '1.2',
        }}>
          Aprende sobre <span style={{ color: COLORS.primary }}>Sostenibilidad</span> y los Objetivos de Desarrollo Sostenible
        </h1>

        <p className="home-hero-subtitle" style={{
          fontSize: '22px',
          color: 'white',
          margin: 0,
          maxWidth: '700px',
          lineHeight: '1.5',
        }}>
          Capacitación ambiental con modalidades autodidacta y guiada, evaluaciones certificadas y una comunidad comprometida con el cambio.
        </p>

        <div className="home-hero-buttons" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button
            onClick={() => navigate(ROUTES.COURSES)}
            style={{
              padding: '16px 40px',
              backgroundColor: COLORS.primary,
              color: COLORS.textDark,
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            Explorar Cursos
          </button>
          <button
            onClick={() => navigate(ROUTES.PLANS)}
            style={{
              padding: '16px 40px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            Ver Planes
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features" style={{
        padding: '60px 80px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}>
        <h2 className="home-features-title" style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          ¿Por qué InvestigaODS?
        </h2>

        <div className="home-features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
        }}>
          {[
            {
              title: '🎓 Cursos Certificados',
              description: 'Obtén certificados verificables al completar tus cursos con éxito.',
            },
            {
              title: '🌱 Modalidad Flexible',
              description: 'Aprende a tu ritmo con cursos autodidacta o únete a cohortes guiadas.',
            },
            {
              title: '📚 Contenido de Calidad',
              description: 'Videos, recursos descargables y evaluaciones diseñadas por expertos.',
            },
            {
              title: '🏆 Gamificación',
              description: 'Desafíos, puntos y leaderboards para estudiantes PRO.',
            },
            {
              title: '👥 Comunidad Activa',
              description: 'Conecta con otros estudiantes comprometidos con la sostenibilidad.',
            },
            {
              title: '🎯 Clases en Vivo',
              description: 'Sesiones sincrónicas con instructores expertos (plan PRO).',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="home-feature-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center',
              }}
            >
              <h3 className="home-feature-title" style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '15px',
              }}>
                {feature.title}
              </h3>
              <p className="home-feature-desc" style={{
                fontSize: '16px',
                color: 'white',
                lineHeight: '1.6',
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta" style={{
        padding: '80px 80px',
        textAlign: 'center',
        backgroundColor: COLORS.primary,
      }}>
        <h2 className="home-cta-title" style={{
          fontSize: '40px',
          fontWeight: 'bold',
          color: COLORS.textDark,
          marginBottom: '20px',
        }}>
          ¿Listo para comenzar tu viaje de aprendizaje?
        </h2>
        <p className="home-cta-subtitle" style={{
          fontSize: '20px',
          color: COLORS.textDark,
          marginBottom: '30px',
        }}>
          Regístrate hoy y accede a cursos gratuitos. Upgrade a PRO cuando quieras más.
        </p>
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="home-cta-button"
          style={{
            padding: '16px 50px',
            backgroundColor: COLORS.background,
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          Crear Cuenta Gratis
        </button>
      </section>

      {/* Footer */}
      <footer className="home-footer" style={{
        padding: '40px 80px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        color: 'white',
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          © 2025 InvestigaODS. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};
