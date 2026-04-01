export const transitions = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
};

export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideIn: `
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `,
  glow: `
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(151,151,151,0.2); }
      50% { box-shadow: 0 0 20px rgba(151,151,151,0.6); }
      100% { box-shadow: 0 0 5px rgba(151,151,151,0.2); }
    }
  `,
};