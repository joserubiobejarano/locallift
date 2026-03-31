import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "neutral";

const toneClass: Record<StatusTone, string> = {
  success:
    "border-emerald-600/35 bg-emerald-500/10 font-medium text-emerald-900 dark:text-emerald-100",
  warning:
    "border-amber-600/35 bg-amber-500/10 font-medium text-amber-950 dark:text-amber-100",
  neutral: "font-normal text-muted-foreground",
};

export function StatusBadge({
  tone,
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { tone: StatusTone }) {
  return (
    <Badge variant="outline" className={cn("shrink-0", toneClass[tone], className)} {...props} />
  );
}
