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
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {lines.map((line) => (
          <Link
            key={line.id}
            href={`/admin/production-lines/${line.id}`}
            className="block rounded-lg border p-4 active:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{line.name}</p>
              <Badge variant={line.is_active ? "default" : "secondary"} className="shrink-0 font-normal">
                {line.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              {line.capacity ?? "—"} &middot; {line.stages.length} stage{line.stages.length === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Stages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{line.name}</TableCell>
                <TableCell className="text-muted-foreground">{line.capacity ?? "—"}</TableCell>
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
    </>
  );
}
