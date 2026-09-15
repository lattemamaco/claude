'use client';

import { pillarOf, statusOf, typeMeta } from '@/lib/constants';
import { Post } from '@/lib/types';
import { usePlanner } from './PlannerContext';

function StatusLine({ post }: { post: Post }) {
  const s = statusOf(post.status);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '999px', background: s.dot }} />
      {s.label}
    </span>
  );
}

export function PostCard({ post, full }: { post: Post; full: boolean }) {
  const { hover, setHover, dragId, setDragId, openEdit, isOverdue } = usePlanner();
  const pl = pillarOf(post.pillar);
  const tm = typeMeta(post.type);
  const hv = hover === post.id;

  return (
    <div
      draggable
      onDragStart={(e) => {
        setDragId(post.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => setDragId(null)}
      onMouseEnter={() => setHover(post.id)}
      onMouseLeave={() => setHover(null)}
      onClick={() => openEdit(post)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: full ? 9 : 5,
        padding: full ? '18px 20px' : '10px 12px',
        background: tm.tint,
        borderRadius: full ? 'var(--radius-md)' : 10,
        boxShadow: hv ? 'var(--shadow-sm)' : 'none',
        opacity: dragId === post.id ? 0.35 : 1,
        transition: 'box-shadow var(--dur-fast) var(--ease-soft)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--rw-dark-tortoise)',
            opacity: 0.72,
          }}
        >
          {(post.time ? post.time + ' · ' : '') + post.type}
        </span>
        {isOverdue(post) ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--rw-burgundy)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '999px', background: 'var(--rw-burgundy)' }} />
            Overdue
          </span>
        ) : null}
        {full ? <StatusLine post={post} /> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: full ? '1.4rem' : '0.95rem',
            lineHeight: 1.2,
            color: 'var(--text-heading)',
            fontWeight: full ? 600 : 500,
          }}
        >
          {post.title || 'Untitled'}
        </div>
      </div>
      {full && post.caption ? (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: 1.6, maxWidth: '62ch' }}>{post.caption}</div>
      ) : null}
      {full && post.thumb_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.thumb_url}
          alt=""
          style={{ width: '100%', maxWidth: 420, height: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginTop: 4 }}
        />
      ) : null}
      {full ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 2, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.06em', color: 'var(--text-body)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '999px', background: pl.color }} />
            {pl.name}
          </span>
          {post.hashtags && post.hashtags.trim() ? (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{post.hashtags}</span>
          ) : null}
          {post.cta && post.cta.trim() ? <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--rw-golden-honey)' }}>{post.cta}</span> : null}
        </div>
      ) : (
        <div>
          <StatusLine post={post} />
        </div>
      )}
    </div>
  );
}
