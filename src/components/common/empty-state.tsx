import type { LucideIcon } from "lucide-react";
import { ConstructionIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon: Icon = ConstructionIcon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-20 text-center",
        className,
      )}
    >
      <Icon className="text-muted-foreground size-8" strokeWidth={1.5} />
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground max-w-md text-sm">{description}</p>}
      {action}
    </div>
  );
}
