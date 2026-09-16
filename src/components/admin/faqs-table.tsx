import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { FaqFormDialog } from "@/components/admin/faq-form-dialog";
import { DeleteFaqButton } from "@/components/admin/delete-faq-button";
import { PencilIcon } from "lucide-react";
import type { getAdminFaqs } from "@/lib/data/admin-cms";

export function FaqsTable({ faqs }: { faqs: Awaited<ReturnType<typeof getAdminFaqs>> }) {
  if (faqs.length === 0) {
    return <EmptyState title="No FAQs yet" description="Add a frequently asked question." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id} className="hover:bg-muted/50">
              <TableCell className="max-w-md truncate font-medium">{faq.question}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{faq.category ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={faq.is_published ? "default" : "secondary"} className="font-normal">
                  {faq.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <FaqFormDialog
                    faq={faq}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteFaqButton faqId={faq.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
