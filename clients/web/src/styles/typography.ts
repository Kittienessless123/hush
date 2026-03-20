import type { CSSProperties } from 'react';
import type { Theme } from './theme';

// Заголовки форм
export const getFormTitleStyle = (theme: Theme): CSSProperties => ({
  textAlign: 'center',
  color: theme.textSecondary,
  marginBottom: '32px',
  fontSize: '32px',
  fontWeight: 400,
  fontFamily: "'Six Caps', sans-serif",
  letterSpacing: '2px',
  textTransform: 'uppercase',
});

// Логотип HUSH
export const getHushLogoStyle = (theme: Theme): CSSProperties => ({
  fontFamily: "'Six Caps', sans-serif",
  fontWeight: 200,
  letterSpacing: '-10%',
  fontStretch: '20%',
  fontSize: '220px',
  color: theme.textSecondary,
  lineHeight: 0.9,
  marginBottom: 32,
  textTransform: 'uppercase',
  transform: 'scaleX(0.6)',
});

// Заголовки страниц
export const getPageTitleStyle = (theme: Theme): CSSProperties => ({
  margin: 0,
  color: theme.text,
});

export const getSecondaryTextStyle = (theme: Theme): CSSProperties => ({
  color: theme.textSecondary,
});