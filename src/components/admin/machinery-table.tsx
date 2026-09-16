import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import type { getAdminMachineryList } from "@/lib/data/admin-machinery";
import { PencilIcon } from "lucide-react";

export function MachineryTable({ machinery }: { machinery: Awaited<ReturnType<typeof getAdminMachineryList>> }) {
  if (machinery.length === 0) {
    return <EmptyState title="No machines found" description="Try adjusting your filters, or add a new machine." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {machinery.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {item.name}
                {item.is_featured && (
                  <Badge variant="secondary" className="ml-2 font-normal">
                    Featured
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {item.category?.name ?? "—"}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{item.capacity ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={item.is_active ? "default" : "secondary"} className="font-normal">
                  {item.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button asChild type="button" variant="ghost" size="icon">
                  <Link href={`/admin/machinery/${item.id}`}>
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
