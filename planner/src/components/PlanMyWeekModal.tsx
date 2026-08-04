'use client';

import { WEEK_TEMPLATE, pillarOf } from '@/lib/constants';
import { addDays, fromKey, startOfWeek } from '@/lib/dates';
import { usePlanner } from './PlannerContext';
import { ModalOverlay } from './ModalOverlay';

export function PlanMyWeekModal() {
  const { cursor, planOpen, setPlanOpen, applyWeekTemplate } = usePlanner();
  if (!planOpen) return null;
  const start = startOfWeek(fromKey(cursor));

  return (
    <ModalOverlay onClose={() => setPlanOpen(false)} maxWidth={560}>
      <div style={{ padding: '30px 30px 24px', textAlign: 'center', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="rw-eyebrow">Weekly rhythm</div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.7rem', color: 'var(--rw-golden-honey)', lineHeight: 1, margin: '8px 0' }}>
          one day at a time
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--text-body)', margin: '8px auto 0', maxWidth: 400, lineHeight: 1.6 }}>
          A gentle 7-day cadence across your four pillars. We’ll drop these in as ideas — edit or delete anything.
        </p>
      </div>
      <div style={{ padding: '12px 30px' }}>
        {WEEK_TEMPLATE.map((t, i) => {
          const day = addDays(start, i);
          const pl = pillarOf(t.pillar);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 6 ? '1px solid var(--border-soft)' : 'none' }}>
              <span style={{ width: 44, fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span style={{ width: 10, height: 10, borderRadius: '999px', background: pl.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', width: 64, flexShrink: 0 }}>
                {t.type}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', color: 'var(--text-heading)' }}>{t.title}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '18px 30px 26px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button
          onClick={() => setPlanOpen(false)}
          style={{ padding: '11px 22px', borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-body)' }}
        >
          Not now
        </button>
        <button
          onClick={applyWeekTemplate}
          style={{ padding: '11px 26px', borderRadius: '999px', border: 'none', background: 'var(--rw-buttermilk)', color: 'var(--rw-dark-tortoise)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, boxShadow: 'var(--shadow-sunny)' }}
        >
          Add these to my week
        </button>
      </div>
    </ModalOverlay>
  );
}
