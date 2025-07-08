import { EpicNotesClient } from './_components/epic-notes-client';

export default function Home() {
  return (
    <div>
      <div className="flex items-center p-4 pb-2 justify-center">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] text-center">FX Epic</h2>
      </div>
      <EpicNotesClient />
    </div>
  );
}
