import React from 'react';

const logoGD = "/logo.svg";

export const Footer: React.FC = () => {
  const socialLinks = ['Facebook', 'Instagram', 'LinkedIn', 'Youtube'];
  const legalLinks = ['Términos y condiciones', 'Políticas de uso'];
  const workLinks = ['Vacantes', 'Voluntariado'];

  return (
    <footer style={{
      width: '100%',
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
      padding: '58px 97px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        gap: '40px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={logoGD} 
            alt="Logo" 
            style={{ width: '109px', height: '89px' }}
          />
          <p style={{ 
            fontFamily: 'sans-serif',
            fontSize: '32px',
            fontWeight: '100',
            color: 'white',
            margin: 0
          }}>
            Investiga <span style={{ fontWeight: 'bold', color: '#5dbb46' }}>ODS</span>
          </p>
        </div>

        {/* Legales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            fontFamily: 'sans-serif'
          }}>
            Legales
          </h3>
          {legalLinks.map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '24px',
                fontWeight: '100',
                color: 'white',
                textDecoration: 'none',
                fontFamily: 'sans-serif'
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Trabaja con nosotros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            fontFamily: 'sans-serif'
          }}>
            Trabaja con nosotros
          </h3>
          {workLinks.map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '24px',
                fontWeight: '100',
                color: 'white',
                textDecoration: 'none',
                fontFamily: 'sans-serif'
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Redes Sociales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {socialLinks.map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '24px',
                fontWeight: '100',
                color: 'white',
                textDecoration: 'none',
                fontFamily: 'sans-serif'
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
