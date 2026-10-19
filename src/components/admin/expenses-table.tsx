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
    <>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {expenses.map((expense) => (
          <div key={expense.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 truncate font-medium">{expense.description}</p>
              <span className="shrink-0 font-medium">{formatCurrency(Number(expense.amount))}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="font-normal">
                {expense.department ?? "—"}
              </Badge>
              <span className="text-muted-foreground text-xs">{expense.category?.name ?? "—"}</span>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">
              {expense.vendor?.name ?? "No vendor"} &middot; {formatDate(expense.expense_date)}
            </div>
            <div className="mt-3 flex items-center gap-1 border-t pt-3">
              <ExpenseFormDialog
                categories={categories}
                vendors={vendors}
                expense={expense}
                trigger={
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                    <PencilIcon className="size-3.5" />
                    Edit
                  </Button>
                }
              />
              <DeleteExpenseButton expenseId={expense.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Business</TableHead>
              <TableHead className="hidden lg:table-cell">Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{expense.category?.name ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className="font-normal">
                    {expense.department ?? "—"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{expense.vendor?.name ?? "—"}</TableCell>
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
    </>
  );
}
