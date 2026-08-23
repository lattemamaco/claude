"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/lib/actions/auth-actions";

const entrySchema = z.object({
  title: z.string().trim().min(1, "Give it a title").max(120),
  body: z.string().trim().min(1, "Write something first").max(20000),
});

export async function createJournalEntryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const parsed = entrySchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your entry." };
  }

  await db.journalEntry.create({
    data: { userId: user.id, title: parsed.data.title, body: parsed.data.body },
  });

  revalidatePath("/journal");
  redirect("/journal");
}

export async function updateJournalEntryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id"));

  const parsed = entrySchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your entry." };
  }

  const entry = await db.journalEntry.findFirst({ where: { id, userId: user.id } });
  if (!entry) {
    return { error: "That entry couldn't be found." };
  }

  await db.journalEntry.update({
    where: { id },
    data: { title: parsed.data.title, body: parsed.data.body },
  });

  revalidatePath("/journal");
  redirect("/journal");
}

export async function deleteJournalEntryAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));

  await db.journalEntry.deleteMany({ where: { id, userId: user.id } });

  revalidatePath("/journal");
  redirect("/journal");
}
