import Link from "next/link";
import { db } from "@/lib/db";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export default async function DashboardPage() {
  const [devotional, liveSession] = await Promise.all([
    db.devotional.findFirst({ orderBy: { publishedAt: "desc" } }),
    db.liveSession.findFirst({
      where: { scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      {liveSession && (
        <section className="rounded-xl border border-accent-light bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-accent">Next live check-in</p>
          <p className="mt-1 font-serif text-lg text-foreground">{liveSession.title}</p>
          <p className="mt-1 text-sm text-muted">
            {dateFormatter.format(liveSession.scheduledAt)} · {timeFormatter.format(liveSession.scheduledAt)}
          </p>
          {liveSession.notes && <p className="mt-2 text-sm text-muted">{liveSession.notes}</p>}
          <a
            href={liveSession.link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Join link
          </a>
        </section>
      )}

      {devotional ? (
        <section className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">This week&apos;s devotional</p>
            <h1 className="mt-1 font-serif text-2xl text-foreground">{devotional.title}</h1>
          </div>

          <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
            {devotional.body}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-accent">{devotional.scriptureRef}</p>
            <p className="mt-2 font-serif text-lg leading-relaxed text-foreground">
              &ldquo;{devotional.scriptureText}&rdquo;
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{devotional.scriptureContext}</p>
          </div>
        </section>
      ) : (
        <p className="text-sm text-muted">Nothing&apos;s been posted yet. Check back soon.</p>
      )}

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/journal"
          className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
        >
          <p className="font-serif text-lg text-foreground">Your journal</p>
          <p className="mt-1 text-sm text-muted">A private place, just for you.</p>
        </Link>
        <Link
          href="/community"
          className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
        >
          <p className="font-serif text-lg text-foreground">Community threads</p>
          <p className="mt-1 text-sm text-muted">Say what&apos;s true, anonymously if you need to.</p>
        </Link>
      </section>
    </div>
  );
}
