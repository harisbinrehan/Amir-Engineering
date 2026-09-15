import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteStatusSelect } from "@/components/admin/quote-status-select";
import { QuoteAssignSelect } from "@/components/admin/quote-assign-select";
import { QuoteNotesPanel } from "@/components/admin/quote-notes-panel";
import { QuoteEstimatedPriceForm } from "@/components/admin/quote-estimated-price-form";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils/format";
import { requireRole } from "@/lib/auth/require-role";
import { getQuoteById, getStaffProfiles } from "@/lib/data/quotes";

export const metadata: Metadata = { title: "Quote Detail" };

export default async function AdminQuoteDetailPage(props: PageProps<"/admin/quotes/[id]">) {
  await requireRole(["super_admin", "admin", "sales"]);

  const { id } = await props.params;
  const [quote, staff] = await Promise.all([getQuoteById(id), getStaffProfiles()]);
  if (!quote) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-muted-foreground text-sm">Quote Request</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{quote.reference_number}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Submitted {formatDateTime(quote.created_at)}</p>
        </div>
        <QuoteStatusSelect quoteId={quote.id} status={quote.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={quote.full_name} />
              <Field label="Company" value={quote.company_name ?? "—"} />
              <Field label="Email" value={quote.email} />
              <Field label="Phone" value={quote.phone} />
              <Field label="City" value={quote.city ?? "—"} />
              <Field label="Country" value={quote.country ?? "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requested Item{quote.items.length > 1 ? "s" : ""}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quote.items.map((item) => (
                <div key={item.id} className="border-border rounded-md border p-3 text-sm">
                  <p className="font-medium">
                    {item.machinery?.name ?? item.production_line?.name ?? "Unknown item"}
                    <Badge variant="secondary" className="ml-2 font-normal">
                      {item.machinery ? "Machinery" : "Production Line"}
                    </Badge>
                  </p>
                  <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Quantity: {item.quantity}</span>
                    {item.required_capacity && <span>Required capacity: {item.required_capacity}</span>}
                  </div>
                  {item.customization_notes && <p className="mt-2">{item.customization_notes}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          {quote.message && (
            <Card>
              <CardHeader>
                <CardTitle>Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{quote.message}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteNotesPanel quoteId={quote.id} notes={quote.notes} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteAssignSelect quoteId={quote.id} assignedTo={quote.assigned_to} staff={staff} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estimated Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuoteEstimatedPriceForm quoteId={quote.id} estimatedPrice={quote.estimated_price} />
              {quote.estimated_price && (
                <p className="text-muted-foreground text-sm">
                  Current: {formatCurrency(quote.estimated_price)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              {quote.status_history.length === 0 ? (
                <p className="text-muted-foreground text-sm">No status changes yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {quote.status_history.map((entry) => (
                    <li key={entry.id} className="text-muted-foreground">
                      <span className="text-foreground font-medium capitalize">
                        {entry.from_status?.replace(/_/g, " ") ?? "—"}
                      </span>{" "}
                      →{" "}
                      <span className="text-foreground font-medium capitalize">
                        {entry.to_status.replace(/_/g, " ")}
                      </span>
                      <div>{formatDate(entry.changed_at)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs tracking-wide uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
