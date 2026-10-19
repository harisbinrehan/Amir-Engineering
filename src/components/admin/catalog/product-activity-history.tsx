import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatDateTime } from "@/lib/utils/format";
import type { getProductAuditHistory } from "@/lib/data/admin-catalog";

const ACTION_LABEL: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  bulk_update: "Bulk Updated",
  import: "Imported",
};

export function ProductActivityHistory({ history }: { history: Awaited<ReturnType<typeof getProductAuditHistory>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <EmptyState title="No activity yet" description="Changes to this product will be recorded here." />
        ) : (
          <div className="divide-border divide-y">
            {history.map((entry) => (
              <div key={entry.id} className="py-3 text-sm first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {ACTION_LABEL[entry.action] ?? entry.action}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{formatDateTime(entry.created_at)}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  by {(entry.actor as { full_name: string | null } | null)?.full_name ?? "Unknown"}
                </p>
                {entry.diff != null && (
                  <pre className="bg-muted mt-2 overflow-x-auto rounded-md p-2 text-xs">
                    {JSON.stringify(entry.diff, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
