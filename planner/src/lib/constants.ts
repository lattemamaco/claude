import { Pillar, PostType, Status, TypeMeta, PillarId } from './types';

export const PILLARS: Pillar[] = [
  { id: 'quiet', name: 'The Quiet Disappearing', short: 'Quiet Disappearing', color: '#C9B48F', tint: '#EFE7D3' },
  { id: 'faith', name: 'Faith That Went Silent', short: 'Faith Went Silent', color: '#8FBBD1', tint: '#DCEAF1' },
  { id: 'coming', name: 'Coming Back Without Fixing', short: 'Coming Back', color: '#E4C24E', tint: '#FDF6D3' },
  { id: 'real', name: 'The Real Thoughts', short: 'Real Thoughts', color: '#BA8C5A', tint: '#EEE0CD' },
];

export function pillarOf(id: PillarId | string | null | undefined): Pillar {
  return PILLARS.find((p) => p.id === id) || PILLARS[0];
}

export function pillarByName(name: string | null | undefined): PillarId | null {
  const match = PILLARS.find((p) => p.name.toLowerCase() === String(name || '').toLowerCase());
  return match ? match.id : null;
}

export const TYPES: PostType[] = ['Reel', 'Carousel', 'Story', 'Post'];

export const TYPE_META: Record<PostType, TypeMeta> = {
  Reel: { tint: '#C1DBE8', accent: '#7FA9BE' },
  Carousel: { tint: '#CBD69C', accent: '#7E9038' },
  Story: { tint: '#FFD3AA', accent: '#E8944A' },
  Post: { tint: '#FFF1C4', accent: '#E6C862' },
};

export function typeMeta(t: PostType): TypeMeta {
  return TYPE_META[t] || { tint: 'var(--rw-cream-deep)', accent: 'var(--rw-golden-honey)' };
}

export const STATUSES: Status[] = [
  { id: 'idea', label: 'Idea', dot: '#C9B48F' },
  { id: 'drafted', label: 'Drafted', dot: '#E4C24E' },
  { id: 'scheduled', label: 'Scheduled', dot: '#8FBBD1' },
  { id: 'posted', label: 'Posted', dot: '#3C2A1C' },
];

export function statusOf(id: string | null | undefined): Status {
  return STATUSES.find((s) => s.id === id) || STATUSES[0];
}

export const WEEK_TEMPLATE: { type: PostType; pillar: PillarId; title: string }[] = [
  { type: 'Reel', pillar: 'real', title: 'The thought I was too scared to say' },
  { type: 'Carousel', pillar: 'coming', title: 'Coming back in 15 minutes' },
  { type: 'Story', pillar: 'faith', title: 'A whispered prayer' },
  { type: 'Post', pillar: 'quiet', title: 'You didn’t lose yourself' },
  { type: 'Reel', pillar: 'faith', title: 'God didn’t leave when you went quiet' },
  { type: 'Carousel', pillar: 'real', title: 'The unspeakable, named' },
  { type: 'Story', pillar: 'coming', title: 'One gentle word for today' },
];

export const BRAND_SYSTEM_PROMPT =
  'You write for "Rooted With Ally", a warm, honest, faith-led Instagram creator helping burned-out Christian moms find themselves again. ' +
  'Voice: warm, gentle, honest, encouraging — a trusted mom-friend who has been in the hard season, never preachy, never a guru, never hype or hustle. ' +
  'Faith is woven in naturally, the way it lives in a real day. Speak to "you" directly; the author is "I"/Ally and shares her own mess ("me too"). ' +
  'Short lines, soft affirmations, present-tense verbs of growth. Em-dashes for honest asides. No emoji. No exclamation-storms, no toxic positivity, no guilt/shame framing. ' +
  'The four content pillars are: The Quiet Disappearing (losing yourself in motherhood), Faith That Went Silent (faith under exhaustion), Coming Back Without Fixing (small returns to yourself, not tidy fixes), The Real Thoughts (the honest midnight thoughts said out loud).';

export const AUDIENCE_BLURB =
  'Burned-out Christian moms in the hard, holy mess — quietly coming back to themselves.';
