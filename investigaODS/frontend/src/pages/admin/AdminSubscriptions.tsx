import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, ROUTES } from '../../utils/constants';

const logoGD = "/logo.svg";

interface SubscriptionData {
  id: string;
  userName: string;
  userEmail: string;
  plan: 'PRO';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  amount: number;
}

// Mock data
const MOCK_SUBSCRIPTIONS: SubscriptionData[] = [
  {
    id: 'sub-1',
    userName: 'María González',
    userEmail: 'maria.gonzalez@example.com',
    plan: 'PRO',
    status: 'ACTIVE',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    amount: 29,
  },
  {
    id: 'sub-2',
    userName: 'Luis Fernández',
    userEmail: 'luis.fernandez@example.com',
    plan: 'PRO',
    status: 'ACTIVE',
    startDate: '2025-01-25',
    endDate: '2025-02-25',
    amount: 29,
  },
  {
    id: 'sub-3',
    userName: 'Pedro Sánchez',
    userEmail: 'pedro.sanchez@example.com',
    plan: 'PRO',
    status: 'CANCELLED',
    startDate: '2024-12-20',
    endDate: '2025-01-20',
    amount: 29,
  },
  {
    id: 'sub-4',
    userName: 'Laura Díaz',
    userEmail: 'laura.diaz@example.com',
    plan: 'PRO',
    status: 'EXPIRED',
    startDate: '2024-11-10',
    endDate: '2024-12-10',
    amount: 29,
  },
];

export const AdminSubscriptions: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'>('ALL');

  const filteredSubscriptions = MOCK_SUBSCRIPTIONS.filter(sub => {
    const matchesSearch = 
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSubscriptions = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'ACTIVE').length;
  const totalRevenue = MOCK_SUBSCRIPTIONS
    .filter(s => s.status === 'ACTIVE')
    .reduce((acc, s) => acc + s.amount, 0);

  const handleCancelSubscription = (subId: string, userName: string) => {
    if (window.confirm(`¿Cancelar suscripción de ${userName}?`)) {
      console.log('Cancel subscription:', subId);
      alert('Suscripción cancelada (mock)');
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.background,
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          <img src={logoGD} alt="Logo" style={{ width: '50px', height: '40px' }} />
          <h1 style={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
            fontWeight: '100',
            color: 'white',
            margin: 0,
          }}>
            Investiga <span style={{ fontWeight: 'bold', color: COLORS.primary }}>ODS</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => navigate(ROUTES.ADMIN)}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Dashboard
          </button>
          <span style={{
            padding: '6px 12px',
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            color: '#ff6b6b',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            ADMIN
          </span>
          <span style={{ color: 'white', fontSize: '14px' }}>
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '60px 80px' }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
          <div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '10px',
            }}>
              Gestión de Suscripciones
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              {filteredSubscriptions.length} suscripciones registradas
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px',
          marginBottom: '40px',
        }}>
          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
            }}>
              Suscripciones Activas
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: COLORS.primary,
            }}>
              {activeSubscriptions}
            </div>
          </div>

          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
            }}>
              Ingresos Mensuales
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: COLORS.primary,
            }}>
              ${totalRevenue}
            </div>
          </div>

          <div style={{
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
            }}>
              Total Suscripciones
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
            }}>
              {MOCK_SUBSCRIPTIONS.length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: '500px',
              padding: '14px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              fontSize: '16px',
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            {(['ALL', 'ACTIVE', 'CANCELLED', 'EXPIRED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: statusFilter === status ? COLORS.primary : 'transparent',
                  color: statusFilter === status ? COLORS.textDark : 'white',
                  border: `2px solid ${statusFilter === status ? COLORS.primary : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {status === 'ALL' ? 'Todas' : status === 'ACTIVE' ? 'Activas' : status === 'CANCELLED' ? 'Canceladas' : 'Expiradas'}
              </button>
            ))}
          </div>
        </div>

        {/* Subscriptions Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr',
            padding: '20px 25px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              USUARIO
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              EMAIL
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              INICIO
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              FIN
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              ESTADO
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 'bold' }}>
              MONTO
            </div>
          </div>

          {/* Table Body */}
          {filteredSubscriptions.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '16px',
            }}>
              No se encontraron suscripciones
            </div>
          ) : (
            filteredSubscriptions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr',
                  padding: '20px 25px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                  {sub.userName}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {sub.userEmail}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {new Date(sub.startDate).toLocaleDateString('es-ES')}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {new Date(sub.endDate).toLocaleDateString('es-ES')}
                </div>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: 
                      sub.status === 'ACTIVE' ? 'rgba(93, 187, 70, 0.2)' :
                      sub.status === 'CANCELLED' ? 'rgba(255, 107, 107, 0.2)' :
                      'rgba(255, 255, 255, 0.1)',
                    color: 
                      sub.status === 'ACTIVE' ? COLORS.primary :
                      sub.status === 'CANCELLED' ? '#ff6b6b' :
                      'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {sub.status === 'ACTIVE' ? 'Activa' : sub.status === 'CANCELLED' ? 'Cancelada' : 'Expirada'}
                  </span>
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  ${sub.amount}
                  {sub.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCancelSubscription(sub.id, sub.userName)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'rgba(255, 107, 107, 0.2)',
                        color: '#ff6b6b',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      🔒 Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
