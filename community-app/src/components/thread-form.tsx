"use client";

import { useActionState } from "react";
import { createThreadAction } from "@/lib/actions/community-actions";

export function ThreadForm() {
  const [state, formAction, pending] = useActionState(createThreadAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="space-y-1">
        <label htmlFor="prompt" className="text-sm text-muted">
          Prompt or title
        </label>
        <input
          id="prompt"
          name="prompt"
          type="text"
          required
          placeholder="What's the thing you haven't said out loud this week?"
          className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="body" className="text-sm text-muted">
          Your post
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          className="w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="isAnonymous" className="h-4 w-4 rounded border-border accent-accent" />
        Post anonymously
      </label>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
