"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "@/lib/actions/auth-actions";

function generateCode() {
  return randomBytes(4).toString("hex");
}

export async function createInviteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const note = String(formData.get("note") ?? "").trim() || null;

  await db.inviteCode.create({
    data: { code: generateCode(), note, createdById: admin.id },
  });

  revalidatePath("/admin");
  return undefined;
}

const devotionalSchema = z.object({
  title: z.string().trim().min(1, "Give it a title").max(200),
  body: z.string().trim().min(1, "Write the devotional").max(20000),
  scriptureRef: z.string().trim().min(1, "Add a scripture reference").max(200),
  scriptureText: z.string().trim().min(1, "Add the scripture text").max(4000),
  scriptureContext: z.string().trim().min(1, "Add context for the passage").max(4000),
});

export async function createDevotionalAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = devotionalSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    scriptureRef: formData.get("scriptureRef"),
    scriptureText: formData.get("scriptureText"),
    scriptureContext: formData.get("scriptureContext"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the devotional." };
  }

  await db.devotional.create({ data: parsed.data });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

const liveSessionSchema = z.object({
  title: z.string().trim().min(1, "Give it a title").max(200),
  scheduledAt: z.string().trim().min(1, "Pick a date and time"),
  link: z.string().trim().url("Enter a valid link (include https://)"),
  notes: z.string().trim().max(2000).optional(),
});

export async function createLiveSessionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = liveSessionSchema.safeParse({
    title: formData.get("title"),
    scheduledAt: formData.get("scheduledAt"),
    link: formData.get("link"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the session details." };
  }

  const scheduledAt = new Date(parsed.data.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { error: "That date and time doesn't look right." };
  }

  await db.liveSession.create({
    data: {
      title: parsed.data.title,
      scheduledAt,
      link: parsed.data.link,
      notes: parsed.data.notes ?? null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
