"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import type { EpicNote } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const noteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty.").max(280, "Note is too long."),
});

export function EpicNotesClient() {
  const [notes, setNotes] = useLocalStorage<EpicNote[]>("epic-notes", []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = (values: z.infer<typeof noteSchema>) => {
    const newNote: EpicNote = {
      id: crypto.randomUUID(),
      content: values.content,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    form.reset();
  };
  
  if (!isClient) {
      return (
          <div className="px-4 max-w-[480px] mx-auto">
              <Skeleton className="h-14 w-full mb-3" />
              <div className="space-y-2">
                  <Skeleton className="h-[72px] w-full" />
                  <Skeleton className="h-[72px] w-full" />
                  <Skeleton className="h-[72px] w-full" />
              </div>
          </div>
      )
  }

  return (
    <div>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <input
              placeholder="Quick Fill Note"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111714] focus:outline-0 focus:ring-0 border border-[#dce5df] bg-white focus:border-[#dce5df] h-14 placeholder:text-[#648771] p-[15px] text-base font-normal leading-normal"
              {...form.register("content")}
              autoComplete="off"
            />
        </form>
      </div>

      <div className="max-w-[480px] mx-auto">
        {notes.length === 0 && (
          <div className="text-center py-10 text-[#648771]">
            <p>No epic notes yet. Add one!</p>
          </div>
        )}
        {notes.map(note => (
          <div key={note.id} className="flex items-center bg-white px-4 min-h-[72px] py-2 border-b border-[#f0f4f2]">
            <div className="flex flex-col justify-center overflow-hidden">
              <p className="text-[#111714] text-base font-medium leading-normal truncate">{note.content}</p>
              <p className="text-[#648771] text-sm font-normal leading-normal">{format(new Date(note.createdAt), 'yyyy-MM-dd')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
