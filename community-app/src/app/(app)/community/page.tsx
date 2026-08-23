import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { authorLabel } from "@/lib/community";

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default async function CommunityPage() {
  const user = await requireUser();
  const threads = await db.thread.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { replies: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Community</h1>
          <p className="mt-1 text-sm text-muted">
            This week&apos;s prompt: <em>What&apos;s the thing you haven&apos;t said out loud this week?</em>
          </p>
        </div>
        <Link
          href="/community/new"
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Start a thread
        </Link>
      </div>

      {threads.length === 0 ? (
        <p className="text-sm text-muted">No threads yet. Be the first to share something.</p>
      ) : (
        <ul className="space-y-3">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/community/${thread.id}`}
                className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <p className="font-serif text-lg text-foreground">{thread.prompt}</p>
                <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{thread.body}</p>
                <p className="mt-3 text-xs text-muted">
                  {authorLabel(thread, user)} · {dateFormatter.format(thread.createdAt)} ·{" "}
                  {thread._count.replies} {thread._count.replies === 1 ? "reply" : "replies"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
