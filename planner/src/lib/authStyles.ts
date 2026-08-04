import type { CSSProperties } from 'react';

export const authShellStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--rw-white)',
  padding: 24,
};

export const authCardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 400,
  background: 'var(--surface-page)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-lg)',
  padding: '36px 34px',
};

export const fieldLabelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontFamily: 'var(--font-body)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

export const inputStyle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  color: 'var(--text-body)',
  background: 'var(--rw-white)',
  border: '1px solid var(--border-soft)',
  borderRadius: 12,
  padding: '12px 15px',
  outline: 'none',
  textTransform: 'none',
  letterSpacing: 'normal',
  fontWeight: 400,
};

export const primaryButtonStyle: CSSProperties = {
  marginTop: 6,
  padding: '13px 22px',
  borderRadius: 'var(--radius-pill)',
  border: 'none',
  background: 'var(--rw-buttermilk)',
  color: 'var(--rw-dark-tortoise)',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: '0.9375rem',
  boxShadow: 'var(--shadow-sunny)',
};
