'use client';

import { usePlanner } from './PlannerContext';
import { PostCard } from './PostCard';

export function IdeasView() {
  const { posts, filter, sfilter, openNew } = usePlanner();
  let ideas = posts.filter((p) => !p.date);
  if (filter) ideas = ideas.filter((p) => p.pillar === filter);
  if (sfilter) ideas = ideas.filter((p) => p.status === sfilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'rwaFade var(--dur-base) var(--ease-soft)' }}>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', maxWidth: 560, margin: 0, lineHeight: 1.7, fontSize: '1.0625rem' }}>
        A gentle holding place for the thoughts you have at midnight. Move one to the calendar when it’s ready — no pressure.
      </p>
      {ideas.length === 0 ? (
        <div style={{ padding: '48px 0', color: 'var(--rw-sandy-shore)', fontFamily: 'var(--font-body)' }}>No ideas here yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {ideas.map((p) => (
            <PostCard key={p.id} post={p} full />
          ))}
        </div>
      )}
      <button
        onClick={() => openNew(null)}
        style={{
          alignSelf: 'flex-start',
          padding: '11px 22px',
          borderRadius: '999px',
          border: '1.5px solid var(--rw-dark-tortoise)',
          background: 'transparent',
          color: 'var(--rw-dark-tortoise)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
        }}
      >
        + Capture an idea
      </button>
    </div>
  );
}
