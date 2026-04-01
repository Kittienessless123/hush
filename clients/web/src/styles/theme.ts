export const themes = {
  dark: {
    background: '#1C1C1C',
    surface: '#2C2C2C',
    surfaceHover: '#3C3C3C',
    text: '#ffffff',
    textSecondary: '#979797',
    border: 'rgba(151,151,151,0.3)',
    borderHover: '#979797',
    
    glow: 'rgba(151,151,151,0.15)',
    glowHover: 'rgba(151,151,151,0.6)',
    glowFocus: 'rgba(151,151,151,0.4)',
    
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    
    divider: 'rgba(151,151,151,0.2)',
    overlay: 'rgba(0,0,0,0.5)',
  },
  light: {

    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#f0f0f0',
    text: '#1C1C1C',
    textSecondary: '#666666',
    border: 'rgba(0,0,0,0.1)',
    borderHover: '#1C1C1C',
    
    glow: 'rgba(0,0,0,0.05)',
    glowHover: 'rgba(0,0,0,0.2)',
    glowFocus: 'rgba(0,0,0,0.1)',
    
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    
    divider: 'rgba(0,0,0,0.1)',
    overlay: 'rgba(255,255,255,0.5)',
  }
};

export type Theme = typeof themes.dark;

