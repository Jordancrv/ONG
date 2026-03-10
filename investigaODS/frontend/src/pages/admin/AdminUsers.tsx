import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { AppHeader } from '../../components/AppHeader';
import { BottomNavigation } from '../../components/mobile';
import { theme } from '../../styles/theme';
import { ROUTES } from '../../utils/constants';
import type { UserRole, PlanCode } from '../../types';
import api from '../../utils/api';

const logoGD = "/logo.svg";

interface UserData {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: UserRole;
  tier?: 'BASIC' | 'PRO';
  createdAt: string;
  isActive?: boolean;
}

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMobile } = useBreakpoint();

  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    if (window.confirm(`¿${currentStatus ? 'Desactivar' : 'Activar'} este usuario?`)) {
      try {
        await api.patch(`/admin/users/${userId}`, {
          isActive: !currentStatus
        });
        await loadUsers();
        alert('Estado actualizado correctamente');
      } catch (error) {
        console.error('Error updating user status:', error);
        alert('Error al actualizar el estado del usuario');
      }
    }
  };

  const handleChangeRole = async (userId: number, userName: string) => {
    const newRole = prompt('Nuevo rol (ADMIN, INSTRUCTOR, STUDENT):', 'STUDENT');
    if (newRole && ['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(newRole)) {
      try {
        await api.patch(`/admin/users/${userId}`, {
          role: newRole
        });
        await loadUsers();
        alert(`Rol de ${userName} actualizado a ${newRole}`);
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('Error al actualizar el rol del usuario');
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingTop: isMobile ? '72px' : '84px',
      paddingBottom: isMobile ? '90px' : '0',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <AppHeader userRole="ADMIN" />

      {/* Main Content */}
      <main style={{ padding: isMobile ? '20px 16px' : '60px 80px' }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          marginBottom: isMobile ? '24px' : '40px',
          gap: isMobile ? '16px' : '0',
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '42px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '10px',
              margin: 0,
            }}>
              Gestión de Usuarios
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '8px 0 0 0',
            }}>
              {filteredUsers.length} usuarios encontrados
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '20px',
          marginBottom: isMobile ? '20px' : '30px',
          alignItems: isMobile ? 'stretch' : 'center',
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: isMobile ? '100%' : '500px',
              padding: isMobile ? '12px 16px' : '14px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              fontSize: '16px',
            }}
          />

          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '8px' : '10px',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
          }}>
            {(['ALL', 'ADMIN', 'INSTRUCTOR', 'STUDENT'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '10px 8px' : '10px 20px',
                  backgroundColor: roleFilter === role ? theme.colors.primary : 'transparent',
                  color: roleFilter === role ? theme.colors.textDark : 'white',
                  border: `2px solid ${roleFilter === role ? theme.colors.primary : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: isMobile ? '11px' : '14px',
                  whiteSpace: 'nowrap',
                }}
              >
                {role === 'ALL' ? 'Todos' : role === 'STUDENT' ? 'Estud.' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table/Cards */}
        {isLoading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
          }}>
            Cargando usuarios...
          </div>
        ) : isMobile ? (
          /* Mobile: Card View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
              }}>
                No se encontraron usuarios
              </div>
            ) : (
              filteredUsers.map((userData) => (
                <div
                  key={userData.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {userData.firstName || userData.lastName 
                        ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                        : userData.email.split('@')[0]
                      }
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                      {userData.email}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: 
                        userData.role === 'ADMIN' ? 'rgba(255, 107, 107, 0.2)' :
                        userData.role === 'INSTRUCTOR' ? 'rgba(93, 187, 70, 0.2)' :
                        'rgba(33, 150, 243, 0.2)',
                      color: 
                        userData.role === 'ADMIN' ? '#ff6b6b' :
                        userData.role === 'INSTRUCTOR' ? theme.colors.primary :
                        '#2196f3',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {userData.role}
                    </span>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: userData.tier === 'PRO' ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: userData.tier === 'PRO' ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {userData.tier || 'BASIC'}
                    </span>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: userData.isActive !== false ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                      color: userData.isActive !== false ? theme.colors.primary : '#ff6b6b',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {userData.isActive !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '12px' }}>
                    Registro: {new Date(userData.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const userName = userData.firstName || userData.lastName 
                          ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                          : userData.email.split('@')[0];
                        handleChangeRole(userData.id, userName);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      ✏️ Cambiar Rol
                    </button>
                    <button
                      onClick={() => handleToggleActive(userData.id, userData.isActive !== false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: userData.isActive !== false ? 'rgba(255, 107, 107, 0.2)' : 'rgba(93, 187, 70, 0.2)',
                        color: userData.isActive !== false ? '#ff6b6b' : theme.colors.primary,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {userData.isActive !== false ? '🔒 Desactivar' : '✅ Activar'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Desktop: Table View */
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr 1fr 1.5fr',
              padding: '20px 25px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                NOMBRE
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                EMAIL
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                ROL
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                PLAN
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                REGISTRO
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                ESTADO
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
                ACCIONES
              </div>
            </div>

            {/* Table Body */}
            {filteredUsers.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '16px',
              }}>
                No se encontraron usuarios
              </div>
            ) : (
              filteredUsers.map((userData) => (
                <div
                  key={userData.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr 1fr 1.5fr',
                    padding: '20px 25px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                    {userData.firstName || userData.lastName 
                      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                      : userData.email.split('@')[0]
                    }
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                    {userData.email}
                  </div>
                  <div>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: 
                        userData.role === 'ADMIN' ? 'rgba(255, 107, 107, 0.2)' :
                        userData.role === 'INSTRUCTOR' ? 'rgba(93, 187, 70, 0.2)' :
                        'rgba(33, 150, 243, 0.2)',
                      color: 
                        userData.role === 'ADMIN' ? '#ff6b6b' :
                        userData.role === 'INSTRUCTOR' ? theme.colors.primary :
                        '#2196f3',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {userData.role}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: userData.tier === 'PRO' ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: userData.tier === 'PRO' ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {userData.tier || 'BASIC'}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                    {new Date(userData.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: userData.isActive !== false ? 'rgba(93, 187, 70, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                      color: userData.isActive !== false ? theme.colors.primary : '#ff6b6b',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {userData.isActive !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const userName = userData.firstName || userData.lastName 
                          ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                          : userData.email.split('@')[0];
                        handleChangeRole(userData.id, userName);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      ✏️ Rol
                    </button>
                    <button
                      onClick={() => handleToggleActive(userData.id, userData.isActive !== false)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: userData.isActive !== false ? 'rgba(255, 107, 107, 0.2)' : 'rgba(93, 187, 70, 0.2)',
                        color: userData.isActive !== false ? '#ff6b6b' : theme.colors.primary,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {userData.isActive !== false ? '🔒' : '✅'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      
      {isMobile && <BottomNavigation role="ADMIN" />}
    </div>
  );
};
