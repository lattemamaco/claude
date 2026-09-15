'use client';

import { pillarOf, statusOf, typeMeta } from '@/lib/constants';
import { Post } from '@/lib/types';
import { usePlanner } from './PlannerContext';

export function PostChip({ post }: { post: Post }) {
  const { hover, setHover, dragId, setDragId, openEdit, isOverdue } = usePlanner();
  const tm = typeMeta(post.type);
  const hv = hover === post.id;

  return (
    <div
      draggable
      onDragStart={(e) => {
        setDragId(post.id);
        setHover(null);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => setDragId(null)}
      onMouseEnter={() => setHover(post.id)}
      onMouseLeave={() => setHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        openEdit(post);
      }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 7,
        cursor: 'pointer',
        background: tm.tint,
        boxShadow: hv ? 'var(--shadow-sm)' : 'none',
        opacity: dragId === post.id ? 0.35 : 1,
        transition: 'box-shadow var(--dur-fast) var(--ease-soft)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--rw-dark-tortoise)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3,
        }}
      >
        {post.title || 'Untitled'}
      </span>
      {isOverdue(post) ? (
        <span title="Past its date, not posted yet" style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '999px', background: 'var(--rw-burgundy)' }} />
      ) : null}
      {hv && !dragId ? <CaptionPreview post={post} /> : null}
    </div>
  );
}

function CaptionPreview({ post }: { post: Post }) {
  const pl = pillarOf(post.pillar);
  const st = statusOf(post.status);
  const cap = post.caption && post.caption.trim() ? post.caption : 'No caption yet — click to write it.';
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        zIndex: 40,
        width: 262,
        padding: '15px 17px',
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-soft)',
        cursor: 'default',
        animation: 'rwaFade var(--dur-fast) var(--ease-soft)',
        pointerEvents: 'none',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--rw-dark-tortoise)',
            opacity: 0.72,
          }}
        >
          {(post.time ? post.time + ' · ' : '') + post.type}
        </span>
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
            color: 'var(--text-muted)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '999px', background: st.dot }} />
          {st.label}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', lineHeight: 1.25, color: 'var(--text-heading)', marginBottom: cap ? 7 : 0 }}>
        {post.title || 'Untitled'}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          lineHeight: 1.55,
          color: 'var(--text-body)',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {cap}
      </div>
      {post.hashtags && post.hashtags.trim() ? (
        <div style={{ marginTop: 8, fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.hashtags}
        </div>
      ) : null}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '999px', background: pl.color }} />
        {pl.name}
      </div>
    </div>
  );
}
