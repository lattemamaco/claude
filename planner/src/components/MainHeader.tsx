'use client';

import { usePlanner } from './PlannerContext';

const NAMES: Record<string, string> = {
  month: 'content calendar',
  week: 'this week',
  day: 'today',
  ideas: 'content ideas',
};

export function MainHeader() {
  const { view } = usePlanner();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
      <span style={{ flexBasis: 80, flexGrow: 1, maxWidth: 130, height: 1, background: 'var(--border-soft)' }} />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '2rem',
          color: 'var(--rw-golden-honey)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {NAMES[view] || ''}
      </span>
      <span style={{ flexBasis: 80, flexGrow: 1, maxWidth: 130, height: 1, background: 'var(--border-soft)' }} />
    </div>
  );
}
