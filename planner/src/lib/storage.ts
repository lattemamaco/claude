import type { SupabaseClient } from '@supabase/supabase-js';

export async function uploadPlannerPhoto(
  supabase: SupabaseClient,
  userId: string,
  file: File,
  folder: string
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('planner-photos').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('planner-photos').getPublicUrl(path);
  return data.publicUrl;
}
