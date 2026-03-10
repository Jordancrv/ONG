import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Compass, BookOpen, Users, User, Award } from 'lucide-react';
import { theme } from '../styles/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useAuth } from '../hooks/useAuth';
import { LogoutModal } from './LogoutModal';
import { ROUTES } from '../utils/constants';

const logoSVG = "/logo.svg";

interface AppHeaderProps {
  userRole?: 'STUDENT_FREE' | 'STUDENT_PRO' | 'INSTRUCTOR' | 'ADMIN';
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  userRole = 'STUDENT_FREE'
}) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate(ROUTES.HOME);
  };

  const getNavItems = () => {
    switch (userRole) {
      case 'STUDENT_FREE':
      case 'STUDENT_PRO':
        return [
          { icon: <Home size={20} />, label: 'Inicio', path: userRole === 'STUDENT_PRO' ? ROUTES.DASHBOARD_PRO : ROUTES.DASHBOARD_BASIC },
          { icon: <Compass size={20} />, label: 'Explorar', path: '/explore' },
          { icon: <BookOpen size={20} />, label: 'Mis Cursos', path: '/my-courses' },
          { icon: <Users size={20} />, label: 'Comunidad', path: '/community' },
          { icon: <User size={20} />, label: 'Perfil', path: '/profile' },
        ];
      case 'INSTRUCTOR':
        return [
          { icon: <Home size={20} />, label: 'Inicio', path: ROUTES.INSTRUCTOR_DASHBOARD },
          { icon: <BookOpen size={20} />, label: 'Cursos', path: ROUTES.INSTRUCTOR_COURSES },
          { icon: <Users size={20} />, label: 'Alumnos', path: ROUTES.INSTRUCTOR_STUDENTS },
          { icon: <Award size={20} />, label: 'Emitir Diploma', path: '/instructor/certificates' },
          { icon: <User size={20} />, label: 'Perfil', path: '/profile' },
        ];
      case 'ADMIN':
        return [
          { icon: <Home size={20} />, label: 'Inicio', path: ROUTES.ADMIN_DASHBOARD },
          { icon: <Users size={20} />, label: 'Usuarios', path: ROUTES.ADMIN_USERS },
          { icon: <BookOpen size={20} />, label: 'Cursos', path: ROUTES.ADMIN_CATALOG },
          { icon: <Award size={20} />, label: 'Certificaciones', path: '/admin/certificates' },
          { icon: <User size={20} />, label: 'Perfil', path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: isMobile ? '16px' : '20px 80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.background,
      boxSizing: 'border-box',
    }}>
      {/* Left side: Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
        <img 
          src={logoSVG} 
          alt="Logo" 
          style={{ 
            width: isMobile ? '40px' : '50px', 
            height: isMobile ? '32px' : '40px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        />
        <h1 style={{
          fontFamily: theme.typography.fontFamily.primary,
          fontSize: isMobile ? theme.typography.fontSize.lg : theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.normal,
          color: theme.colors.textPrimary,
          margin: 0,
        }}>
          Investiga <span style={{ fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary }}>ODS</span>
        </h1>
      </div>

      {/* Desktop Navigation - Centered */}
      {!isMobile && navItems.length > 0 && (
        <nav style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: theme.colors.textPrimary,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                padding: '8px 12px',
                borderRadius: theme.borderRadius.md,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(93, 187, 70, 0.1)';
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.textPrimary;
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {/* Right side actions */}
      <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', alignItems: 'center', zIndex: 1 }}>
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.textPrimary,
            cursor: 'pointer',
            padding: '8px',
          }}
          aria-label="Cerrar sesión"
        >
          <LogOut size={isMobile ? 20 : 24} />
        </button>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </header>
  );
};
