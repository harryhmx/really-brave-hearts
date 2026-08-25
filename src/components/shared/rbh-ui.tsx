import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-full bg-rbh-paper text-rbh-ink", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-rbh-ink/10 bg-rbh-panel">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:py-14">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-teal">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-rbh-ink/65">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export function RbhPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-md border border-rbh-ink/10 bg-white/45 dark:bg-rbh-panel/30",
        className
      )}
    >
      {children}
    </section>
  );
}

export function EmptyState({
  message,
  detail,
}: {
  message: string;
  detail?: string;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
      <p className="font-semibold">{message}</p>
      {detail && <p className="mt-2 text-sm text-rbh-muted">{detail}</p>}
    </div>
  );
}
