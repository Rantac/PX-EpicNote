"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AnalysisNote } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const analysisSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters.").max(1000),
});

export function AnalysisNotesClient() {
  const [notes, setNotes] = useLocalStorage<AnalysisNote[]>("analysis-notes", []);
  const [isClient, setIsClient] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<AnalysisNote | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const addForm = useForm<z.infer<typeof analysisSchema>>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { summary: "" },
  });

  const editForm = useForm<z.infer<typeof analysisSchema>>({
    resolver: zodResolver(analysisSchema),
  });

  const onAddSubmit = (values: z.infer<typeof analysisSchema>) => {
    const newNote: AnalysisNote = {
      id: crypto.randomUUID(),
      summary: values.summary,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    addForm.reset();
    setIsAddDialogOpen(false);
  };
  
  const handleEditClick = (note: AnalysisNote) => {
    setSelectedNote(note);
    editForm.reset({ summary: note.summary });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = (values: z.infer<typeof analysisSchema>) => {
    if (!selectedNote) return;

    setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, summary: values.summary } : n));
    setIsEditDialogOpen(false);
    setSelectedNote(null);
  }

  const handleDelete = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }

  if (!isClient) {
    return (
        <div className="px-4 max-w-[480px] mx-auto">
            <Skeleton className="h-14 w-full my-3" />
            <div className="space-y-2">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
        </div>
    );
  }

  return (
    <>
      <div className="max-w-[480px] mx-auto px-4 py-3">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 rounded-xl text-base font-bold">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>New Week Summary</DialogTitle>
              <DialogDescription>
                Reflect on the past week.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
                <FormField
                  control={addForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Week Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What were the key events and learnings?" {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Save Analysis</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <div className="mt-4">
          {notes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No analysis notes yet. Add your first one!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map(note => (
                <DropdownMenu key={note.id}>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-start gap-4 bg-background px-4 py-3 border border-border rounded-xl cursor-pointer transition-colors hover:bg-accent">
                      <div className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12 mt-1">
                        <FileText size={24} />
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden w-full">
                        <h3 className="text-foreground text-base font-bold leading-normal">Week Summary</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{note.summary}</p>
                        <p className="text-xs text-muted-foreground mt-2">{format(new Date(note.createdAt), 'dd-MM-yyyy EEEE')}</p>
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
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Week Summary</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={editForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="What were the key events and learnings?" {...field} rows={5} />
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
