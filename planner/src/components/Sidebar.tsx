'use client';

import { PILLARS, AUDIENCE_BLURB } from '@/lib/constants';
import { usePlanner } from './PlannerContext';
import { PhotoSlot } from './PhotoSlot';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="rw-eyebrow" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
      {children}
      <span style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
    </div>
  );
}

function Bullet({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 9,
        alignItems: 'flex-start',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        color: color || 'var(--text-body)',
        lineHeight: 1.5,
        fontWeight: color ? 500 : 400,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '999px', background: color || 'var(--rw-golden-honey)', marginTop: 6, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

const NAV_ITEMS: { id: 'month' | 'week' | 'day' | 'ideas'; label: string }[] = [
  { id: 'month', label: 'content calendar' },
  { id: 'week', label: 'this week' },
  { id: 'day', label: 'today' },
  { id: 'ideas', label: 'content ideas' },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const { userId, displayName, view, setView, filter, setFilter, stats, setGenOpen, setPlanOpen, sidebarPhoto, setSidebarPhotoUrl } =
    usePlanner();
  const navigate = onNavigate || (() => {});
  const s = stats();
  const todayLong = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div
        style={{
          background: 'var(--rw-buttermilk)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sunny)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--rw-dark-tortoise)' }}>
          consistency is <span style={{ fontStyle: 'italic', color: 'var(--rw-golden-honey)' }}>key.</span>
        </div>
      </div>

      <div>
        <Label>quick view</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-heading)' }}>Hello, {displayName}!</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Today is {todayLong}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Bullet>
            You have {s.today} post{s.today === 1 ? '' : 's'} to publish today
          </Bullet>
          {s.overdue ? (
            <Bullet color="var(--rw-burgundy)">
              {s.overdue} post{s.overdue === 1 ? '' : 's'} slipped past — reschedule or mark posted
            </Bullet>
          ) : null}
          <Bullet>
            You have {s.drafted} post{s.drafted === 1 ? '' : 's'} to review
          </Bullet>
          <Bullet>{s.scheduled} scheduled & ready to go</Bullet>
          <Bullet>
            {s.ideas} idea{s.ideas === 1 ? '' : 's'} waiting in the backlog
          </Bullet>
        </div>
      </div>

      <div>
        <Label>{filter ? 'my pillars · filtering' : 'my pillars'}</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {PILLARS.map((pl) => {
            const on = filter === pl.id;
            const dim = filter && !on;
            return (
              <button
                key={pl.id}
                onClick={() => {
                  setFilter(on ? null : pl.id);
                  navigate();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 10px',
                  background: on ? 'var(--rw-buttermilk-200)' : 'transparent',
                  opacity: dim ? 0.5 : 1,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: on ? 600 : 500,
                  color: 'var(--text-heading)',
                  lineHeight: 1.3,
                  transition: 'all var(--dur-fast) var(--ease-soft)',
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: '999px', background: pl.color, flexShrink: 0 }} />
                {pl.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>my audience</Label>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
          {AUDIENCE_BLURB}
        </p>
      </div>

      <div>
        <Label>the planner</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const on = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  navigate();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: 'none',
                  background: on ? 'var(--rw-buttermilk)' : 'transparent',
                  transition: 'background var(--dur-fast) var(--ease-soft)',
                }}
              >
                <span style={{ color: 'var(--rw-golden-honey)', fontWeight: 700 }}>|</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: on ? 600 : 500, color: 'var(--text-heading)' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button
          onClick={() => {
            setGenOpen(true);
            navigate();
          }}
          style={{
            padding: '12px 18px',
            borderRadius: '999px',
            border: 'none',
            background: 'var(--rw-buttermilk)',
            color: 'var(--rw-dark-tortoise)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
            boxShadow: 'var(--shadow-sunny)',
          }}
        >
          Generate ideas with AI
        </button>
        <button
          onClick={() => {
            setPlanOpen(true);
            navigate();
          }}
          style={{
            padding: '12px 18px',
            borderRadius: '999px',
            border: '1px solid var(--border-soft)',
            background: 'transparent',
            color: 'var(--rw-dark-tortoise)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
          }}
        >
          Plan my week
        </button>
      </div>

      <PhotoSlot
        userId={userId}
        folder="sidebar"
        url={sidebarPhoto}
        placeholder="a warm photo of you"
        style={{ borderRadius: 'var(--radius-md)', height: 200, width: '100%' }}
        onChange={(url) => setSidebarPhotoUrl(url)}
      />
    </div>
  );
}
