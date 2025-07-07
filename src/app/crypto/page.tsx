import { CryptoNotesClient } from '../_components/crypto-notes-client';

export default function CryptoPage() {
  return (
    <>
      <div className="flex items-center bg-background p-4 pb-2 justify-center max-w-[480px] mx-auto">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] text-center">Crypto Notes</h2>
      </div>
      <CryptoNotesClient />
    </>
  );
}
