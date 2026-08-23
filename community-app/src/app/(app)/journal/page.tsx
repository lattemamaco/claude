import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function JournalPage() {
  const user = await requireUser();
  const entries = await db.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Your journal</h1>
          <p className="mt-1 text-sm text-muted">Private. No one else can see this — not even the admin.</p>
        </div>
        <Link
          href="/journal/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          New entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted">Nothing here yet. Write whenever you&apos;re ready.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/journal/${entry.id}`}
                className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <p className="font-serif text-lg text-foreground">{entry.title}</p>
                <p className="mt-1 text-xs text-muted">{dateFormatter.format(entry.updatedAt)}</p>
                <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{entry.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
