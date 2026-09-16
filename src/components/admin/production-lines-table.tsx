import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import type { getAdminProductionLines } from "@/lib/data/admin-production-lines";
import { PencilIcon } from "lucide-react";

export function ProductionLinesTable({ lines }: { lines: Awaited<ReturnType<typeof getAdminProductionLines>> }) {
  if (lines.length === 0) {
    return <EmptyState title="No production lines found" description="Add a production line to get started." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Capacity</TableHead>
            <TableHead>Stages</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{line.name}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{line.capacity ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{line.stages.length}</TableCell>
              <TableCell>
                <Badge variant={line.is_active ? "default" : "secondary"} className="font-normal">
                  {line.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button asChild type="button" variant="ghost" size="icon">
                  <Link href={`/admin/production-lines/${line.id}`}>
                    <PencilIcon className="size-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
