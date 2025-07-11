"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const analysisSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  summary: z.string().min(10, "Summary must be at least 10 characters.").max(1000),
});

// Define a type for your analysis notes based on the schema or API response
interface AnalysisNote {
  id?: string; // Assuming your API returns an ID
  title: string;
  summary: string;
  createdAt: string; // Or Date, depending on how you handle it
}
export function AnalysisNotesClient() {
  const [notes, setNotes] = useState<any[]>([]); // Change type to any[] for now, you can define a proper type later
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<AnalysisNote | null>(null); 
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/analysis");
        if (!response.ok) {
          throw new Error("Failed to fetch analysis notes");
        }
        const data = await response.json();
        setNotes(data.notes || []); // Assuming the API returns an object with a 'notes' array
      } catch (error) {
        console.error("Error fetching analysis notes:", error);
        setNotes([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const addForm = useForm<z.infer<typeof analysisSchema>>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { title: "", summary: "" },
  });

  const editForm = useForm<z.infer<typeof analysisSchema>>({
    resolver: zodResolver(analysisSchema),
  });

  const onAddSubmit = (values: z.infer<typeof analysisSchema>) => {
    const newNote = {
      title: values.title,
      summary: values.summary,
      createdAt: new Date().toISOString(),
    };

    fetch("/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "succeeded") {
          setNotes(prev => [data.note, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          addForm.reset();
          setIsAddDialogOpen(false);
        } else {
          console.error("Error saving analysis note:", data.error);
        }
      })
      .catch(error => console.error("Error submitting analysis note:", error));
  };

  const handleCardClick = (note: AnalysisNote) => {
    setSelectedNote(note);
    editForm.reset({ title: note.title || "", summary: note.summary });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = (values: z.infer<typeof analysisSchema>) => {
    if (!selectedNote) return;

    // Implement update logic by sending a PUT request to your API route
    // This requires expanding the API route to handle PUT requests with note IDs
    console.log("Edit submit not implemented yet for API persistence");
  }

  const handleDelete = (noteId: string) => {
    // Implement delete logic by sending a DELETE request to your API route
    // This requires expanding the API route to handle DELETE requests with note IDs
    console.log("Delete not implemented yet for API persistence");
  }

  // Remove the isClient check and replace with isLoading

  if (isLoading) {
    return (
        <div className="px-4">
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
      <div className="px-4 py-3">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 rounded-xl text-base font-bold">
              <Plus className="h-5 w-5" /> New Week Summary
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Week Summary</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title for your summary" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <DialogFooter className="flex-row justify-end">
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
            <div className="divide-y divide-border">
              {notes.map(note => (
                <div key={note.id} onClick={() => handleCardClick(note)} className="flex items-start gap-4 bg-background px-4 py-3 min-h-[72px] cursor-pointer transition-colors hover:bg-accent">
                  <div className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12 mt-1">
                    <FileText size={24} />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden w-full">
                    <h3 className="text-foreground text-base font-bold leading-normal md:truncate whitespace-pre-wrap break-words">{note.title || 'Week Summary'}</h3>
                    <p className="text-sm text-foreground mt-1 md:line-clamp-2 whitespace-pre-wrap break-words">{note.summary}</p>
                    <p className="text-xs text-muted-foreground mt-2">{format(new Date(note.createdAt), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Week Summary</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What were the key events and learnings?" {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex-row justify-between">
                  <Button type="button" variant="destructive" onClick={() => selectedNote && handleDelete(selectedNote.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
