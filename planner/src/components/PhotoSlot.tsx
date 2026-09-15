'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadPlannerPhoto } from '@/lib/storage';

export function PhotoSlot({
  userId,
  folder,
  url,
  placeholder,
  style,
  onChange,
}: {
  userId: string;
  folder: string;
  url: string | null;
  placeholder: string;
  style?: React.CSSProperties;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const publicUrl = await uploadPlannerPhoto(supabase, userId, file, folder);
      onChange(publicUrl);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'var(--rw-cream-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      title="Click to replace photo"
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={placeholder} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '0 10px',
          }}
        >
          {busy ? 'uploading…' : `+ ${placeholder}`}
        </span>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }} />
    </div>
  );
}
