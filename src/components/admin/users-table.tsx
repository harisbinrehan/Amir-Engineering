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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
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
                <TableCell className="hidden text-muted-foreground sm:table-cell">
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
  );
}
