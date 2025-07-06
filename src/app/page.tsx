import { EpicNotesClient } from './_components/epic-notes-client';

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-foreground">Epic Notes</h1>
        <p className="text-muted-foreground">Quick thoughts and reminders.</p>
      </header>
      <EpicNotesClient />
    </div>
  );
}
