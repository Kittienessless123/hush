import type { CSSProperties } from 'react';
import type { Theme } from './theme';

export const getThreeColumnLayout = (theme: Theme): CSSProperties => ({
  minHeight: 'calc(100vh - 70px)',
  backgroundColor: theme.background,
});

export const getCenterColumn = (theme: Theme): CSSProperties => ({
  flex: '0 0 33.333%',
  maxWidth: '500px',
  width: '100%',
  backgroundColor: theme.background,
  borderLeft: `1px solid ${theme.divider}`,
  borderRight: `1px solid ${theme.divider}`,
});

export const getFormContainer = (theme: Theme): CSSProperties => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 70px)',
  backgroundColor: theme.background,
  padding: '20px',
});

export const getFormCard = (theme: Theme): CSSProperties => ({
  backgroundColor: 'transparent',
  padding: '40px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '450px',
  border: `1px solid ${theme.border}`,
  boxShadow: `0 0 30px ${theme.glow}`,
  backdropFilter: 'blur(10px)',
});

export const flexCenter: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexBetween: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const flexColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};