"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/reviews", label: "Reviews" },
  { href: "/settings", label: "Settings" },
] as const;

export function DashboardSidebarNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid gap-0.5", className)} aria-label="Dashboard">
      {items.map(({ href, label }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
