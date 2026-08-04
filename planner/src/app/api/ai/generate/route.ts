import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { BRAND_SYSTEM_PROMPT } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI is not configured yet — add ANTHROPIC_API_KEY to the server.' }, { status: 500 });
  }

  const { pillar, format, topic, viral } = (await request.json()) as {
    pillar?: string | null;
    format?: string | null;
    topic?: string | null;
    viral?: boolean;
  };

  const parts = [
    viral
      ? 'Brainstorm 6 Instagram content ideas for Rooted With Ally built to travel far — high shareability and saves.'
      : 'Brainstorm 6 fresh Instagram content ideas for Rooted With Ally.',
    viral
      ? 'Adapt proven viral Instagram formats to this niche without losing the warm, honest voice: relatable POV Reels, "the thing no one tells you about…" hooks, carousels of hard-won truths, "tell me you\'re a burned-out mom without telling me", myth-vs-truth, before/after-of-the-heart, save-worthy list carousels, whispered-confession Reels, trending-audio-style openers. Never clickbait, never shame — shareable because it is true, not because it is loud.'
      : '',
    pillar ? `Focus every idea on the pillar: "${pillar}".` : 'Spread the ideas across the four pillars.',
    format ? `Intended format for all of them: ${format}.` : 'Vary the format across Reel, Carousel, Story, and Post.',
    topic ? `Center them on this theme the audience is thinking about: "${topic}".` : '',
    'For each idea give: a scroll-stopping hook/title in the brand voice (lowercase, lyrical, under 9 words), a full caption (2-4 short lines, in voice), 3-5 relevant hashtags, and a gentle call to action.',
    'Return ONLY a JSON array, no prose, no markdown fences. Each item: {"title":"","caption":"","hashtags":"#a #b #c","cta":"","format":"Reel|Carousel|Story|Post","pillar":"The Quiet Disappearing|Faith That Went Silent|Coming Back Without Fixing|The Real Thoughts"}.',
  ]
    .filter(Boolean)
    .join(' ');

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2000,
      system: BRAND_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: parts }],
    });
    const block = message.content.find((b) => b.type === 'text');
    let text = (block && block.type === 'text' ? block.text : '').trim();
    text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const s = text.indexOf('[');
    const e = text.lastIndexOf(']');
    if (s >= 0 && e > s) text = text.slice(s, e + 1);
    const ideas = JSON.parse(text);
    if (!Array.isArray(ideas)) throw new Error('bad shape');
    return NextResponse.json({ ideas });
  } catch {
    return NextResponse.json({ error: 'Something went sideways generating ideas. Try again in a moment.' }, { status: 502 });
  }
}
