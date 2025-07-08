"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClientBottomNav } from "@/components/client-bottom-nav";
import { DesktopNav } from "@/components/DesktopNav";

export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  if (isMobile === undefined) {
      return null;
  }

  if (isMobile) {
    return (
      <div className="relative flex flex-col min-h-screen max-w-[480px] mx-auto bg-background">
        <main className="flex-1 pb-16">{children}</main>
        <ClientBottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
                <span className="font-bold">PXNote</span>
                <DesktopNav />
            </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-screen-2xl py-6 px-4 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
    </div>
  );
}
