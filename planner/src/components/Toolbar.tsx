'use client';

import { STATUSES } from '@/lib/constants';
import { addDays, fromKey, startOfWeek } from '@/lib/dates';
import { usePlanner } from './PlannerContext';

function periodLabel(view: string, cursor: string) {
  const d = fromKey(cursor);
  if (view === 'month') return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  if (view === 'week') {
    const s = startOfWeek(d);
    const e = addDays(s, 6);
    const so = s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const eo = e.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `${so} – ${eo}`;
  }
  if (view === 'day') return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return 'The idea backlog';
}

function periodSub(view: string, cursor: string) {
  const d = fromKey(cursor);
  if (view === 'week') return d.getFullYear();
  if (view === 'ideas') return 'no date, no pressure';
  return null;
}

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: '999px',
        border: '1px solid var(--border-soft)',
        background: 'transparent',
        color: 'var(--rw-dark-tortoise)',
        cursor: 'pointer',
        fontSize: '1.05rem',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

export function Toolbar() {
  const { view, cursor, shift, goToday, sfilter, setSfilter } = usePlanner();
  const isIdeas = view === 'ideas';
  const sub = periodSub(view, cursor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {isIdeas ? null : (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 600, color: 'var(--text-heading)', margin: 0, lineHeight: 1 }}>
              {periodLabel(view, cursor)}
            </h2>
            {sub ? <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{sub}</span> : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NavButton label="‹" onClick={() => shift(-1)} />
            <button
              onClick={goToday}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1px solid var(--border-soft)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-body)',
                letterSpacing: '0.02em',
              }}
            >
              Today
            </button>
            <NavButton label="›" onClick={() => shift(1)} />
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="rw-eyebrow" style={{ marginRight: 2 }}>
          Status
        </span>
        {STATUSES.map((sm) => {
          const on = sfilter === sm.id;
          const dim = sfilter && !on;
          return (
            <button
              key={sm.id}
              onClick={() => setSfilter(on ? null : sm.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                border: '1px solid ' + (on ? 'var(--rw-dark-tortoise)' : 'var(--border-soft)'),
                background: on ? 'var(--rw-buttermilk)' : 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                fontWeight: on ? 600 : 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-body)',
                opacity: dim ? 0.45 : 1,
                transition: 'all var(--dur-fast) var(--ease-soft)',
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '999px', background: sm.dot }} />
              {sm.label}
            </button>
          );
        })}
      </div>
      <div style={{ height: 1, background: 'var(--border-soft)' }} />
    </div>
  );
}
