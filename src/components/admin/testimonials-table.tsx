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
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{t.author_name}</p>
                {t.company_name && <p className="text-muted-foreground text-xs">{t.company_name}</p>}
              </div>
              <Badge variant={t.is_published ? "default" : "secondary"} className="shrink-0 font-normal">
                {t.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{t.quote}</p>
            {t.rating && <p className="text-muted-foreground mt-1 text-xs">{t.rating} ★</p>}
            <div className="mt-3 flex items-center gap-1 border-t pt-3">
              <TestimonialFormDialog
                testimonial={t}
                trigger={
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                    <PencilIcon className="size-3.5" />
                    Edit
                  </Button>
                }
              />
              <DeleteTestimonialButton testimonialId={t.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead className="hidden md:table-cell">Quote</TableHead>
              <TableHead>Rating</TableHead>
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
                <TableCell className="text-muted-foreground">{t.rating ? `${t.rating} ★` : "—"}</TableCell>
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
    </>
  );
}
