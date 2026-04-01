import type { CSSProperties } from 'react';
import type { Theme } from './theme';

export const getChatHeaderStyle = (theme: Theme): CSSProperties => ({
  padding: '12px 20px',
  borderBottom: `1px solid ${theme.divider}`,
  backgroundColor: theme.background,
});

export const getMessageListStyle = (theme: Theme): CSSProperties => ({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  backgroundColor: theme.background,
});

export const getMessageInputStyle = (theme: Theme): CSSProperties => ({
  padding: '12px 20px',
  borderTop: `1px solid ${theme.divider}`,
  backgroundColor: theme.background,
});

export const getChatInfoStyle = (theme: Theme): CSSProperties => ({
  width: 320,
  height: '100%',
  backgroundColor: theme.background,
  borderLeft: `1px solid ${theme.divider}`,
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  overflowY: 'auto',
  zIndex: 10,
  animation: 'slideIn 0.3s ease',
});

export const getMessageBubbleStyle = (isOwn: boolean, theme: Theme): CSSProperties => ({
  maxWidth: '70%',
  padding: '8px 12px',
  borderRadius: '16px',
  backgroundColor: isOwn ? theme.surface : theme.surfaceHover,
  color: theme.text,
  border: `1px solid ${theme.divider}`,
  position: 'relative',
  borderTopRightRadius: isOwn ? '4px' : '16px',
  borderTopLeftRadius: !isOwn ? '4px' : '16px',
});

export const getAttachmentsStyle = (theme: Theme): CSSProperties => ({
  padding: '8px 12px',
  backgroundColor: theme.surface,
  borderRadius: '8px',
  marginBottom: '8px',
  border: `1px solid ${theme.divider}`,
});