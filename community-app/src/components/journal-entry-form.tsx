"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth-actions";

export function JournalEntryForm({
  action,
  entryId,
  initialTitle = "",
  initialBody = "",
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  entryId?: string;
  initialTitle?: string;
  initialBody?: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {entryId && <input type="hidden" name="id" value={entryId} />}
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialTitle}
          className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="body" className="text-sm text-muted">
          What&apos;s on your mind?
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={12}
          defaultValue={initialBody}
          className="w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
        />
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
