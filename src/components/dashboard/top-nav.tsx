"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/reviews", label: "Reviews" },
  { href: "/settings", label: "Settings" },
] as const;

export function DashboardTopNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-1", className)}
      aria-label="Dashboard"
    >
      {items.map(({ href, label }) => {
        const active =
          pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors",
              active
                ? "bg-muted shadow-sm"
                : "hover:bg-muted/60"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
