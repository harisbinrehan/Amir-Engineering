import { ConstructionIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

export function AdminStubPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <EmptyState
        icon={ConstructionIcon}
        title="Coming in a future build"
        description="This module's schema and permissions already exist — the management UI ships in a later round."
      />
    </div>
  );
}
