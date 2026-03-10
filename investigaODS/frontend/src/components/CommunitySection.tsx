import React from 'react';

const communityImage = "https://www.figma.com/api/mcp/asset/10b9ffc3-1a34-4652-89ef-d26db12817e6";

export const CommunitySection: React.FC = () => {
  return (
    <section style={{
      width: '100%',
      maxWidth: '1196px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '25px',
        fontFamily: 'sans-serif'
      }}>
        Comunidad en acción
      </h2>

      <div style={{
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <img 
          src={communityImage}
          alt="Comunidad en acción"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover'
          }}
        />
      </div>
    </section>
  );
};
