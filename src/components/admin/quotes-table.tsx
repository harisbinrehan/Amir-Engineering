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
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {quotes.map((quote) => (
          <Link
            key={quote.id}
            href={`/admin/quotes/${quote.id}`}
            className="block rounded-lg border p-4 active:bg-muted/50"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="font-medium">{quote.reference_number}</span>
              <QuoteStatusBadge status={quote.status} />
            </div>
            <p className="text-sm">{quote.full_name}</p>
            <p className="text-muted-foreground text-xs">{quote.email}</p>
            {quote.company_name && <p className="text-muted-foreground mt-1 text-xs">{quote.company_name}</p>}
            <div className="text-muted-foreground mt-3 flex items-center justify-between border-t pt-3 text-xs">
              <span>{quote.assigned?.full_name ?? "Unassigned"}</span>
              <span>{formatDate(quote.created_at)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden md:table-cell">Assigned To</TableHead>
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
                <TableCell className="hidden text-muted-foreground md:table-cell">{quote.company_name ?? "—"}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{quote.assigned?.full_name ?? "Unassigned"}</TableCell>
                <TableCell>
                  <QuoteStatusBadge status={quote.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(quote.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
