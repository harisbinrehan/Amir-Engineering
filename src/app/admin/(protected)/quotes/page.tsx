import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QuotesTable } from "@/components/admin/quotes-table";
import { requireRole } from "@/lib/auth/require-role";
import { getQuotes, type QuoteStatus } from "@/lib/data/quotes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Quotes" };

const STATUS_FILTERS: { label: string; value: QuoteStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Contacted", value: "contacted" },
  { label: "Quotation Sent", value: "quotation_sent" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

async function QuotesList({ status, search }: { status: QuoteStatus | "all"; search: string }) {
  const quotes = await getQuotes({ status, search });
  return <QuotesTable quotes={quotes} />;
}

export default async function AdminQuotesPage(props: PageProps<"/admin/quotes">) {
  await requireRole(["super_admin", "admin", "sales"]);

  const params = await props.searchParams;
  const status = (typeof params.status === "string" ? params.status : "all") as QuoteStatus | "all";
  const search = typeof params.q === "string" ? params.q : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Quote Requests</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Machinery and production line inquiries submitted from the website.
        </p>
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Link key={filter.value} href={`/admin/quotes?status=${filter.value}${search ? `&q=${search}` : ""}`} scroll={false}>
              <Badge
                variant={status === filter.value ? "default" : "secondary"}
                className={cn(
                  "px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground",
                  status === filter.value && "bg-industrial text-industrial-foreground",
                )}
              >
                {filter.label}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="status" value={status} />
          <Input name="q" placeholder="Search by name, company, email..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <Suspense key={status + search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <QuotesList status={status} search={search} />
      </Suspense>
    </div>
  );
}
