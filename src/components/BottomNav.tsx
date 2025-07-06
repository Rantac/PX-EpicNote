"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Notebook, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Epic Notes", icon: Notebook },
  { href: "/analysis", label: "Analysis", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-full max-w-md items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
        </nav>
    </div>
  );
}
