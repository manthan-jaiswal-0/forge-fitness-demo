import { cn } from "@/lib/utils";

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-primary",
        className,
      )}
    >
      Demo
    </span>
  );
}

export function DemoNotice({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "rounded-md border border-border bg-surface/60 px-3 py-2 text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
