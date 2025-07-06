"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DollarSign, BarChart } from "lucide-react";


const navItems = [
  { href: "/", label: "Epic Notes", icon: DollarSign },
  { href: "/analysis", label: "Analysis", icon: BarChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-t border-[#f0f4f2] bg-white px-4 pt-2 pb-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-end gap-1 rounded-full",
                isActive ? "text-black" : "text-[#648771]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex h-8 items-center justify-center">
                <item.icon size={24} />
              </div>
            </Link>
          );
        })}
    </nav>
  );
}
