"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils/format";
import { addQuoteNote } from "@/lib/actions/quotes";

type Note = {
  id: string;
  note: string;
  created_at: string;
  author: { full_name: string | null } | null;
};

export function QuoteNotesPanel({ quoteId, notes }: { quoteId: string; notes: Note[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (formData: FormData) => {
    const note = String(formData.get("note") ?? "");
    startTransition(async () => {
      const result = await addQuoteNote(quoteId, note);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      formRef.current?.reset();
    });
  };

  return (
    <div className="space-y-4">
      <form ref={formRef} action={onSubmit} className="space-y-2">
        <Textarea name="note" placeholder="Add an internal note (not visible to the customer)..." rows={3} required />
        <Button type="submit" size="sm" disabled={isPending}>
          Add Note
        </Button>
      </form>

      {notes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No internal notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="border-border rounded-md border p-3 text-sm">
              <p>{note.note}</p>
              <p className="text-muted-foreground mt-1.5 text-xs">
                {note.author?.full_name ?? "Staff"} &middot; {formatDateTime(note.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
