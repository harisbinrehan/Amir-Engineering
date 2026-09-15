import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuoteStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils/format";
import type { getQuotes } from "@/lib/data/quotes";

export function QuotesTable({ quotes }: { quotes: Awaited<ReturnType<typeof getQuotes>> }) {
  if (quotes.length === 0) {
    return <EmptyState title="No quote requests found" description="Try adjusting your filters." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id} className="hover:bg-muted/50">
              <TableCell>
                <Link href={`/admin/quotes/${quote.id}`} className="font-medium hover:underline">
                  {quote.reference_number}
                </Link>
              </TableCell>
              <TableCell>
                <div>{quote.full_name}</div>
                <div className="text-muted-foreground text-xs">{quote.email}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{quote.company_name ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{quote.assigned?.full_name ?? "Unassigned"}</TableCell>
              <TableCell>
                <QuoteStatusBadge status={quote.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(quote.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
