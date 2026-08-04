'use client';

import { PILLARS, TYPES, pillarOf, typeMeta } from '@/lib/constants';
import { GenIdea, PillarId, PostType } from '@/lib/types';
import { usePlanner } from './PlannerContext';
import { ModalOverlay } from './ModalOverlay';
import { inputStyle } from './Seg';

function ReviewCard({ r, onApprove, onDismiss }: { r: GenIdea; onApprove: () => void; onDismiss: () => void }) {
  const pl = pillarOf(r.pillar);
  const tm = typeMeta(r.type);
  const done = r._state !== 'pending';
  return (
    <div
      style={{
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        background: r._state === 'approved' ? 'var(--rw-buttermilk-100)' : 'var(--rw-white)',
        opacity: r._state === 'dismissed' ? 0.5 : 1,
        transition: 'all var(--dur-fast) var(--ease-soft)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
        <span style={{ width: 14, height: 14, borderRadius: 4, background: tm.tint, border: '1px solid ' + tm.accent, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rw-dark-tortoise)', opacity: 0.72 }}>
          {r.type}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '999px', background: pl.color }} />
          {pl.short}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', lineHeight: 1.25, color: 'var(--text-heading)' }}>{r.title}</div>
      {r.caption ? <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-body)' }}>{r.caption}</div> : null}
      {r.hashtags ? <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{r.hashtags}</div> : null}
      {r.cta ? <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--rw-golden-honey)' }}>{r.cta}</div> : null}
      {done ? (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', paddingTop: 2 }}>
          {r._state === 'approved' ? '✓ Added to backlog' : 'Dismissed'}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
          <button
            onClick={onApprove}
            style={{ padding: '8px 18px', borderRadius: '999px', border: 'none', background: 'var(--rw-buttermilk)', color: 'var(--rw-dark-tortoise)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8125rem', boxShadow: 'var(--shadow-sunny)' }}
          >
            Add to backlog
          </button>
          <button
            onClick={onDismiss}
            style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem' }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export function AIStudioModal() {
  const {
    genOpen,
    setGenOpen,
    genPillar,
    setGenPillar,
    genFormat,
    setGenFormat,
    genTopic,
    setGenTopic,
    genLoading,
    genViral,
    genResults,
    genError,
    runGen,
    approveIdea,
    dismissIdea,
    approveAll,
  } = usePlanner();

  if (!genOpen) return null;

  const pending = genResults.filter((r) => r._state === 'pending');
  const approved = genResults.filter((r) => r._state === 'approved').length;
  const pillOpts: { id: PillarId | ''; label: string }[] = [{ id: '', label: 'All pillars' }, ...PILLARS.map((p) => ({ id: p.id, label: p.short }))];
  const fmtOpts: { id: PostType | ''; label: string }[] = [{ id: '', label: 'Any format' }, ...TYPES.map((t) => ({ id: t, label: t }))];

  return (
    <ModalOverlay onClose={() => setGenOpen(false)} maxWidth={600}>
      <div style={{ padding: '28px 30px 22px', borderBottom: '1px solid var(--border-soft)', position: 'relative' }}>
        <div className="rw-eyebrow">Idea studio</div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.7rem', color: 'var(--rw-golden-honey)', lineHeight: 1.1, margin: '6px 0 4px' }}>
          little by little, ideas
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.6, maxWidth: 440 }}>
          A gentle brainstorm in your voice. Nothing saves until you approve it — add the ones that feel true, dismiss the rest.
        </p>
        <button
          onClick={() => setGenOpen(false)}
          style={{ position: 'absolute', top: 24, right: 26, width: 32, height: 32, borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--rw-dark-tortoise)', lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: 14, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pillar</label>
            <select value={genPillar} onChange={(e) => setGenPillar(e.target.value as PillarId | '')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              {pillOpts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Format</label>
            <select value={genFormat} onChange={(e) => setGenFormat(e.target.value as PostType | '')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              {fmtOpts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>On your mind (optional)</label>
          <input
            value={genTopic}
            placeholder="e.g. going back to church after a long time away"
            onChange={(e) => setGenTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runGen(false);
            }}
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => runGen(false)}
            disabled={genLoading}
            style={{
              padding: '11px 26px',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--rw-dark-tortoise)',
              color: 'var(--rw-shell)',
              cursor: genLoading ? 'default' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.875rem',
              opacity: genLoading ? 0.7 : 1,
            }}
          >
            {genLoading && !genViral ? 'Thinking…' : genResults.length && !genViral ? 'Regenerate' : 'Generate ideas'}
          </button>
          <button
            onClick={() => runGen(true)}
            disabled={genLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 24px',
              borderRadius: '999px',
              border: '1.5px solid var(--rw-golden-honey)',
              background: 'var(--rw-buttermilk)',
              color: 'var(--rw-dark-tortoise)',
              cursor: genLoading ? 'default' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.875rem',
              opacity: genLoading ? 0.7 : 1,
              boxShadow: 'var(--shadow-sunny)',
            }}
          >
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>✦</span> {genLoading && genViral ? 'Boosting…' : 'Viral boost'}
          </button>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Viral boost adapts proven high-share Instagram formats to your niche. It draws on what tends to travel — not today’s live trends.
        </p>
      </div>

      <div style={{ padding: '20px 30px 8px', maxHeight: '46vh', overflowY: 'auto' }}>
        {genError ? <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--rw-burgundy)', margin: '0 0 8px' }}>{genError}</p> : null}
        {genLoading && !genResults.length ? (
          <div style={{ padding: '30px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--rw-golden-honey)' }}>
            gathering gentle ideas…
          </div>
        ) : genResults.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {genResults.map((r) => (
              <ReviewCard key={r._id} r={r} onApprove={() => approveIdea(r._id)} onDismiss={() => dismissIdea(r._id)} />
            ))}
          </div>
        ) : genError ? null : (
          <div style={{ padding: '26px 0', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Pick a pillar and press Generate — ideas will show here for your review.
          </div>
        )}
      </div>

      <div style={{ padding: '16px 30px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-soft)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {approved ? `${approved} added to backlog` : pending.length ? `${pending.length} waiting for review` : ''}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setGenOpen(false)}
            style={{ padding: '11px 22px', borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-body)' }}
          >
            Done
          </button>
          {pending.length ? (
            <button
              onClick={approveAll}
              style={{ padding: '11px 24px', borderRadius: '999px', border: 'none', background: 'var(--rw-buttermilk)', color: 'var(--rw-dark-tortoise)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, boxShadow: 'var(--shadow-sunny)' }}
            >
              Add all {pending.length}
            </button>
          ) : null}
        </div>
      </div>
    </ModalOverlay>
  );
}
