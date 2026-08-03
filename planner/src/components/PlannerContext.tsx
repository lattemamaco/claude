'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { usePlannerSettings } from '@/hooks/usePlannerSettings';
import { EditingDraft, GenIdea, NewPost, PillarId, Post, PostType, StatusId, ViewId } from '@/lib/types';
import { addDays, fromKey, keyOf, startOfWeek, todayKey, uid } from '@/lib/dates';
import { WEEK_TEMPLATE, pillarByName, pillarOf } from '@/lib/constants';

interface PlannerContextValue {
  userId: string;
  displayName: string;
  posts: Post[];
  postsLoading: boolean;

  view: ViewId;
  setView: (v: ViewId) => void;
  cursor: string;
  shift: (n: number) => void;
  goToday: () => void;

  filter: PillarId | null;
  setFilter: (p: PillarId | null) => void;
  sfilter: StatusId | null;
  setSfilter: (s: StatusId | null) => void;

  hover: string | null;
  setHover: (id: string | null) => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  moveTo: (id: string, dateKey: string | null) => Promise<void>;

  editing: EditingDraft | null;
  openNew: (dateKey: string | null) => void;
  openEdit: (post: Post) => void;
  closeEditor: () => void;
  setEditingField: <K extends keyof EditingDraft>(key: K, value: EditingDraft[K]) => void;
  saveEditing: () => Promise<void>;
  removePost: (id: string) => Promise<void>;
  duplicatePost: (post: Post, newType?: PostType) => Promise<void>;

  copied: boolean;
  copyCaption: (post: { caption: string; hashtags: string }) => void;

  capLoading: boolean;
  writeCaptionForEditing: () => Promise<void>;

  planOpen: boolean;
  setPlanOpen: (v: boolean) => void;
  applyWeekTemplate: () => Promise<void>;

  genOpen: boolean;
  setGenOpen: (v: boolean) => void;
  genPillar: PillarId | '';
  setGenPillar: (v: PillarId | '') => void;
  genFormat: PostType | '';
  setGenFormat: (v: PostType | '') => void;
  genTopic: string;
  setGenTopic: (v: string) => void;
  genLoading: boolean;
  genViral: boolean;
  genResults: GenIdea[];
  genError: string | null;
  runGen: (viral: boolean) => Promise<void>;
  approveIdea: (id: string) => Promise<void>;
  dismissIdea: (id: string) => void;
  approveAll: () => Promise<void>;

  bannerPhotos: (string | null)[];
  setBannerSlot: (i: number, url: string | null) => Promise<void>;
  sidebarPhoto: string | null;
  setSidebarPhotoUrl: (url: string | null) => Promise<void>;

  postsForDay: (key: string) => Post[];
  isOverdue: (post: Pick<Post, 'date' | 'status'>) => boolean;
  stats: () => { today: number; drafted: number; scheduled: number; ideas: number; overdue: number };
}

const PlannerCtx = createContext<PlannerContextValue | null>(null);

export function usePlanner() {
  const ctx = useContext(PlannerCtx);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
}

function blankDraft(dateKey: string | null): EditingDraft {
  return {
    id: uid(),
    date: dateKey,
    time: '09:00',
    type: 'Reel',
    pillar: 'quiet',
    status: 'idea',
    title: '',
    caption: '',
    hashtags: '',
    cta: '',
    thumb_url: null,
    _isNew: true,
  };
}

