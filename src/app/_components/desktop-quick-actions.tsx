"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DesktopQuickActions() {
  const pathname = usePathname();
  const navItems = [
    {
      href: "/",
      label: "FX Epic",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z"></path>
        </svg>
      ),
    },
    {
      href: "/crypto",
      label: "Crypto Epic",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M170.48,115.7A44,44,0,0,0,144,40.19V24a8,8,0,0,0-16,0V40H112V24a8,8,0,0,0-16,0V40H64a8,8,0,0,0,0,16h8V192H64a8,8,0,0,0,0,16H96v16a8,8,0,0,0,16,0V208h16v16a8,8,0,0,0,16,0V208h8a48,48,0,0,0,18.48-92.3ZM168,84a28,28,0,0,1-28,28H88V56h52A28,28,0,0,1,168,84ZM152,192H88V128h64a32,32,0,0,1,0,64Z"></path>
        </svg>
      ),
    },
    {
      href: "/analysis",
      label: "Week Analysis",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Quick Actions</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 gap-3 rounded-lg border bg-background p-4 items-center transition-colors hover:bg-accent",
                isActive ? "border-primary ring-1 ring-primary" : "border-input"
              )}
            >
              <div className="text-foreground">{item.icon}</div>
              <h2 className="text-foreground text-base font-bold leading-tight">{item.label}</h2>
            </Link>
          );
        })}
      </div>
    </>
  );
}
