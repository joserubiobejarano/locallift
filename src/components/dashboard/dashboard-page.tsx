import * as React from "react";

import { cn } from "@/lib/utils";

const widthClass = {
  /** Overview / wide metric grids */
  lg: "max-w-6xl",
  /** Reviews and general dashboard content */
  md: "max-w-5xl",
  /** Settings-style forms */
  sm: "max-w-3xl",
} as const;

export type DashboardPageWidth = keyof typeof widthClass;

export function DashboardPage({
  children,
  width = "md",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  width?: DashboardPageWidth;
}) {
  return (
    <div
      className={cn("mx-auto w-full space-y-8", widthClass[width], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DashboardPageHeader({
  title,
  description,
  children,
  className,
  kicker,
  ...props
}: React.ComponentProps<"header"> & {
  title: string;
  description?: React.ReactNode;
  kicker?: string;
}) {
  return (
    <header className={cn("space-y-2", className)} {...props}>
      {kicker ? (
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kicker}</p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>
          ) : null}
        </div>
        {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
      </div>
    </header>
  );
}

export function DashboardSection({
  title,
  description,
  children,
  className,
  ...props
}: React.ComponentProps<"section"> & {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
