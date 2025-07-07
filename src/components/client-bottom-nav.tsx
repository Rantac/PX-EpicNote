"use client";

import dynamic from 'next/dynamic';

const BottomNav = dynamic(() => import('@/components/BottomNav').then(mod => mod.BottomNav), { ssr: false });

export function ClientBottomNav() {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2">
      <BottomNav />
      <div className="h-safe-bottom bg-background"></div>
    </div>
  );
}
