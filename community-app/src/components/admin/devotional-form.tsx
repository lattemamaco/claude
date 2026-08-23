"use client";

import { useActionState } from "react";
import { createDevotionalAction } from "@/lib/actions/admin-actions";

export function DevotionalForm() {
  const [state, formAction, pending] = useActionState(createDevotionalAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="body" className="text-sm text-muted">
          Devotional
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={10}
          className="w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="scriptureRef" className="text-sm text-muted">
            Scripture reference
          </label>
          <input
            id="scriptureRef"
            name="scriptureRef"
            type="text"
            required
            placeholder="e.g. Psalm 34:18"
            className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="scriptureText" className="text-sm text-muted">
            Scripture text
          </label>
          <input
            id="scriptureText"
            name="scriptureText"
            type="text"
            required
            className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="scriptureContext" className="text-sm text-muted">
          Context for the drowning mom
        </label>
        <textarea
          id="scriptureContext"
          name="scriptureContext"
          required
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
        />
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Publish devotional"}
      </button>
    </form>
  );
}
