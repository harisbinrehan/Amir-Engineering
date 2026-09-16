import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { DeleteInquiryButton } from "@/components/admin/delete-inquiry-button";
import { formatDateTime } from "@/lib/utils/format";
import type { getContactInquiries } from "@/lib/data/admin-contact";

export function InquiriesList({ inquiries }: { inquiries: Awaited<ReturnType<typeof getContactInquiries>> }) {
  if (inquiries.length === 0) {
    return <EmptyState title="No inquiries found" description="Contact form submissions will show up here." />;
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id}>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{inquiry.full_name}</p>
                {inquiry.status === "new" && (
                  <Badge className="bg-industrial text-industrial-foreground font-normal">New</Badge>
                )}
                {inquiry.subject && (
                  <Badge variant="secondary" className="font-normal">
                    {inquiry.subject}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5 text-sm">
                <a href={`mailto:${inquiry.email}`} className="hover:underline">
                  {inquiry.email}
                </a>
                {inquiry.phone && <> &middot; {inquiry.phone}</>}
              </p>
              <p className="mt-3 text-sm whitespace-pre-wrap">{inquiry.message}</p>
              <p className="text-muted-foreground mt-3 text-xs">{formatDateTime(inquiry.created_at)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
              <DeleteInquiryButton inquiryId={inquiry.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
