import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { UserActiveToggle } from "@/components/admin/user-active-toggle";
import { formatDate } from "@/lib/utils/format";
import type { getAdminUsers } from "@/lib/data/admin-users";

export function UsersTable({
  users,
  currentUserId,
}: {
  users: Awaited<ReturnType<typeof getAdminUsers>>;
  currentUserId: string;
}) {
  if (users.length === 0) {
    return <EmptyState title="No users found" description="Try adjusting your filters." />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          return (
            <div key={user.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {user.full_name ?? "—"}
                    {isSelf && <span className="text-muted-foreground ml-2 text-xs">(you)</span>}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </div>
                <UserActiveToggle userId={user.id} isActive={user.is_active} disabled={isSelf} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground text-xs">Joined {formatDate(user.created_at)}</span>
                <UserRoleSelect userId={user.id} role={user.role} disabled={isSelf} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {user.full_name ?? "—"}
                    {isSelf && <span className="text-muted-foreground ml-2 text-xs">(you)</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <UserRoleSelect userId={user.id} role={user.role} disabled={isSelf} />
                  </TableCell>
                  <TableCell>
                    <UserActiveToggle userId={user.id} isActive={user.is_active} disabled={isSelf} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
