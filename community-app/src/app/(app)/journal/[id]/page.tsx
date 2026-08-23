import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { JournalEntryForm } from "@/components/journal-entry-form";
import { updateJournalEntryAction, deleteJournalEntryAction } from "@/lib/actions/journal-actions";

export default async function EditJournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const entry = await db.journalEntry.findFirst({ where: { id, userId: user.id } });

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-foreground">Edit entry</h1>
      <JournalEntryForm
        action={updateJournalEntryAction}
        entryId={entry.id}
        initialTitle={entry.title}
        initialBody={entry.body}
        submitLabel="Save changes"
      />

      <form action={deleteJournalEntryAction} className="pt-4">
        <input type="hidden" name="id" value={entry.id} />
        <button type="submit" className="text-sm text-red-700 underline-offset-2 hover:underline">
          Delete this entry
        </button>
      </form>
    </div>
  );
}
