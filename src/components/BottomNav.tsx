"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DollarSign, Bitcoin, LineChart } from "lucide-react";

const navItems = [
  { href: "/", label: "FX Epic", icon: DollarSign },
  { href: "/crypto", label: "Crypto Epic", icon: Bitcoin },
  { href: "/analysis", label: "Analysis", icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-t border-border bg-background px-4 py-2 h-[68px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-end gap-1 rounded-full",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex h-8 items-center justify-center">
                <item.icon />
              </div>
            </Link>
          );
        })}
    </nav>
  );
}
