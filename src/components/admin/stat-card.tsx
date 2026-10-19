import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-sm font-medium">{label}</p>
          <p className="font-heading mt-1.5 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
        </div>
        <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
