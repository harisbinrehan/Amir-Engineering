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
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {machinery.map((item) => (
          <Link
            key={item.id}
            href={`/admin/machinery/${item.id}`}
            className="block rounded-lg border p-4 active:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.category?.name ?? "—"}</p>
              </div>
              <Badge variant={item.is_active ? "default" : "secondary"} className="shrink-0 font-normal">
                {item.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {item.is_featured && (
                <Badge variant="secondary" className="font-normal">
                  Featured
                </Badge>
              )}
              {item.capacity && <span className="text-muted-foreground text-xs">{item.capacity}</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Capacity</TableHead>
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
                <TableCell className="text-muted-foreground">{item.capacity ?? "—"}</TableCell>
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
    </>
  );
}
