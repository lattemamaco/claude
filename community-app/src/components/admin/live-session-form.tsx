"use client";

import { useActionState } from "react";
import { createLiveSessionAction } from "@/lib/actions/admin-actions";

export function LiveSessionForm() {
  const [state, formAction, pending] = useActionState(createLiveSessionAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="ls-title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="ls-title"
          name="title"
          type="text"
          required
          defaultValue="Monthly prayer & check-in"
          className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="scheduledAt" className="text-sm text-muted">
            Date &amp; time
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="link" className="text-sm text-muted">
            Join link
          </label>
          <input
            id="link"
            name="link"
            type="url"
            required
            placeholder="https://zoom.us/j/..."
            className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="notes" className="text-sm text-muted">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
        />
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Scheduling…" : "Schedule session"}
      </button>
    </form>
  );
}
