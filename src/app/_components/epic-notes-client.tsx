"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import type { EpicNote } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

const noteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty.").max(280, "Note is too long."),
});

export function EpicNotesClient() {
  const [notes, setNotes, isHydrated] = useLocalStorage<EpicNote[]>("epic-notes", []);

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

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  if (!isHydrated) {
    return (
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="What's on your mind?" {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
                <p className="text-muted-foreground">No epic notes yet. Add one!</p>
            </CardContent>
          </Card>
        ) : (
          notes.map(note => (
            <Card key={note.id} className="group relative transition-all duration-300 ease-in-out hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <p className="text-foreground pr-10">{note.content}</p>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteNote(note.id)}>
                   <X className="h-4 w-4" />
                   <span className="sr-only">Delete note</span>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
