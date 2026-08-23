"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/lib/actions/auth-actions";

const threadSchema = z.object({
  prompt: z.string().trim().min(1, "Give your thread a prompt or title").max(200),
  body: z.string().trim().min(1, "Say a little more").max(10000),
  isAnonymous: z.literal("on").optional(),
});

export async function createThreadAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const parsed = threadSchema.safeParse({
    prompt: formData.get("prompt"),
    body: formData.get("body"),
    isAnonymous: formData.get("isAnonymous") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your post." };
  }

  const thread = await db.thread.create({
    data: {
      prompt: parsed.data.prompt,
      body: parsed.data.body,
      isAnonymous: Boolean(parsed.data.isAnonymous),
      authorId: user.id,
    },
  });

  revalidatePath("/community");
  redirect(`/community/${thread.id}`);
}

const replySchema = z.object({
  body: z.string().trim().min(1, "Write something first").max(10000),
  isAnonymous: z.literal("on").optional(),
});

export async function createReplyAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const threadId = String(formData.get("threadId"));

  const parsed = replySchema.safeParse({
    body: formData.get("body"),
    isAnonymous: formData.get("isAnonymous") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your reply." };
  }

  const thread = await db.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return { error: "That thread no longer exists." };
  }

  await db.reply.create({
    data: {
      threadId,
      body: parsed.data.body,
      isAnonymous: Boolean(parsed.data.isAnonymous),
      authorId: user.id,
    },
  });

  revalidatePath(`/community/${threadId}`);
  redirect(`/community/${threadId}`);
}
