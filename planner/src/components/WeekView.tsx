'use client';

import { TYPES, typeMeta } from '@/lib/constants';
import { addDays, fromKey, keyOf, startOfWeek, todayKey } from '@/lib/dates';
import { usePlanner } from './PlannerContext';
import { PostCard } from './PostCard';

export function WeekView() {
  const { cursor, posts, postsForDay, openNew, moveTo, dragId } = usePlanner();
  const start = startOfWeek(fromKey(cursor));
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) days.push(addDays(start, i));
  const today = todayKey();
  const weekKeys = days.map(keyOf);
  const weekPosts = posts.filter((p) => p.date && weekKeys.includes(p.date));
  const missing = TYPES.filter((t) => !weekPosts.some((p) => p.type === t));

  return (
    <div style={{ animation: 'rwaFade var(--dur-base) var(--ease-soft)' }}>
      {missing.length ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            flexWrap: 'wrap',
            padding: '11px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--rw-buttermilk-100)',
            border: '1px solid var(--border-soft)',
            marginBottom: 16,
          }}
        >
          <span style={{ display: 'inline-flex', gap: 5 }}>
            {missing.map((t) => (
              <span key={t} style={{ width: 9, height: 9, borderRadius: '999px', background: typeMeta(t).accent }} />
            ))}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)' }}>
            No {missing.join(' or ')} planned this week — even one small one counts.
          </span>
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderTop: '1px solid var(--border-soft)' }}>
        {days.map((c, idx) => {
          const key = keyOf(c);
          const dayPosts = postsForDay(key);
          const isToday = key === today;
          return (
            <div
              key={key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) moveTo(dragId, key);
              }}
              style={{
                borderRight: idx < 6 ? '1px solid var(--border-soft)' : 'none',
                minHeight: 420,
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                background: isToday ? 'var(--rw-buttermilk-200)' : 'var(--rw-white)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  paddingBottom: 10,
                  marginBottom: 4,
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {c.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--text-heading)', lineHeight: 1, fontWeight: isToday ? 700 : 500 }}>{c.getDate()}</span>
                </div>
                <button
                  onClick={() => openNew(key)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '999px',
                    border: '1px solid var(--border-soft)',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1,
                  }}
                >
                  +
                </button>
              </div>
              {dayPosts.map((p) => (
                <PostCard key={p.id} post={p} full={false} />
              ))}
              {dayPosts.length === 0 ? (
                <div
                  onClick={() => openNew(key)}
                  style={{
                    flex: 1,
                    minHeight: 50,
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingTop: 6,
                    color: 'var(--rw-sandy-shore)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  — rest, or add one
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
