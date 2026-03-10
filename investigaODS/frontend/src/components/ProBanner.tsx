import React from 'react';

const awardIcon = "https://www.figma.com/api/mcp/asset/98a6ba1c-cebc-43d7-8479-9ea1725baed6";

interface ProBannerProps {
  onSubscribe?: () => void;
}

export const ProBanner: React.FC<ProBannerProps> = ({ onSubscribe }) => {
  const proCourses = [
    'Reciclaje con IA',
    'Hidrocarburos y su impacto ambiental',
    'Mediciones acuáticas'
  ];

  return (
    <section style={{
      width: '100%',
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
      padding: '26px 0',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '241px'
    }}>
      <div style={{
        maxWidth: '1440px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        padding: '0 160px'
      }}>
        {/* Award Icon */}
        <div style={{
          width: '149px',
          height: '149px',
          border: '1px solid #5dbb46',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <img 
            src={awardIcon} 
            alt="Award" 
            style={{ width: '120px', height: '120px' }}
          />
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          flex: 1
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            fontFamily: 'sans-serif'
          }}>
            Desbloquea tu siguiente nivel de aprendizaje con{' '}
            <span style={{ color: '#5dbb46' }}>PRO</span>
          </h2>

          <ul style={{
            fontSize: '20px',
            color: 'white',
            listStyleType: 'disc',
            paddingLeft: '20px',
            margin: 0
          }}>
            {proCourses.map((course, index) => (
              <li key={index} style={{ marginBottom: '11px' }}>
                {course}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={onSubscribe}
          style={{
            backgroundColor: '#5dbb46',
            color: 'black',
            fontSize: '24px',
            fontWeight: '300',
            padding: '12px 40px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'sans-serif',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          CONTRATAR MEMBRESÍA
        </button>
      </div>
    </section>
  );
};
