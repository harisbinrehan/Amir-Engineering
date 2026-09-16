"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { expenseSchema, EXPENSE_DEPARTMENTS, type ExpenseInput } from "@/lib/validation/expense-schema";
import { createExpense, updateExpense } from "@/lib/actions/expenses";
import type { getExpenseCategories, getVendors, getExpenses } from "@/lib/data/expenses";

type Expense = Awaited<ReturnType<typeof getExpenses>>[number];

export function ExpenseFormDialog({
  categories,
  vendors,
  expense,
  trigger,
}: {
  categories: Awaited<ReturnType<typeof getExpenseCategories>>;
  vendors: Awaited<ReturnType<typeof getVendors>>;
  expense?: Expense;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          description: expense.description,
          amount: Number(expense.amount),
          expenseDate: expense.expense_date,
          categoryId: expense.category_id ?? "",
          vendorId: expense.vendor_id ?? "",
          department: (expense.department as ExpenseInput["department"]) ?? "Shared / General",
          paymentMethod: expense.payment_method ?? "",
          project: expense.project ?? "",
          notes: expense.notes ?? "",
        }
      : { department: "Shared / General", expenseDate: new Date().toISOString().slice(0, 10) },
  });

  const categoryId = watch("categoryId");
  const vendorId = watch("vendorId");
  const department = watch("department");

  const onSubmit = async (values: ExpenseInput) => {
    const result = isEditing ? await updateExpense(expense.id, values) : await createExpense(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Expense updated" : "Expense added");
    setOpen(false);
    if (!isEditing) reset({ department: "Shared / General", expenseDate: new Date().toISOString().slice(0, 10) });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
            <PlusIcon />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description *</FieldLabel>
              <FieldContent>
                <Input id="description" {...register("description")} />
                <FieldError errors={[errors.description]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.amount}>
                <FieldLabel htmlFor="amount">Amount (PKR) *</FieldLabel>
                <FieldContent>
                  <Input
                    id="amount"
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("amount", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.amount]} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.expenseDate}>
                <FieldLabel htmlFor="expenseDate">Date *</FieldLabel>
                <FieldContent>
                  <Input id="expenseDate" type="date" {...register("expenseDate")} />
                  <FieldError errors={[errors.expenseDate]} />
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.categoryId}>
                <FieldLabel htmlFor="categoryId">Category *</FieldLabel>
                <FieldContent>
                  <Select value={categoryId} onValueChange={(v) => setValue("categoryId", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.categoryId]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="department">Business *</FieldLabel>
                <FieldContent>
                  <Select
                    value={department}
                    onValueChange={(v) => setValue("department", v as ExpenseInput["department"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>

            {vendors.length > 0 && (
              <Field>
                <FieldLabel htmlFor="vendorId">Vendor</FieldLabel>
                <FieldContent>
                  <Select value={vendorId || "none"} onValueChange={(v) => setValue("vendorId", v === "none" ? "" : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No vendor</SelectItem>
                      {vendors.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="paymentMethod">Payment Method</FieldLabel>
                <FieldContent>
                  <Input id="paymentMethod" placeholder="e.g. Cash, Bank Transfer" {...register("paymentMethod")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="project">Project</FieldLabel>
                <FieldContent>
                  <Input id="project" placeholder="Optional" {...register("project")} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <FieldContent>
                <Textarea id="notes" rows={3} {...register("notes")} />
              </FieldContent>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Expense"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
