import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsersTable } from "@/components/admin/users-table";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminUsers } from "@/lib/data/admin-users";
import { cn } from "@/lib/utils";
import type { Enums } from "@/types/database.types";

export const metadata: Metadata = { title: "Users & Staff" };

const ROLE_FILTERS: Enums<"app_role">[] = ["super_admin", "admin", "finance", "sales", "content_manager", "customer"];

export default async function AdminUsersPage(props: PageProps<"/admin/users">) {
  const session = await requireRole(["super_admin"]);

  const params = await props.searchParams;
  const role = typeof params.role === "string" ? params.role : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const users = await getAdminUsers({
    role: role === "all" ? undefined : (role as Enums<"app_role">),
    search,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Users &amp; Staff</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage roles and account access.</p>
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/users?role=all${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={role === "all" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal", role === "all" && "bg-industrial text-industrial-foreground")}
            >
              All
            </Badge>
          </Link>
          {ROLE_FILTERS.map((r) => (
            <Link key={r} href={`/admin/users?role=${r}${search ? `&q=${search}` : ""}`} scroll={false}>
              <Badge
                variant={role === r ? "default" : "secondary"}
                className={cn("px-3 py-1.5 text-sm font-normal capitalize", role === r && "bg-industrial text-industrial-foreground")}
              >
                {r.replace(/_/g, " ")}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="role" value={role} />
          <Input name="q" placeholder="Search by name or email..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <UsersTable users={users} currentUserId={session.user.id} />
    </div>
  );
}
