'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { authShellStyle, authCardStyle, fieldLabelStyle, inputStyle, primaryButtonStyle } from '@/lib/authStyles';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/');
    router.refresh();
  }

  return (
    <div style={authShellStyle}>
      <div style={authCardStyle}>
        <span className="rw-eyebrow">The Content Planner</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.9rem', color: 'var(--rw-golden-honey)', margin: '8px 0 4px', lineHeight: 1.1 }}>
          welcome back
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--text-body)', margin: '0 0 26px', lineHeight: 1.6 }}>
          Little by little. Sign in to keep planning.
        </p>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={fieldLabelStyle}>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label style={fieldLabelStyle}>
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>
          {error ? <p style={{ color: 'var(--rw-burgundy)', fontSize: '0.8125rem', margin: 0 }}>{error}</p> : null}
          <button type="submit" disabled={loading} style={primaryButtonStyle}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ marginTop: 20, fontFamily: 'var(--font-body)', fontSize: '0.8438rem', color: 'var(--text-muted)' }}>
          New here? <Link href="/signup" style={{ color: 'var(--rw-golden-honey)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
