'use client';

import { usePlanner } from './PlannerContext';
import { SignOutButton } from './SignOutButton';

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { openNew } = usePlanner();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
      <button
        className="rw-menu-toggle"
        onClick={onOpenMenu}
        aria-label="Open menu"
        style={{
          width: 38,
          height: 38,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '999px',
          border: '1px solid var(--border-soft)',
          background: 'var(--rw-white)',
          cursor: 'pointer',
          color: 'var(--rw-dark-tortoise)',
          fontSize: '1.1rem',
          flexShrink: 0,
        }}
      >
        ☰
      </button>
      <button
        className="rw-mobile-new-post"
        onClick={() => openNew(null)}
        style={{
          padding: '9px 16px',
          borderRadius: 'var(--radius-pill)',
          border: 'none',
          background: 'var(--rw-buttermilk)',
          color: 'var(--rw-dark-tortoise)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.8125rem',
          boxShadow: 'var(--shadow-sunny)',
          flex: 1,
        }}
      >
        + New post
      </button>
      <SignOutButton />
    </div>
  );
}
