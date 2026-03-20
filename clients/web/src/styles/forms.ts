import type { CSSProperties } from 'react';
import type { Theme } from './theme';

// Стили для инпутов
export const getInputStyle = (theme: Theme): CSSProperties => ({
  backgroundColor: 'transparent',
  border: `1px solid ${theme.border}`,
  borderRadius: '8px',
  padding: '12px',
  color: theme.text,
  fontSize: '16px',
  transition: 'all 0.3s ease',
});

// Стили для лейблов
export const getLabelStyle = (theme: Theme): CSSProperties => ({
  color: theme.textSecondary,
  fontSize: '16px',
  fontWeight: 400,
});

// Стили для кнопок
export const getButtonStyle = (theme: Theme): CSSProperties => ({
  width: '100%',
  height: '48px',
  fontSize: '18px',
  fontWeight: 500,
  background: theme.surface,
  color: theme.text,
  border: `1px solid ${theme.border}`,
  boxShadow: `0 0 15px ${theme.glow}`,
  borderRadius: '8px',
  transition: 'all 0.3s ease',
});

// Стили для Select
export const getSelectStyle = (theme?: { background: string; surface: string; surfaceHover: string; text: string; textSecondary: string; border: string; borderHover: string; glow: string; glowHover: string; glowFocus: string; success: string; error: string; warning: string; divider: string; overlay: string; }): CSSProperties => ({
  backgroundColor: 'transparent',
  borderRadius: '8px',
});

// Hover/Focus эффекты
export const inputFocusStyles = (theme: Theme) => ({
  boxShadow: `0 0 20px ${theme.glowFocus}`,
  borderColor: theme.borderHover,
});

export const buttonHoverStyles = (theme: Theme) => ({
  boxShadow: `0 0 25px ${theme.glowHover}`,
  background: theme.surfaceHover,
});

// Глобальные стили для Select dropdown
export const getSelectDropdownStyles = (theme: Theme) => `
  .custom-select-dropdown .ant-select-item {
    background-color: ${theme.surface};
    color: ${theme.text};
    transition: all 0.3s ease;
    border: none;
    margin: 0;
    padding: 8px 12px;
  }
  .custom-select-dropdown .ant-select-item:hover {
    background-color: ${theme.surfaceHover} !important;
    color: ${theme.text} !important;
  }
  .custom-select-dropdown .ant-select-item-option-selected {
    background-color: ${theme.surfaceHover} !important;
    color: ${theme.text} !important;
  }
  .custom-select-dropdown .ant-select-item-option-active {
    background-color: ${theme.surfaceHover} !important;
    color: ${theme.text} !important;
  }
`;