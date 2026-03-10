import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/mobile';
import { COLORS, ROUTES, MEMBERSHIP_PLANS } from '../utils/constants';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isMobile } = useBreakpoint();

  const userRole = user?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 
                   user?.role === 'ADMIN' ? 'ADMIN' :
                   user?.planCode === 'PRO' ? 'STUDENT_PRO' : 'STUDENT_FREE';

  const handleSelectPlan = (planCode: 'BASIC' | 'PRO') => {
    if (!isAuthenticated) {
      // Redirigir a registro si no está autenticado
      navigate(ROUTES.REGISTER);
      return;
    }

    if (planCode === 'BASIC') {
      alert('Ya tienes el plan FREE/BASIC activo');
      return;
    }

    // Plan PRO - redirigir a pasarela de pago
    if (planCode === 'PRO') {
      console.log('Redirecting to payment gateway for PRO upgrade...');
      alert('Próximamente: Integración con pasarela de pagos para upgrade a PRO');
      // TODO: Implementar integración con pasarela de pagos
    }
  };

  const isCurrentPlan = (planCode: 'BASIC' | 'PRO') => {
    if (!user) return false;
    if (planCode === 'BASIC') return !user.planCode || user.planCode === 'BASIC';
    return user.planCode === planCode;
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      paddingTop: isAuthenticated ? (isMobile ? '72px' : '84px') : '0',
      paddingBottom: isAuthenticated && isMobile ? '80px' : '0',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      {isAuthenticated ? (
        <AppHeader userRole={userRole} />
      ) : (
        <header style={{
          padding: isMobile ? '16px 20px' : '20px 80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            <img src="/logo.svg" alt="Logo" style={{ width: isMobile ? '40px' : '50px', height: isMobile ? '32px' : '40px' }} />
            <h1 style={{
              fontFamily: 'sans-serif',
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: '100',
              color: 'white',
              margin: 0,
            }}>
              Investiga <span style={{ fontWeight: 'bold', color: COLORS.primary }}>ODS</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              style={{
                padding: isMobile ? '8px 16px' : '10px 24px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              style={{
                padding: isMobile ? '8px 16px' : '10px 24px',
                backgroundColor: COLORS.primary,
                color: COLORS.textDark,
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
              }}
            >
              Registrarse
            </button>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section style={{
        padding: isMobile ? '40px 20px' : '60px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: isMobile ? '32px' : '48px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px',
        }}>
          Elige el plan perfecto para ti
        </h1>

        <p style={{
          fontSize: isMobile ? '16px' : '20px',
          color: 'white',
          marginBottom: '10px',
        }}>
          Comienza gratis y actualiza cuando estés listo para más
        </p>

        {isAuthenticated && user && (
          <div style={{
            display: 'inline-block',
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: 'rgba(93, 187, 70, 0.2)',
            borderRadius: '10px',
            color: COLORS.primary,
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 'bold',
          }}>
            Tu plan actual: {user.planCode || 'FREE/BASIC'}
          </div>
        )}
      </section>

      {/* Plans Comparison */}
      <section style={{
        padding: isMobile ? '0 16px 60px' : '0 80px 80px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: isMobile ? '24px' : '40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {MEMBERSHIP_PLANS.map((plan) => {
            const isPro = plan.code === 'PRO';
            const isCurrent = isCurrentPlan(plan.code);

            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: isPro ? 'rgba(93, 187, 70, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: isPro ? `3px solid ${COLORS.primary}` : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: isMobile ? '24px' : '40px',
                  position: 'relative',
                  transform: isPro && !isMobile ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {/* Popular Badge */}
                {isPro && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: COLORS.primary,
                    color: COLORS.textDark,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}>
                    ⭐ MÁS POPULAR
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: COLORS.secondary,
                    color: COLORS.textDark,
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    PLAN ACTUAL
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: isPro ? COLORS.primary : 'white',
                    marginBottom: '10px',
                  }}>
                    {plan.name}
                  </h2>

                  <div style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '10px',
                  }}>
                    {isPro ? '$29' : 'Gratis'}
                    {isPro && (
                      <span style={{ fontSize: '18px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.7)' }}>
                        /mes
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}>
                    {isPro ? 'Acceso completo a todo' : 'Para comenzar tu aprendizaje'}
                  </p>
                </div>

                {/* Features List */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '30px',
                }}>
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '16px',
                        color: 'white',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                      }}
                    >
                      <span style={{ color: COLORS.primary, fontSize: '20px' }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.code)}
                  disabled={isCurrent}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: isCurrent 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : isPro 
                        ? COLORS.primary 
                        : 'white',
                    color: isCurrent 
                      ? 'rgba(255, 255, 255, 0.5)' 
                      : isPro 
                        ? COLORS.textDark 
                        : COLORS.background,
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => {
                    if (!isCurrent) e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseOut={(e) => {
                    if (!isCurrent) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {isCurrent 
                    ? 'Plan Actual' 
                    : isPro 
                      ? 'Upgrade a PRO' 
                      : 'Comenzar Gratis'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{
        padding: '60px 80px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          Preguntas Frecuentes
        </h2>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
        }}>
          {[
            {
              q: '¿Puedo cambiar de plan en cualquier momento?',
              a: 'Sí, puedes hacer upgrade de FREE a PRO cuando quieras. También puedes cancelar tu suscripción PRO en cualquier momento.',
            },
            {
              q: '¿Qué métodos de pago aceptan?',
              a: 'Aceptamos tarjetas de crédito, débito y transferencias bancarias. Próximamente añadiremos más opciones.',
            },
            {
              q: '¿Los certificados tienen validez oficial?',
              a: 'Los certificados PRO son verificables mediante blockchain y tienen reconocimiento en nuestra red de organizaciones aliadas.',
            },
            {
              q: '¿Hay descuentos para estudiantes o grupos?',
              a: 'Sí, ofrecemos descuentos especiales para estudiantes universitarios y organizaciones. Contáctanos para más información.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '25px',
                borderRadius: '15px',
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: '10px',
              }}>
                {faq.q}
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'white',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation for mobile authenticated users */}
      {isAuthenticated && isMobile && <BottomNavigation role={userRole} />}
    </div>
  );
};
