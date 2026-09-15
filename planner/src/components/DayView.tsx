'use client';

import { usePlanner } from './PlannerContext';
import { PostCard } from './PostCard';

export function DayView() {
  const { cursor, postsForDay, openNew, moveTo, dragId } = usePlanner();
  const key = cursor;
  const dayPosts = postsForDay(key);

  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragId) moveTo(dragId, key);
    },
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', animation: 'rwaFade var(--dur-base) var(--ease-soft)' }}>
      {dayPosts.length === 0 ? (
        <div
          {...dropProps}
          style={{
            borderTop: '1px solid var(--border-soft)',
            padding: '72px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.75rem', color: 'var(--rw-golden-honey)', lineHeight: 1 }}>a quiet page</span>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', maxWidth: 360, margin: 0, lineHeight: 1.7 }}>
            Nothing planned for this day yet. You’re not behind — you’re becoming.
          </p>
          <button
            onClick={() => openNew(key)}
            style={{
              marginTop: 6,
              padding: '11px 26px',
              borderRadius: '999px',
              border: '1.5px solid var(--rw-dark-tortoise)',
              background: 'transparent',
              color: 'var(--rw-dark-tortoise)',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            + Plan a post
          </button>
        </div>
      ) : (
        <div {...dropProps} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {dayPosts.map((p) => (
            <PostCard key={p.id} post={p} full />
          ))}
        </div>
      )}
    </div>
  );
}
