import type { CSSProperties } from 'react';
import { type Theme } from './theme';
import { transitions } from './animations';

export const getProfileHeaderStyle = (theme: Theme): CSSProperties => ({
  padding: '16px 20px',
  borderBottom: `1px solid ${theme.divider}`,
  backgroundColor: theme.background,
});

export const getProfileInfoStyle = (theme: Theme): CSSProperties => ({
  padding: '24px 20px',
  backgroundColor: theme.background,
});

export const getStatusBadgeStyle = (theme: Theme): CSSProperties => ({
  padding: '12px 16px',
  backgroundColor: theme.surface,
  borderRadius: '12px',
  border: `1px solid ${theme.divider}`,
  color: theme.text,
});

export const getAvatarStyle = (theme: Theme): CSSProperties => ({
  backgroundColor: theme.surface,
  color: theme.textSecondary,
  border: `2px solid ${theme.border}`,
  transition: transitions.default,
});

export const getAvatarHoverStyle = (theme: Theme): CSSProperties => ({
  borderColor: theme.borderHover,
  boxShadow: `0 0 20px ${theme.glowFocus}`,
});