export function PlannerProvider({
  userId,
  displayName,
  children,
}: {
  userId: string;
  displayName: string;
  children: React.ReactNode;
}) {
  const { posts, loading: postsLoading, createPost, updatePost, removePost: removePostRow, moveTo: moveToRow } = usePosts(userId);
  const { bannerPhotos, sidebarPhoto, setBannerSlot, setSidebarPhotoUrl } = usePlannerSettings(userId);

  const [view, setViewState] = useState<ViewId>('month');
  const [cursor, setCursor] = useState<string>(todayKey());
  const [filter, setFilter] = useState<PillarId | null>(null);
  const [sfilter, setSfilter] = useState<StatusId | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingDraft | null>(null);
  const [copied, setCopied] = useState(false);
  const [capLoading, setCapLoading] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  const [genOpen, setGenOpen] = useState(false);
  const [genPillar, setGenPillar] = useState<PillarId | ''>('');
  const [genFormat, setGenFormat] = useState<PostType | ''>('');
  const [genTopic, setGenTopic] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [genViral, setGenViral] = useState(false);
  const [genResults, setGenResults] = useState<GenIdea[]>([]);
  const [genError, setGenError] = useState<string | null>(null);

  const setView = useCallback((v: ViewId) => setViewState(v), []);

  const shift = useCallback(
    (n: number) => {
      const d = fromKey(cursor);
      let nd: Date;
      if (view === 'month') nd = new Date(d.getFullYear(), d.getMonth() + n, 1, 12);
      else if (view === 'week') nd = addDays(d, n * 7);
      else nd = addDays(d, n);
      setCursor(keyOf(nd));
    },
    [cursor, view]
  );

  const goToday = useCallback(() => setCursor(todayKey()), []);

  const moveTo = useCallback(
    async (id: string, dateKey: string | null) => {
      setDragId(null);
      await moveToRow(id, dateKey);
    },
    [moveToRow]
  );

  const openNew = useCallback((dateKey: string | null) => setEditing(blankDraft(dateKey)), []);
  const openEdit = useCallback((post: Post) => setEditing({ ...post, _isNew: false }), []);
  const closeEditor = useCallback(() => setEditing(null), []);

  const setEditingField = useCallback(<K extends keyof EditingDraft>(key: K, value: EditingDraft[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const saveEditing = useCallback(async () => {
    if (!editing) return;
    const { id, _isNew, ...rest } = editing;
    if (_isNew) {
      await createPost(rest);
    } else {
      await updatePost(id, rest);
    }
    setEditing(null);
  }, [editing, createPost, updatePost]);

  const removePost = useCallback(
    async (id: string) => {
      await removePostRow(id);
      setEditing(null);
    },
    [removePostRow]
  );

  const duplicatePost = useCallback(
    async (post: Post, newType?: PostType) => {
      const copy: NewPost = {
        date: post.date,
        time: post.time,
        type: newType || post.type,
        pillar: post.pillar,
        status: 'idea',
        title: post.title,
        caption: post.caption,
        hashtags: post.hashtags,
        cta: post.cta,
        thumb_url: post.thumb_url,
      };
      const row = await createPost(copy);
      setEditing({ ...row, _isNew: false });
      setCopied(false);
    },
    [createPost]
  );

  const copyCaption = useCallback((post: { caption: string; hashtags: string }) => {
    const txt = [post.caption, post.hashtags].filter((x) => x && String(x).trim()).join('\n\n');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, []);

  const writeCaptionForEditing = useCallback(async () => {
    if (!editing || capLoading) return;
    setCapLoading(true);
    try {
      const pillar = pillarOf(editing.pillar);
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: editing.type, pillarName: pillar.name, title: editing.title, cta: editing.cta }),
      });
      const data = await res.json();
      if (data.caption) setEditingField('caption', data.caption);
    } finally {
      setCapLoading(false);
    }
  }, [editing, capLoading, setEditingField]);

  const applyWeekTemplate = useCallback(async () => {
    const start = startOfWeek(fromKey(cursor));
    await Promise.all(
      WEEK_TEMPLATE.map((t, i) =>
        createPost({
          date: keyOf(addDays(start, i)),
          time: '09:00',
          type: t.type,
          pillar: t.pillar,
          status: 'idea',
          title: t.title,
          caption: '',
          hashtags: '',
          cta: '',
          thumb_url: null,
        })
      )
    );
    setPlanOpen(false);
  }, [cursor, createPost]);

  const runGen = useCallback(
    async (viral: boolean) => {
      if (genLoading) return;
      setGenLoading(true);
      setGenError(null);
      setGenResults([]);
      setGenViral(viral);
      try {
        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pillar: genPillar ? pillarOf(genPillar).name : null,
            format: genFormat || null,
            topic: genTopic.trim(),
            viral,
          }),
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data.ideas)) throw new Error(data.error || 'bad shape');
        const results: GenIdea[] = data.ideas
          .map((o: { title?: string; caption?: string; hashtags?: string; cta?: string; format?: string; pillar?: string }) => ({
            _id: uid(),
            _state: 'pending' as const,
            title: String(o.title || '').trim(),
            caption: String(o.caption || '').trim(),
            hashtags: String(o.hashtags || '').trim(),
            cta: String(o.cta || '').trim(),
            type: (['Reel', 'Carousel', 'Story', 'Post'].includes(o.format || '') ? o.format : genFormat || 'Reel') as PostType,
            pillar: pillarByName(o.pillar) || genPillar || 'real',
          }))
          .filter((r: GenIdea) => r.title);
        setGenResults(results);
        if (!results.length) setGenError('No ideas came back — try again.');
      } catch {
        setGenError('Something went sideways generating ideas. Try again in a moment.');
      } finally {
        setGenLoading(false);
      }
    },
    [genLoading, genPillar, genFormat, genTopic]
  );

  const approveIdea = useCallback(
    async (id: string) => {
      const r = genResults.find((x) => x._id === id);
      if (!r) return;
      await createPost({
        date: null,
        time: '09:00',
        type: r.type,
        pillar: r.pillar,
        status: 'idea',
        title: r.title,
        caption: r.caption,
        hashtags: r.hashtags,
        cta: r.cta,
        thumb_url: null,
      });
      setGenResults((prev) => prev.map((x) => (x._id === id ? { ...x, _state: 'approved' } : x)));
    },
    [genResults, createPost]
  );

  const dismissIdea = useCallback((id: string) => {
    setGenResults((prev) => prev.map((x) => (x._id === id ? { ...x, _state: 'dismissed' } : x)));
  }, []);

  const approveAll = useCallback(async () => {
    const pending = genResults.filter((x) => x._state === 'pending');
    if (!pending.length) return;
    await Promise.all(
      pending.map((r) =>
        createPost({
          date: null,
          time: '09:00',
          type: r.type,
          pillar: r.pillar,
          status: 'idea',
          title: r.title,
          caption: r.caption,
          hashtags: r.hashtags,
          cta: r.cta,
          thumb_url: null,
        })
      )
    );
    setGenResults((prev) => prev.map((x) => (x._state === 'pending' ? { ...x, _state: 'approved' } : x)));
  }, [genResults, createPost]);

  const isOverdue = useCallback((post: Pick<Post, 'date' | 'status'>) => {
    return !!post.date && post.date < todayKey() && post.status !== 'posted';
  }, []);

  const postsForDay = useCallback(
    (key: string) => {
      let list = posts.filter((p) => p.date === key);
      if (filter) list = list.filter((p) => p.pillar === filter);
      if (sfilter) list = list.filter((p) => p.status === sfilter);
      return list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    },
    [posts, filter, sfilter]
  );

  const stats = useCallback(() => {
    const t = todayKey();
    return {
      today: posts.filter((p) => p.date === t).length,
      drafted: posts.filter((p) => p.status === 'drafted').length,
      scheduled: posts.filter((p) => p.status === 'scheduled').length,
      ideas: posts.filter((p) => !p.date).length,
      overdue: posts.filter((p) => isOverdue(p)).length,
    };
  }, [posts, isOverdue]);

  const value = useMemo<PlannerContextValue>(
    () => ({
      userId,
      displayName,
      posts,
      postsLoading,
      view,
      setView,
      cursor,
      shift,
      goToday,
      filter,
      setFilter,
      sfilter,
      setSfilter,
      hover,
      setHover,
      dragId,
      setDragId,
      moveTo,
      editing,
      openNew,
      openEdit,
      closeEditor,
      setEditingField,
      saveEditing,
      removePost,
      duplicatePost,
      copied,
      copyCaption,
      capLoading,
      writeCaptionForEditing,
      planOpen,
      setPlanOpen,
      applyWeekTemplate,
      genOpen,
      setGenOpen,
      genPillar,
      setGenPillar,
      genFormat,
      setGenFormat,
      genTopic,
      setGenTopic,
      genLoading,
      genViral,
      genResults,
      genError,
      runGen,
      approveIdea,
      dismissIdea,
      approveAll,
      bannerPhotos,
      setBannerSlot,
      sidebarPhoto,
      setSidebarPhotoUrl,
      postsForDay,
      isOverdue,
      stats,
    }),
    [
      userId,
      displayName,
      posts,
      postsLoading,
      view,
      setView,
      cursor,
      shift,
      goToday,
      filter,
      sfilter,
      hover,
      dragId,
      moveTo,
      editing,
      openNew,
      openEdit,
      closeEditor,
      setEditingField,
      saveEditing,
      removePost,
      duplicatePost,
      copied,
      copyCaption,
      capLoading,
      writeCaptionForEditing,
      planOpen,
      applyWeekTemplate,
      genOpen,
      genPillar,
      genFormat,
      genTopic,
      genLoading,
      genViral,
      genResults,
      genError,
      runGen,
      approveIdea,
      dismissIdea,
      approveAll,
      bannerPhotos,
      setBannerSlot,
      sidebarPhoto,
      setSidebarPhotoUrl,
      postsForDay,
      isOverdue,
      stats,
    ]
  );

  return <PlannerCtx.Provider value={value}>{children}</PlannerCtx.Provider>;
}
