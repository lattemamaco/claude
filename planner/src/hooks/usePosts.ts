'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Post, NewPost } from '@/lib/types';

export function usePosts(userId: string) {
  const [supabase] = useState(() => createClient());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (active) {
        if (!error && data) setPosts(data as Post[]);
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel(`posts-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: `user_id=eq.${userId}` },
        (payload) => {
          setPosts((prev) => {
            if (payload.eventType === 'INSERT') {
              const row = payload.new as Post;
              if (prev.some((p) => p.id === row.id)) return prev;
              return [...prev, row];
            }
            if (payload.eventType === 'UPDATE') {
              const row = payload.new as Post;
              return prev.map((p) => (p.id === row.id ? row : p));
            }
            if (payload.eventType === 'DELETE') {
              const row = payload.old as Post;
              return prev.filter((p) => p.id !== row.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const createPost = useCallback(
    async (data: NewPost) => {
      const { data: row, error } = await supabase
        .from('posts')
        .insert({ ...data, user_id: userId })
        .select()
        .single();
      if (error || !row) throw error;
      setPosts((prev) => (prev.some((p) => p.id === row.id) ? prev : [...prev, row as Post]));
      return row as Post;
    },
    [supabase, userId]
  );

  const updatePost = useCallback(
    async (id: string, patch: Partial<NewPost>) => {
      const { data: row, error } = await supabase.from('posts').update(patch).eq('id', id).select().single();
      if (error) throw error;
      if (row) setPosts((prev) => prev.map((p) => (p.id === id ? (row as Post) : p)));
    },
    [supabase]
  );

  const removePost = useCallback(
    async (id: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    [supabase]
  );

  const moveTo = useCallback(
    async (id: string, dateKey: string | null) => {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, date: dateKey } : p)));
      await updatePost(id, { date: dateKey });
    },
    [updatePost]
  );

  return { posts, loading, createPost, updatePost, removePost, moveTo };
}
