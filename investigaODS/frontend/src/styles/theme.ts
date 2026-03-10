// Design System - Investiga ODS
export const theme = {
  colors: {
    // Main colors
    primary: '#5dbb46', // Verde principal
    secondary: '#d9d203', // Amarillo
    background: '#062860', // Azul marino
    backgroundLight: '#0a3580',
    
    // Status colors
    success: '#5dbb46',
    warning: '#FFB800',
    danger: '#FF4757',
    info: '#3498db',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textTertiary: 'rgba(255, 255, 255, 0.6)',
    textDark: '#062860', // Para texto sobre fondos claros
    
    // Category colors (ODS)
    category: {
      ecs: '#1E88E5', // Azul
      ecc: '#FF9800', // Naranja
      grec: '#4CAF50', // Verde
      abb: '#00BCD4', // Cyan
      syb: '#FFB800', // Amarillo
      iyc: '#E91E63', // Rosa
      itr: '#F44336', // Rojo
      epv: '#8BC34A', // Verde claro
    },
    
    // UI colors
    border: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    card: 'rgba(255, 255, 255, 0.05)',
  },
  
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  breakpoints: {
    mobile: '0px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
} as const;

export type Theme = typeof theme;
