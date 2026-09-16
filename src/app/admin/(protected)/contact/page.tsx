import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InquiriesList } from "@/components/admin/inquiries-list";
import { requireRole } from "@/lib/auth/require-role";
import { getContactInquiries, getContactInquiryCounts } from "@/lib/data/admin-contact";
import { cn } from "@/lib/utils";
import type { Enums } from "@/types/database.types";

export const metadata: Metadata = { title: "Contact Inquiries" };

const STATUS_FILTERS: Enums<"contact_inquiry_status">[] = ["new", "read", "resolved"];

export default async function AdminContactPage(props: PageProps<"/admin/contact">) {
  await requireRole(["super_admin", "admin", "sales"]);

  const params = await props.searchParams;
  const status = typeof params.status === "string" ? params.status : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const [inquiries, counts] = await Promise.all([
    getContactInquiries({ status: status === "all" ? undefined : (status as Enums<"contact_inquiry_status">), search }),
    getContactInquiryCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {counts.newCount} new &middot; {counts.totalCount} total
        </p>
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/contact?status=all${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={status === "all" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal", status === "all" && "bg-industrial text-industrial-foreground")}
            >
              All
            </Badge>
          </Link>
          {STATUS_FILTERS.map((s) => (
            <Link key={s} href={`/admin/contact?status=${s}${search ? `&q=${search}` : ""}`} scroll={false}>
              <Badge
                variant={status === s ? "default" : "secondary"}
                className={cn("px-3 py-1.5 text-sm font-normal capitalize", status === s && "bg-industrial text-industrial-foreground")}
              >
                {s}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="status" value={status} />
          <Input name="q" placeholder="Search by name or email..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <InquiriesList inquiries={inquiries} />
    </div>
  );
}
