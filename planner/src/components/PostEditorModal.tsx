'use client';

import { useRef, useState } from 'react';
import { PILLARS, STATUSES, TYPES, pillarOf, statusOf, typeMeta } from '@/lib/constants';
import { fromKey } from '@/lib/dates';
import { PostType } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { uploadPlannerPhoto } from '@/lib/storage';
import { usePlanner } from './PlannerContext';
import { ModalOverlay } from './ModalOverlay';
import { Field, Seg, inputStyle } from './Seg';

export function PostEditorModal() {
  const {
    userId,
    editing,
    closeEditor,
    setEditingField,
    saveEditing,
    removePost,
    duplicatePost,
    posts,
    copyCaption,
    copied,
    capLoading,
    writeCaptionForEditing,
  } = usePlanner();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editing) return null;
  const pl = pillarOf(editing.pillar);
  const existingPost = !editing._isNew ? posts.find((p) => p.id === editing.id) : undefined;

  async function onThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const url = await uploadPlannerPhoto(supabase, userId, file, 'posts');
      setEditingField('thumb_url', url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <ModalOverlay onClose={closeEditor} maxWidth={560}>
      <div style={{ padding: '26px 30px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="rw-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: '999px', background: pl.color }} />
            {editing._isNew ? 'New post' : 'Edit post'}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-heading)', lineHeight: 1.1 }}>
            {editing.date ? fromKey(editing.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'An idea — no date yet'}
          </span>
        </div>
        <button
          onClick={closeEditor}
          style={{ width: 32, height: 32, borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--rw-dark-tortoise)', lineHeight: 1, flexShrink: 0 }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="Hook / title">
          <input
            value={editing.title}
            placeholder="the thought she only has at midnight…"
            onChange={(e) => setEditingField('title', e.target.value)}
            style={{ ...inputStyle, fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-heading)' }}
          />
        </Field>

        <Field label="Content pillar">
          <Seg options={PILLARS.map((p) => ({ id: p.id, label: p.short }))} value={editing.pillar} onPick={(v) => setEditingField('pillar', v)} colorFn={(id) => pillarOf(id).color} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Field label="Format">
            <Seg options={TYPES.map((t) => ({ id: t, label: t }))} value={editing.type} onPick={(v) => setEditingField('type', v as PostType)} />
          </Field>
          <Field label="Status">
            <Seg options={STATUSES.map((s) => ({ id: s.id, label: s.label }))} value={editing.status} onPick={(v) => setEditingField('status', v)} colorFn={(id) => statusOf(id).dot} />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
          <Field label="Date">
            <input type="date" value={editing.date || ''} onChange={(e) => setEditingField('date', e.target.value || null)} style={inputStyle} />
          </Field>
          <Field label="Time">
            <input type="time" value={editing.time || ''} onChange={(e) => setEditingField('time', e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Caption
            </label>
            <button
              type="button"
              onClick={writeCaptionForEditing}
              disabled={capLoading}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: capLoading ? 'default' : 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--rw-golden-honey)',
                opacity: capLoading ? 0.6 : 1,
                borderBottom: '1px solid color-mix(in srgb, var(--rw-golden-honey) 40%, transparent)',
                padding: '0 0 1px',
              }}
            >
              {capLoading ? 'Writing…' : 'Write with AI'}
            </button>
          </div>
          <textarea
            value={editing.caption}
            placeholder="Write it the way you’d say it to a friend…"
            onChange={(e) => setEditingField('caption', e.target.value)}
            style={{ ...inputStyle, minHeight: 96, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        <Field label="Hashtags">
          <input value={editing.hashtags} placeholder="#christianmotherhood #realtalk" onChange={(e) => setEditingField('hashtags', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Call to action / link">
          <input value={editing.cta} placeholder="Free guide in bio →" onChange={(e) => setEditingField('cta', e.target.value)} style={inputStyle} />
        </Field>

        <Field label="Photo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {editing.thumb_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={editing.thumb_url} alt="" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  border: '1px solid var(--border-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--rw-sandy-shore)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: '1.6rem',
                }}
              >
                +
              </div>
            )}
            <label
              style={{
                padding: '9px 18px',
                borderRadius: '999px',
                border: '1px solid var(--border-soft)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-body)',
              }}
            >
              {uploading ? 'Uploading…' : editing.thumb_url ? 'Replace photo' : 'Add photo'}
              <input ref={fileRef} type="file" accept="image/*" onChange={onThumb} style={{ display: 'none' }} />
            </label>
            {editing.thumb_url ? (
              <button
                onClick={() => setEditingField('thumb_url', null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8125rem' }}
              >
                Remove
              </button>
            ) : null}
          </div>
        </Field>

        {editing._isNew || !existingPost ? null : (
          <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="rw-eyebrow">Reuse this idea</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => duplicatePost(existingPost)}
                style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--rw-dark-tortoise)' }}
              >
                Duplicate
              </button>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Repurpose as</span>
              {TYPES.map((t) => {
                const tm = typeMeta(t);
                return (
                  <button
                    key={t}
                    onClick={() => duplicatePost(existingPost, t)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '7px 13px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      border: '1px solid ' + tm.accent,
                      background: tm.tint,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--rw-dark-tortoise)',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '18px 30px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => copyCaption(editing)}
            style={{ border: 'none', background: 'transparent', color: copied ? 'var(--rw-golden-honey)' : 'var(--rw-dark-tortoise)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            {copied ? 'Copied ✓' : 'Copy caption'}
          </button>
          {editing._isNew ? null : (
            <button
              onClick={() => removePost(editing.id)}
              style={{ border: 'none', background: 'transparent', color: 'var(--rw-burgundy)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500 }}
            >
              Delete
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={closeEditor}
            style={{ padding: '11px 22px', borderRadius: '999px', border: '1px solid var(--border-soft)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-body)' }}
          >
            Cancel
          </button>
          <button
            onClick={saveEditing}
            style={{ padding: '11px 26px', borderRadius: '999px', border: 'none', background: 'var(--rw-buttermilk)', color: 'var(--rw-dark-tortoise)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, boxShadow: 'var(--shadow-sunny)' }}
          >
            Save post
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
