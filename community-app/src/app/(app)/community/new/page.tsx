import { ThreadForm } from "@/components/thread-form";

export default function NewThreadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground">Start a thread</h1>
        <p className="mt-1 text-sm text-muted">
          Say it plainly, or post anonymously if that&apos;s easier today.
        </p>
      </div>
      <ThreadForm />
    </div>
  );
}
