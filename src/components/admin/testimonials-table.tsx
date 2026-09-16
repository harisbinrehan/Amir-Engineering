import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { TestimonialFormDialog } from "@/components/admin/testimonial-form-dialog";
import { DeleteTestimonialButton } from "@/components/admin/delete-testimonial-button";
import { PencilIcon } from "lucide-react";
import type { getAdminTestimonials } from "@/lib/data/admin-cms";

export function TestimonialsTable({ testimonials }: { testimonials: Awaited<ReturnType<typeof getAdminTestimonials>> }) {
  if (testimonials.length === 0) {
    return <EmptyState title="No testimonials yet" description="Add a testimonial to show on the homepage." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead className="hidden md:table-cell">Quote</TableHead>
            <TableHead className="hidden sm:table-cell">Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((t) => (
            <TableRow key={t.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {t.author_name}
                {t.company_name && <div className="text-muted-foreground text-xs">{t.company_name}</div>}
              </TableCell>
              <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">
                {t.quote}
              </TableCell>
              <TableCell className="hidden sm:table-cell">{t.rating ? `${t.rating} ★` : "—"}</TableCell>
              <TableCell>
                <Badge variant={t.is_published ? "default" : "secondary"} className="font-normal">
                  {t.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <TestimonialFormDialog
                    testimonial={t}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteTestimonialButton testimonialId={t.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
