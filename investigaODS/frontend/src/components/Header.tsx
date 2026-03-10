import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

// const logoGD = "/logo.svg";

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = ['Inicio', 'Explorar', 'Favoritos', 'Comunidad'];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header 
      style={{
        position: 'relative',
        width: '100%',
        height: '101px',
        backgroundColor: 'rgba(217, 217, 217, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/logo.svg" 
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

      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'center',
        fontSize: '24px'
      }}>
        {navItems.map((item, index) => (
          <React.Fragment key={item}>
            <button
              onClick={() => onNavigate?.(item.toLowerCase())}
              style={{
                background: 'none',
                border: 'none',
                color: index === 0 ? '#5dbb46' : 'white',
                fontWeight: index === 0 ? 'bold' : '100',
                fontSize: '24px',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
              }}
            >
              {item}
            </button>
            {index < navItems.length - 1 && (
              <span style={{ color: 'white', fontWeight: '100' }}>|</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Profile and Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user && (
          <span style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '400',
            fontFamily: 'sans-serif',
          }}>
            {user.firstName} {user.lastName}
          </span>
        )}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid white',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            padding: '8px 20px',
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
