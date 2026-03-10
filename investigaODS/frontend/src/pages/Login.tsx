import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { COLORS, ROUTES } from '../utils/constants';

const logoGD = "/logo.svg";

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
    setIsLoading(true);

    try {
      await login(email, password);
      
      setIsLoading(false);
      
      // Mostrar alerta de éxito
      setShowSuccessAlert(true);
      
      // Esperar 2 segundos con la alerta visible antes de redirigir
      setTimeout(() => {
        const storedUser = localStorage.getItem('investiga_user');
        const storedPlan = localStorage.getItem('investiga_plan');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          // Redirigir según el rol
          if (user.role === 'ADMIN') {
            navigate(ROUTES.ADMIN);
          } else if (user.role === 'INSTRUCTOR') {
            navigate(ROUTES.INSTRUCTOR);
          } else {
            // Estudiantes - redirigir según su plan
            if (storedPlan === 'PRO') {
              navigate(ROUTES.DASHBOARD_PRO);
            } else {
              navigate(ROUTES.DASHBOARD_BASIC);
            }
          }
        } else {
          navigate(ROUTES.HOME);
        }
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      
      // Mensaje de error personalizado sin mostrar el código de estado
      setErrorMessage('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      
      // Mostrar alerta de error
      setShowErrorAlert(true);
      
      console.error('Login error:', err);
      
      // Asegurarse de que NO haya redirección
      return false;
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Alerta de Error Modal */}
      {showErrorAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            animation: 'slideUp 0.3s ease-in-out',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#ffe0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              ❌
            </div>
            <h2 style={{
              color: '#d32f2f',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '15px',
              fontFamily: 'sans-serif'
            }}>
              Error de Inicio de Sesión
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              marginBottom: '25px',
              fontFamily: 'sans-serif',
              lineHeight: '1.5'
            }}>
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorAlert(false)}
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                padding: '12px 40px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'sans-serif'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Alerta de Éxito Modal con Loader */}
      {showSuccessAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            animation: 'slideUp 0.3s ease-in-out',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#e0f7e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px',
              animation: 'checkmark 0.5s ease-in-out'
            }}>
              ✅
            </div>
            <h2 style={{
              color: '#2e7d32',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '15px',
              fontFamily: 'sans-serif'
            }}>
              ¡Inicio de Sesión Exitoso!
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              marginBottom: '25px',
              fontFamily: 'sans-serif'
            }}>
              Redirigiendo a tu dashboard...
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e0f7e0',
                borderTop: '4px solid #2e7d32',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes checkmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      <div style={{
        backgroundColor: 'rgba(217, 217, 217, 0.1)',
        padding: '40px',
        borderRadius: '20px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <img 
            src={logoGD} 
            alt="Logo" 
            style={{ width: '80px', height: '65px', marginBottom: '15px' }}
          />
          <h1 style={{ 
            fontFamily: 'sans-serif',
            fontSize: '28px',
            fontWeight: '100',
            color: 'white',
            margin: 0
          }}>
            Investiga <span style={{ fontWeight: 'bold', color: COLORS.primary }}>ODS</span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontSize: '14px',
              fontFamily: 'sans-serif'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'sans-serif'
              }}
              placeholder="tu@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontSize: '14px',
              fontFamily: 'sans-serif'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'sans-serif'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#ccc' : COLORS.primary,
              color: 'black',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'sans-serif',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid #000',
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          color: 'white',
          marginTop: '20px',
          fontSize: '14px',
          fontFamily: 'sans-serif'
        }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: COLORS.primary, textDecoration: 'none' }}>
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};
