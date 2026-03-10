import React from 'react';
import { Home, Compass, BookOpen, Users, User, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { ROUTES } from '../../utils/constants';

export type UserRole = 'STUDENT_FREE' | 'STUDENT_PRO' | 'INSTRUCTOR' | 'ADMIN';

interface BottomNavigationProps {
  role: UserRole;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  activeIcon?: React.ReactNode;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'STUDENT_FREE':
      case 'STUDENT_PRO':
        return [
          { icon: <Home size={24} />, label: 'Inicio', path: role === 'STUDENT_PRO' ? ROUTES.DASHBOARD_PRO : ROUTES.DASHBOARD_BASIC },
          { icon: <Compass size={24} />, label: 'Explorar', path: '/explore' },
          { icon: <BookOpen size={24} />, label: 'Mis Cursos', path: '/my-courses' },
          { icon: <Users size={24} />, label: 'Comunidad', path: '/community' },
          { icon: <User size={24} />, label: 'Perfil', path: '/profile' },
        ];
      
      case 'INSTRUCTOR':
        return [
          { icon: <Home size={24} />, label: 'Inicio', path: ROUTES.INSTRUCTOR_DASHBOARD },
          { icon: <BookOpen size={24} />, label: 'Cursos', path: ROUTES.INSTRUCTOR_COURSES },
          { icon: <Users size={24} />, label: 'Alumnos', path: ROUTES.INSTRUCTOR_STUDENTS },
          { icon: <Award size={24} />, label: 'Emitir Diploma', path: '/instructor/certificates' },
          { icon: <User size={24} />, label: 'Perfil', path: '/profile' },
        ];
      
      case 'ADMIN':
        return [
          { icon: <Home size={24} />, label: 'Inicio', path: ROUTES.ADMIN_DASHBOARD },
          { icon: <Users size={24} />, label: 'Usuarios', path: ROUTES.ADMIN_USERS },
          { icon: <BookOpen size={24} />, label: 'Cursos', path: ROUTES.ADMIN_CATALOG },
          { icon: <Award size={24} />, label: 'Certificaciones', path: '/admin/certificates' },
          { icon: <User size={24} />, label: 'Perfil', path: '/profile' },
        ];
    }
  };

  const navItems = getNavItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      borderTop: `1px solid ${theme.colors.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
      boxSizing: 'border-box',
    }}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? theme.colors.primary : theme.colors.textSecondary,
              transition: 'color 0.2s ease',
              flex: 1,
              maxWidth: '80px',
            }}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            {item.icon}
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              fontWeight: active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
