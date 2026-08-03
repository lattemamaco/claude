'use client';

export function Seg<T extends string>({
  options,
  value,
  onPick,
  colorFn,
}: {
  options: { id: T; label: string }[];
  value: T;
  onPick: (id: T) => void;
  colorFn?: (id: T) => string;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 15px',
              borderRadius: '999px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: on ? 600 : 500,
              transition: 'all var(--dur-fast) var(--ease-soft)',
              border: '1px solid ' + (on ? 'var(--rw-dark-tortoise)' : 'var(--border-soft)'),
              background: on ? 'var(--rw-dark-tortoise)' : 'transparent',
              color: on ? 'var(--rw-shell)' : 'var(--text-body)',
            }}
          >
            {colorFn ? <span style={{ width: 9, height: 9, borderRadius: '999px', background: colorFn(o.id) }} /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  color: 'var(--text-body)',
  background: 'var(--rw-white)',
  border: '1px solid var(--border-soft)',
  borderRadius: 12,
  padding: '12px 15px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
