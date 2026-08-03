'use client';

import { TYPES, typeMeta } from '@/lib/constants';
import { addDays, fromKey, keyOf, startOfWeek, todayKey } from '@/lib/dates';
import { usePlanner } from './PlannerContext';
import { PostChip } from './PostChip';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function TypeLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
      <span className="rw-eyebrow">By format</span>
      {TYPES.map((t) => {
        const tm = typeMeta(t);
        return (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-body)' }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, background: tm.tint, border: '1px solid ' + tm.accent }} />
            {t}
          </span>
        );
      })}
    </div>
  );
}

export function MonthView() {
  const { cursor, postsForDay, openNew, moveTo, dragId, hover, posts } = usePlanner();
  const d = fromKey(cursor);
  const first = new Date(d.getFullYear(), d.getMonth(), 1, 12);
  const start = startOfWeek(first);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  const today = todayKey();
  const hoverKey = hover ? posts.find((p) => p.id === hover)?.date ?? null : null;

  return (
    <div style={{ animation: 'rwaFade var(--dur-base) var(--ease-soft)' }}>
      <TypeLegend />
      <div style={{ borderTop: '1px solid var(--border-soft)', borderLeft: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              style={{
                padding: '12px 12px 10px',
                borderRight: '1px solid var(--border-soft)',
                borderBottom: '1px solid var(--border-soft)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              {w}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {cells.map((c) => {
            const key = keyOf(c);
            const inMonth = c.getMonth() === d.getMonth();
            const dayPosts = postsForDay(key);
            const isToday = key === today;
            const hasHover = hoverKey === key;
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
                onClick={() => openNew(key)}
                style={{
                  height: 132,
                  boxSizing: 'border-box',
                  padding: '8px 8px 10px',
                  borderRight: '1px solid var(--border-soft)',
                  borderBottom: '1px solid var(--border-soft)',
                  background: inMonth ? 'var(--rw-white)' : 'var(--rw-shell)',
                  position: 'relative',
                  zIndex: hasHover ? 30 : 1,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  overflow: hasHover ? 'visible' : 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: isToday ? 700 : 500,
                      color: inMonth ? 'var(--text-heading)' : 'var(--rw-sandy-shore)',
                      lineHeight: 1,
                      width: 26,
                      height: 26,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '999px',
                      border: isToday ? '1.5px solid var(--rw-dark-tortoise)' : '1.5px solid transparent',
                    }}
                  >
                    {c.getDate()}
                  </span>
                  {dayPosts.length ? (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{dayPosts.length}</span>
                  ) : null}
                </div>
                {dayPosts.slice(0, 3).map((p) => (
                  <PostChip key={p.id} post={p} />
                ))}
                {dayPosts.length > 3 ? (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', paddingLeft: 14 }}>+{dayPosts.length - 3} more</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
