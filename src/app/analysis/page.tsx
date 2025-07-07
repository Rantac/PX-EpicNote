import { AnalysisNotesClient } from '../_components/analysis-notes-client';

export default function AnalysisPage() {
  return (
    <>
      <div className="flex items-center bg-background p-4 pb-2 justify-center max-w-[480px] mx-auto">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] text-center">Week Analysis</h2>
      </div>
      <AnalysisNotesClient />
    </>
  );
}
