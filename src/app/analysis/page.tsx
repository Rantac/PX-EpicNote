import { AnalysisNotesClient } from '../_components/analysis-notes-client';

export default function AnalysisPage() {
  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-foreground">Weekly Analysis</h1>
        <p className="text-muted-foreground">Summaries and mindset for the week.</p>
      </header>
      <AnalysisNotesClient />
    </div>
  );
}
