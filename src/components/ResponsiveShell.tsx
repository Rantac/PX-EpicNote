"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClientBottomNav } from "@/components/client-bottom-nav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <DesktopSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
