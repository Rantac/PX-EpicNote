import CryptoNotesClient from '../_components/crypto-notes-client';

export default function CryptoPage() {
  return (
    <div>
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Crypto Epic Notes</h2>
      <CryptoNotesClient />
    </div>
  );
}
