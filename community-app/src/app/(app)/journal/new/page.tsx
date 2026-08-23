import { JournalEntryForm } from "@/components/journal-entry-form";
import { createJournalEntryAction } from "@/lib/actions/journal-actions";

export default function NewJournalEntryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-foreground">New entry</h1>
      <JournalEntryForm action={createJournalEntryAction} submitLabel="Save entry" />
    </div>
  );
}
