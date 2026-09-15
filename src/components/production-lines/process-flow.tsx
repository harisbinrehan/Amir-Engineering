import { ArrowRightIcon } from "lucide-react";
import type { Tables } from "@/types/database.types";

type Stage = Tables<"production_line_stages">;

export function ProcessFlow({ stages }: { stages: Stage[] }) {
  return (
    <ol className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-stretch lg:gap-4">
      {stages.map((stage, index) => (
        <li key={stage.id} className="flex items-center gap-3 lg:flex-1">
          <div className="border-border bg-card flex flex-1 flex-col gap-1 rounded-lg border p-4">
            <span className="text-industrial text-xs font-semibold tracking-wide uppercase">
              Stage {index + 1}
            </span>
            <span className="font-heading text-sm font-semibold">{stage.name}</span>
            {stage.description && <span className="text-muted-foreground text-xs">{stage.description}</span>}
          </div>
          {index < stages.length - 1 && (
            <ArrowRightIcon className="text-muted-foreground hidden size-5 shrink-0 lg:block" />
          )}
        </li>
      ))}
    </ol>
  );
}
