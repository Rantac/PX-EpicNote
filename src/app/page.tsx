import { EpicNotesClient } from './_components/epic-notes-client';

export default function Home() {
  return (
    <div>
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">FX Epic Notes</h2>
      <EpicNotesClient />
    </div>
  );
}
