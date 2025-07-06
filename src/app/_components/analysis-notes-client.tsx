"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AnalysisNote } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, startOfWeek } from 'date-fns';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const analysisSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters.").max(1000),
  mindset: z.string().min(10, "Mindset notes must be at least 10 characters.").max(1000),
});

export function AnalysisNotesClient() {
  const [notes, setNotes, isHydrated] = useLocalStorage<AnalysisNote[]>("analysis-notes", []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };
  
  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Weekly Analysis
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
      
      {notes.length === 0 ? (
        <Card className="text-center py-10">
            <CardContent>
                <p className="text-muted-foreground">No analysis notes yet. Add your first one!</p>
            </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
            {notes.map(note => (
            <AccordionItem value={note.id} key={note.id} className="border-b-0">
              <Card className="overflow-hidden">
                <AccordionTrigger className="hover:no-underline justify-between w-full p-4 bg-card">
                    <span className="font-semibold text-left text-card-foreground">{note.weekOf}</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-1 text-foreground">Summary</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-1 text-foreground">Mindset</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.mindset}</p>
                        </div>
                         <div className="flex justify-end pt-2 border-t">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteNote(note.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
}
