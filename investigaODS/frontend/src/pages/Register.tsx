import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/constants';
import { authService } from '../services/api.service';

const logoGD = "/logo.svg";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState<'register' | 'upgrade'>('register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowErrorAlert(false);
    setShowSuccessAlert(false);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowErrorAlert(true);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres');
      setShowErrorAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      // Llamar a la API de registro
      await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setIsLoading(false);
      
      // Mostrar alerta de éxito
      setShowSuccessAlert(true);
    } catch (err: any) {
      setIsLoading(false);
      
      // Extraer mensaje de error del backend
      let errorMsg = 'Error al crear la cuenta. Por favor, intenta nuevamente.';
      
      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        
        // Traducir mensajes comunes del backend
        if (backendMsg.includes('Email already registered')) {
          errorMsg = 'Este correo electrónico ya está registrado. Por favor, usa otro email o inicia sesión.';
        } else if (backendMsg.includes('password must be longer than or equal to 8 characters')) {
          errorMsg = 'La contraseña debe tener al menos 8 caracteres';
        } else {
          errorMsg = backendMsg;
        }
      } else if (err.response?.status === 409) {
        errorMsg = 'Este correo electrónico ya está registrado. Por favor, usa otro email o inicia sesión.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
      setShowErrorAlert(true);
      
      console.error('Register error:', err);
      
      return false;
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Modal de Carga */}
      {isLoading && (
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
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            animation: 'slideUp 0.3s ease-in-out',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '5px solid #e0f7e0',
              borderTop: '5px solid #2e7d32',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2 style={{
              color: '#333',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'sans-serif'
            }}>
              Creando tu cuenta...
            </h2>
            <p style={{
              color: '#666',
              fontSize: '14px',
              fontFamily: 'sans-serif'
            }}>
              Por favor espera un momento
            </p>
          </div>
        </div>
      )}

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
              Error en el Registro
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
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Alerta de Éxito Modal */}
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
              ¡Registro Exitoso!
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              marginBottom: '25px',
              fontFamily: 'sans-serif',
              lineHeight: '1.5'
            }}>
              Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión con tus credenciales.
            </p>
            <button
              onClick={handleGoToLogin}
              style={{
                backgroundColor: '#2e7d32',
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
              Ir a Iniciar Sesión
            </button>
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
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '30px',
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
          <p style={{
            fontSize: '16px',
            color: 'white',
            marginTop: '10px',
          }}>
            Crea tu cuenta gratuita
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontFamily: 'sans-serif',
              }}>
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'sans-serif',
                }}
                placeholder="Juan"
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontFamily: 'sans-serif',
              }}>
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'sans-serif',
                }}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontSize: '14px',
              fontFamily: 'sans-serif',
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'sans-serif',
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
              fontFamily: 'sans-serif',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'sans-serif',
              }}
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontSize: '14px',
              fontFamily: 'sans-serif',
            }}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'sans-serif',
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
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          color: 'white',
          marginTop: '20px',
          fontSize: '14px',
          fontFamily: 'sans-serif',
        }}>
          ¿Ya tienes cuenta?{' '}
          <a 
            href="/login" 
            style={{ color: COLORS.primary, textDecoration: 'none', fontWeight: 'bold' }}
          >
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
};
