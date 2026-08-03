'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { authShellStyle, authCardStyle, fieldLabelStyle, inputStyle, primaryButtonStyle } from '@/lib/authStyles';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.replace('/');
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  return (
    <div style={authShellStyle}>
      <div style={authCardStyle}>
        <span className="rw-eyebrow">The Content Planner</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.9rem', color: 'var(--rw-golden-honey)', margin: '8px 0 4px', lineHeight: 1.1 }}>
          little by little
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--text-body)', margin: '0 0 26px', lineHeight: 1.6 }}>
          Create your account to start planning.
        </p>
        {checkEmail ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            Almost there — check <strong>{email}</strong> for a confirmation link, then sign in.
          </p>
        ) : (
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
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </label>
            {error ? <p style={{ color: 'var(--rw-burgundy)', fontSize: '0.8125rem', margin: 0 }}>{error}</p> : null}
            <button type="submit" disabled={loading} style={primaryButtonStyle}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}
        <p style={{ marginTop: 20, fontFamily: 'var(--font-body)', fontSize: '0.8438rem', color: 'var(--text-muted)' }}>
          Already planning with us? <Link href="/login" style={{ color: 'var(--rw-golden-honey)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
