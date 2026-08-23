"use client";

import { useActionState } from "react";
import { createInviteAction } from "@/lib/actions/admin-actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState(createInviteAction, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 space-y-1">
        <label htmlFor="note" className="text-sm text-muted">
          Note (optional — who this is for)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="e.g. Maya"
          className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Generating…" : "Generate invite"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
