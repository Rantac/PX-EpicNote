"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import type { CryptoNote } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";


const noteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty.").max(280, "Note is too long."),
});

export function CryptoNotesClient() {
  const [notes, setNotes] = useLocalStorage<CryptoNote[]>("crypto-notes", []);
  const [isClient, setIsClient] = useState(false);
  const [selectedNote, setSelectedNote] = useState<CryptoNote | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: "" },
  });
  
  const editForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        createForm.handleSubmit(onCreateSubmit)();
    }
  };

  const onCreateSubmit = (values: z.infer<typeof noteSchema>) => {
    const newNote: CryptoNote = {
      id: crypto.randomUUID(),
      content: values.content,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    createForm.reset();
  };

  const handleEditClick = (note: CryptoNote) => {
    setSelectedNote(note);
    editForm.reset({ content: note.content });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = (values: z.infer<typeof noteSchema>) => {
    if (!selectedNote) return;

    setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, content: values.content } : n));
    setIsEditDialogOpen(false);
    setSelectedNote(null);
  }

  const handleDelete = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }
  
  if (!isClient) {
      return (
          <div className="px-4">
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
    <>
    <div>
      <div className="flex flex-wrap items-end gap-4 px-4 py-3">
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex-1">
            <input
              placeholder="Quick Crypto Epic Note"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border border-input bg-background focus:border-input h-14 placeholder:text-muted-foreground p-[15px] text-base font-normal leading-normal"
              {...createForm.register("content")}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
        </form>
      </div>

      <div className="px-4">
        {notes.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <p>No Crypto Epic notes yet. Add one!</p>
          </div>
        )}
        <div className="divide-y divide-border">
            {notes.map(note => (
            <DropdownMenu key={note.id}>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-4 bg-background px-4 min-h-[72px] py-2 cursor-pointer transition-colors hover:bg-accent">
                        <div className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden w-full">
                        <p className="text-foreground text-base font-medium leading-normal truncate">{note.content}</p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal">{format(new Date(note.createdAt), 'MMMM dd, yyyy')}</p>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleEditClick(note)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDelete(note.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            ))}
        </div>
      </div>
    </div>
    
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input {...field} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border border-input bg-background focus:border-input h-14 placeholder:text-muted-foreground p-[15px] text-base font-normal leading-normal" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => setSelectedNote(null)}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
