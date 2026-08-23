import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { InviteForm } from "@/components/admin/invite-form";
import { DevotionalForm } from "@/components/admin/devotional-form";
import { LiveSessionForm } from "@/components/admin/live-session-form";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const [invites, devotionals, liveSessions] = await Promise.all([
    db.inviteCode.findMany({ orderBy: { createdAt: "desc" }, take: 15 }),
    db.devotional.findMany({ orderBy: { publishedAt: "desc" }, take: 5 }),
    db.liveSession.findMany({ orderBy: { scheduledAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="space-y-12">
      <h1 className="font-serif text-2xl text-foreground">Admin</h1>

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-foreground">Invite someone</h2>
        <div className="rounded-xl border border-border bg-surface p-5">
          <InviteForm />
        </div>
        {invites.length > 0 && (
          <ul className="space-y-2 text-sm">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2"
              >
                <span className="font-mono text-foreground">{invite.code}</span>
                <span className="text-muted">{invite.note ?? "—"}</span>
                <span className={invite.usedAt ? "text-muted" : "text-accent"}>
                  {invite.usedAt ? `Used by ${invite.usedByEmail}` : "Unused"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-foreground">Post this week&apos;s devotional</h2>
        <div className="rounded-xl border border-border bg-surface p-5">
          <DevotionalForm />
        </div>
        {devotionals.length > 0 && (
          <ul className="space-y-1 text-sm text-muted">
            {devotionals.map((d) => (
              <li key={d.id}>
                {dateFormatter.format(d.publishedAt)} — {d.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-foreground">Schedule the live check-in</h2>
        <div className="rounded-xl border border-border bg-surface p-5">
          <LiveSessionForm />
        </div>
        {liveSessions.length > 0 && (
          <ul className="space-y-1 text-sm text-muted">
            {liveSessions.map((s) => (
              <li key={s.id}>
                {dateFormatter.format(s.scheduledAt)} — {s.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
