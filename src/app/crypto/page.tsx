import { CryptoNotesClient } from '../_components/crypto-notes-client';

export default function CryptoPage() {
  return (
    <div>
      <div className="flex items-center p-4 pb-2 justify-center">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] text-center">Crypto Epic</h2>
      </div>
      <CryptoNotesClient />
    </div>
  );
}
