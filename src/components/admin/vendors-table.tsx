import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { VendorFormDialog } from "@/components/admin/vendor-form-dialog";
import { DeleteVendorButton } from "@/components/admin/delete-vendor-button";
import { PencilIcon } from "lucide-react";
import type { getVendors } from "@/lib/data/expenses";

export function VendorsTable({ vendors }: { vendors: Awaited<ReturnType<typeof getVendors>> }) {
  if (vendors.length === 0) {
    return <EmptyState title="No vendors found" description="Add a vendor to track expenses against them." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Contact Person</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {vendor.contact_person ?? "—"}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">{vendor.phone ?? "—"}</TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">{vendor.email ?? "—"}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <VendorFormDialog
                    vendor={vendor}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteVendorButton vendorId={vendor.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
