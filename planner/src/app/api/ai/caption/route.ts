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

  const { type, pillarName, title, cta } = (await request.json()) as {
    type: string;
    pillarName: string;
    title?: string;
    cta?: string;
  };

  const prompt =
    `Write one Instagram caption for a ${type} in the "${pillarName}" pillar` +
    (title ? `, for the hook: "${title}"` : '') +
    '. 2-4 short lines in the brand voice, honest and warm. ' +
    (cta ? `End with this call to action woven in naturally: "${cta}". ` : '') +
    'Return ONLY the caption text — no hashtags, no quotes, no preamble.';

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 400,
      system: BRAND_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    const block = message.content.find((b) => b.type === 'text');
    const caption = (block && block.type === 'text' ? block.text : '').trim().replace(/^["“]|["”]$/g, '').trim();
    return NextResponse.json({ caption });
  } catch {
    return NextResponse.json({ error: 'Could not write a caption just now.' }, { status: 502 });
  }
}
