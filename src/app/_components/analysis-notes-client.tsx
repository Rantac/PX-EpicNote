"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AnalysisNote } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, startOfWeek } from 'date-fns';

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
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const analysisSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters.").max(1000),
  mindset: z.string().min(10, "Mindset notes must be at least 10 characters.").max(1000),
});

export function AnalysisNotesClient() {
  const [notes, setNotes] = useLocalStorage<AnalysisNote[]>("analysis-notes", []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof analysisSchema>>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { summary: "", mindset: "" },
  });

  const onSubmit = (values: z.infer<typeof analysisSchema>) => {
    const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const newNote: AnalysisNote = {
      id: crypto.randomUUID(),
      weekOf: `Week of ${format(weekStartDate, 'MMMM d, yyyy')}`,
      summary: values.summary,
      mindset: values.mindset,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    form.reset();
    setIsDialogOpen(false);
  };
  
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
    <div className="max-w-[480px] mx-auto px-4 py-3">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-14 rounded-xl text-base font-bold">
            <Plus className="mr-2 h-5 w-5" />
            Add Weekly Analysis
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>New Weekly Analysis</DialogTitle>
            <DialogDescription>
              Reflect on the past week and set your intentions.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What were the key events and learnings?" {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mindset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mindset & Focus</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What's your mindset for the coming week?" {...field} rows={5} />
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
            <div key={note.id} className="flex items-start gap-4 bg-background px-4 py-3 border border-border rounded-xl">
              <div className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12 mt-1">
                <FileText size={24} />
              </div>
              <div className="flex flex-col justify-center overflow-hidden w-full">
                <h3 className="text-foreground text-base font-bold leading-normal">{note.weekOf}</h3>
                <div className="mt-2">
                    <h4 className="font-semibold text-sm mb-1 text-foreground">Summary</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.summary}</p>
                </div>
                <div className="mt-2">
                    <h4 className="font-semibold text-sm mb-1 text-foreground">Mindset</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.mindset}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
