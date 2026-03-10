import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCertificates } from '../hooks/useCertificates';
import { COLORS, ROUTES } from '../utils/constants';

const logoGD = "/logo.svg";

export const Certificates: React.FC = () => {
  const navigate = useNavigate();
  const { user, userPlan, logout } = useAuth();
  const { certificates, isLoading } = useCertificates();

  const isPro = userPlan === 'PRO';

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  const handleDownload = (certId: number) => {
    // TODO: Implementar descarga real desde backend
    console.log('Downloading certificate:', certId);
    alert('La descarga de certificados se implementará próximamente.');
  };

  const handleVerify = (serial: string) => {
    // TODO: Navegar a página de verificación o mostrar modal
    alert(`Verificando certificado: ${serial}`);
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

        <button
          onClick={() => {
            const route = userPlan === 'PRO' ? ROUTES.DASHBOARD_PRO : ROUTES.DASHBOARD_BASIC;
            navigate(route);
          }}
          style={{
            padding: '10px 24px',
            backgroundColor: COLORS.primary,
            color: COLORS.textDark,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '15px',
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
            border: '1px solid white',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '60px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '10px',
          }}>
            Mis Certificados
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            {isPro 
              ? 'Certificados verificables de los cursos que has completado'
              : 'Los certificados solo están disponibles para usuarios PRO'}
          </p>
        </div>

        {/* PRO Upgrade Banner */}
        {!isPro && (
          <div style={{
            backgroundColor: 'rgba(93, 187, 70, 0.1)',
            border: `2px solid ${COLORS.primary}`,
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '40px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: COLORS.primary,
              marginBottom: '15px',
            }}>
              🏆 Upgrade a PRO para obtener certificados
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'white',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}>
              Los certificados verificables están disponibles exclusivamente para miembros PRO.
              Demuestra tus logros con certificados oficiales reconocidos.
            </p>
            <button
              onClick={() => navigate(ROUTES.PLANS)}
              style={{
                padding: '14px 40px',
                backgroundColor: COLORS.primary,
                color: COLORS.textDark,
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Ver Planes PRO
            </button>
          </div>
        )}

        {/* Certificates Grid */}
        {isPro && (
          <>
            {isLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
              }}>
                <p style={{
                  fontSize: '18px',
                  color: 'white',
                }}>
                  Cargando certificados...
                </p>
              </div>
            ) : certificates.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
              }}>
                <h3 style={{
                  fontSize: '24px',
                  color: 'white',
                  marginBottom: '15px',
                }}>
                  Aún no tienes certificados
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '25px',
                }}>
                  Completa cursos para obtener tus certificados verificables
                </p>
                <button
                  onClick={() => navigate(ROUTES.COURSES)}
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
                  Explorar Cursos
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '30px',
              }}>
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '15px',
                      padding: '30px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Certificate Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '20px',
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: COLORS.primary,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '30px',
                      }}>
                        🏆
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: 'white',
                          margin: 0,
                          marginBottom: '5px',
                        }}>
                          {cert.course?.title || 'Curso sin título'}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                        }}>
                          por {cert.course?.owner?.firstName} {cert.course?.owner?.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Certificate Info */}
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}>
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                          Serial
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: 'white',
                          fontFamily: 'monospace',
                        }}>
                          {cert.serialNumber}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                          Emitido
                        </span>
                        <span style={{ fontSize: '14px', color: 'white' }}>
                          {new Date(cert.issuedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                    }}>
                      <button
                        onClick={() => handleDownload(cert.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: COLORS.primary,
                          color: COLORS.textDark,
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        📄 Descargar PDF
                      </button>
                      <button
                        onClick={() => handleVerify(cert.serialNumber)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        ✓ Verificar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
