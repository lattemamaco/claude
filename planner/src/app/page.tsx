import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PlannerApp } from '@/components/PlannerApp';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'friend';

  return <PlannerApp userId={user.id} displayName={displayName} />;
}
