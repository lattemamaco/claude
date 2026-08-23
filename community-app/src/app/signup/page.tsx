"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth-actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl text-foreground">You&apos;re invited</p>
          <p className="mt-2 text-sm text-muted">
            This space is private. No performance required — come as you are.
          </p>
        </div>

        <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <div className="space-y-1">
            <label htmlFor="inviteCode" className="text-sm text-muted">
              Invite code
            </label>
            <input
              id="inviteCode"
              name="inviteCode"
              type="text"
              required
              className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="displayName" className="text-sm text-muted">
              What should we call you?
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              placeholder="First name, initials, or anything you like"
              className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <p className="text-xs text-muted">At least 8 characters.</p>
          </div>

          {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Joining…" : "Join"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
