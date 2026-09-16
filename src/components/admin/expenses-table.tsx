import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { ExpenseFormDialog } from "@/components/admin/expense-form-dialog";
import { DeleteExpenseButton } from "@/components/admin/delete-expense-button";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { getExpenses, getExpenseCategories, getVendors } from "@/lib/data/expenses";

export function ExpensesTable({
  expenses,
  categories,
  vendors,
}: {
  expenses: Awaited<ReturnType<typeof getExpenses>>;
  categories: Awaited<ReturnType<typeof getExpenseCategories>>;
  vendors: Awaited<ReturnType<typeof getVendors>>;
}) {
  if (expenses.length === 0) {
    return <EmptyState title="No expenses found" description="Try adjusting your filters, or add a new expense." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell className="text-muted-foreground">{expense.category?.name ?? "—"}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {expense.department ?? "—"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{expense.vendor?.name ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(expense.expense_date)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(Number(expense.amount))}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <ExpenseFormDialog
                    categories={categories}
                    vendors={vendors}
                    expense={expense}
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteExpenseButton expenseId={expense.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
