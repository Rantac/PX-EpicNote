"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

const AnalysisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
        <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07-.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
    </svg>
);


const navItems = [
  { href: "/", label: "Epic Notes", icon: DollarSign },
  { href: "/analysis", label: "Analysis", icon: AnalysisIcon },
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
