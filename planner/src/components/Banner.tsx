'use client';

import { usePlanner } from './PlannerContext';
import { PhotoSlot } from './PhotoSlot';

const PLACEHOLDERS = ['coffee & linen', 'sunlit desk', 'open journal', 'lemons & daisies', 'cozy corner'];
const FLEX = [1, 1, 1.2, 1, 1];

export function Banner() {
  const { userId, bannerPhotos, setBannerSlot, openNew } = usePlanner();

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 30,
      }}
    >
      <div style={{ display: 'flex', gap: 0, height: 230 }}>
        {PLACEHOLDERS.map((placeholder, i) => (
          <PhotoSlot
            key={i}
            userId={userId}
            folder="banner"
            url={bannerPhotos[i] ?? null}
            placeholder={placeholder}
            style={{ flex: FLEX[i], height: '100%' }}
            onChange={(url) => setBannerSlot(i, url)}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 52% 78% at 50% 54%, rgba(60,42,28,0.40) 0%, rgba(60,42,28,0.16) 48%, rgba(60,42,28,0) 78%), linear-gradient(180deg, rgba(60,42,28,0.12) 0%, rgba(60,42,28,0.06) 45%, rgba(60,42,28,0.20) 100%), rgba(60,42,28,0.30)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <span className="rw-eyebrow" style={{ color: 'var(--rw-shell)', textShadow: '0 1px 8px rgba(60,42,28,0.55)' }}>
          The Content Planner
        </span>
        <span
          style={{
            fontFamily: 'var(--font-banner)',
            fontSize: '4.2rem',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: 'var(--rw-pastel-blue)',
            textShadow: '0 2px 4px rgba(60,42,28,0.45), 0 1px 20px rgba(60,42,28,0.4)',
          }}
        >
          Becoming
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.35rem',
            color: 'var(--rw-buttermilk)',
            textShadow: '0 1px 8px rgba(60,42,28,0.55)',
          }}
        >
          little by little · an Instagram studio
        </span>
      </div>
      <div style={{ position: 'absolute', top: 18, right: 18 }}>
        <button
          onClick={() => openNew(null)}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: 'var(--rw-buttermilk)',
            color: 'var(--rw-dark-tortoise)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.8125rem',
            boxShadow: 'var(--shadow-sunny)',
          }}
        >
          + New post
        </button>
      </div>
    </div>
  );
}
