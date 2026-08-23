import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { authorLabel } from "@/lib/community";
import { ReplyForm } from "@/components/reply-form";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const user = await requireUser();

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    include: {
      author: true,
      replies: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <article className="rounded-xl border border-border bg-surface p-5">
        <p className="font-serif text-xl text-foreground">{thread.prompt}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{thread.body}</p>
        <p className="mt-4 text-xs text-muted">
          {authorLabel(thread, user)} · {dateFormatter.format(thread.createdAt)}
        </p>
      </article>

      {thread.replies.length > 0 && (
        <ul className="space-y-3">
          {thread.replies.map((reply) => (
            <li key={reply.id} className="rounded-xl border border-border bg-surface-raised p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{reply.body}</p>
              <p className="mt-3 text-xs text-muted">
                {authorLabel(reply, user)} · {dateFormatter.format(reply.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ReplyForm threadId={thread.id} />
    </div>
  );
}
