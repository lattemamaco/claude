"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";

export type ActionState = { error?: string } | undefined;

const signupSchema = z.object({
  inviteCode: z.string().trim().min(1, "Invite code is required"),
  displayName: z.string().trim().min(1, "Please enter a name or how you'd like to be known").max(60),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    inviteCode: formData.get("inviteCode"),
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { inviteCode, displayName, email, password } = parsed.data;

  const invite = await db.inviteCode.findUnique({ where: { code: inviteCode } });
  if (!invite || invite.usedAt) {
    return { error: "That invite code isn't valid. Please check with the person who invited you." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }

  const passwordHash = await hashPassword(password);

  const user = await db.$transaction(async (tx) => {
    const stillOpen = await tx.inviteCode.findUnique({ where: { id: invite.id } });
    if (!stillOpen || stillOpen.usedAt) {
      throw new Error("INVITE_TAKEN");
    }
    const created = await tx.user.create({
      data: { email, displayName, passwordHash, role: "MEMBER" },
    });
    await tx.inviteCode.update({
      where: { id: invite.id },
      data: { usedAt: new Date(), usedByEmail: email },
    });
    return created;
  }).catch((err) => {
    if (err instanceof Error && err.message === "INVITE_TAKEN") return null;
    throw err;
  });

  if (!user) {
    return { error: "That invite code was just used. Please ask for a new one." };
  }

  await createSession(user.id);
  redirect("/");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email and password don't match." };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
