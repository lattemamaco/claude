'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();

  async function onClick() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'var(--text-muted)',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
        padding: 0,
      }}
    >
      Sign out
    </button>
  );
}
