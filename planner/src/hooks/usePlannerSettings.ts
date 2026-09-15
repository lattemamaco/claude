'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const EMPTY_BANNER: (string | null)[] = [null, null, null, null, null];

export function usePlannerSettings(userId: string) {
  const [supabase] = useState(() => createClient());
  const [bannerPhotos, setBannerPhotos] = useState<(string | null)[]>(EMPTY_BANNER);
  const [sidebarPhoto, setSidebarPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from('planner_settings').select('*').eq('user_id', userId).maybeSingle();
      if (!active) return;
      if (data) {
        setBannerPhotos(Array.isArray(data.banner_photos) ? data.banner_photos : EMPTY_BANNER);
        setSidebarPhoto(data.sidebar_photo ?? null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [userId, supabase]);

  const setBannerSlot = useCallback(
    async (index: number, url: string | null) => {
      const next = bannerPhotos.slice();
      while (next.length < 5) next.push(null);
      next[index] = url;
      setBannerPhotos(next);
      await supabase.from('planner_settings').upsert({ user_id: userId, banner_photos: next }, { onConflict: 'user_id' });
    },
    [bannerPhotos, supabase, userId]
  );

  const setSidebarPhotoUrl = useCallback(
    async (url: string | null) => {
      setSidebarPhoto(url);
      await supabase.from('planner_settings').upsert({ user_id: userId, sidebar_photo: url }, { onConflict: 'user_id' });
    },
    [supabase, userId]
  );

  return { bannerPhotos, sidebarPhoto, loading, setBannerSlot, setSidebarPhotoUrl };
}
