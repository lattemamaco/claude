"use client";

import { useActionState } from "react";
import { createReplyAction } from "@/lib/actions/community-actions";

export function ReplyForm({ threadId }: { threadId: string }) {
  const [state, formAction, pending] = useActionState(createReplyAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-surface p-5">
      <input type="hidden" name="threadId" value={threadId} />
      <textarea
        name="body"
        required
        rows={4}
        placeholder="Add your reply…"
        className="w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="isAnonymous" className="h-4 w-4 rounded border-border accent-accent" />
          Reply anonymously
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Posting…" : "Reply"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
