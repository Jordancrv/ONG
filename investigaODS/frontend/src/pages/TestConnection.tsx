import { useState } from 'react';
import { authService, subscriptionsService } from '../services/api.service';

export const TestConnection = () => {
  const [result, setResult] = useState<string>('Presiona el botón para probar');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setResult('✅ Backend conectado: ' + JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('🔄 Intentando login...\n');
    
    try {
      setResult(prev => prev + '📡 Enviando petición a /api/auth/login\n');
      
      // Intenta login con credenciales de prueba usando fetch
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test1@example.com',
          password: 'test1234',
        }),
      });

      setResult(prev => prev + `📥 Respuesta recibida: ${response.status} ${response.statusText}\n\n`);

      if (!response.ok) {
        const errorText = await response.text();
        setResult(prev => prev + `❌ Error del servidor:\n${errorText}`);
        return;
      }

      const loginData = await response.json();
      
      // Guarda el token
      localStorage.setItem('accessToken', loginData.accessToken);
      
      setResult(prev => prev + '✅ Login exitoso:\n' + JSON.stringify(loginData, null, 2));
      
      // Ahora prueba obtener la suscripción
      setResult(prev => prev + '\n\n🔄 Obteniendo suscripción...\n');
      
      setTimeout(async () => {
        try {
          const subResponse = await fetch('/api/subscriptions/my-active', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginData.accessToken}`,
            },
            credentials: 'include',
          });

          setResult(prev => prev + `📥 Respuesta suscripción: ${subResponse.status} ${subResponse.statusText}\n\n`);

          if (subResponse.ok) {
            const subscription = await subResponse.json();
            setResult(prev => prev + '✅ Suscripción obtenida:\n' + JSON.stringify(subscription, null, 2));
          } else {
            const errorText = await subResponse.text();
            setResult(prev => prev + `⚠️ No se pudo obtener suscripción:\n${errorText}`);
          }
        } catch (subError: any) {
          setResult(prev => prev + `\n❌ Error obteniendo suscripción:\n${subError.message}`);
        }
      }, 500);
    } catch (error: any) {
      setResult(prev => prev + `\n❌ Error capturado:\nTipo: ${error.name}\nMensaje: ${error.message}`);
      console.error('Login error completo:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setResult('🔄 Intentando registro...\n');
    
    try {
      setResult(prev => prev + '📡 Enviando petición a /api/auth/register\n');
      
      // Probar primero con fetch directo
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test1@example.com',
          password: 'test1234',
          firstName: 'Test',
          lastName: 'User',
        }),
      });

      setResult(prev => prev + `📥 Respuesta recibida: ${response.status} ${response.statusText}\n\n`);

      if (!response.ok) {
        const errorText = await response.text();
        setResult(prev => prev + `❌ Error del servidor:\n${errorText}`);
        return;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      
      setResult(prev => prev + '✅ Registro exitoso:\n' + JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(prev => prev + `\n❌ Error capturado:\nTipo: ${error.name}\nMensaje: ${error.message}\nStack: ${error.stack || 'N/A'}`);
      console.error('Register error completo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#062860', marginBottom: '30px' }}>
        🔌 Test de Conexión Backend
      </h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testBackend}
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#062860',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Probando...' : 'Test Health'}
        </button>

        <button 
          onClick={testRegister}
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Probando...' : 'Test Register'}
        </button>

        <button 
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Probando...' : 'Test Login + Subscription'}
        </button>
      </div>

      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #062860',
        marginBottom: '20px'
      }}>
        <pre style={{ 
          margin: 0, 
          color: '#000',
          fontSize: '14px',
          whiteSpace: 'pre-wrap'
        }}>
          {result}
        </pre>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>📝 Instrucciones:</h3>
        <ol style={{ margin: 0, color: '#856404', paddingLeft: '20px' }}>
          <li>Primero presiona <strong>"Test Register"</strong> para crear el usuario (solo la primera vez)</li>
          <li>Luego presiona <strong>"Test Login + Subscription"</strong> para probar el login</li>
          <li>Si el usuario ya existe, solo usa el botón de Login</li>
        </ol>
      </div>
    </div>
  );
};
