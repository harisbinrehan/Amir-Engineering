import { z } from "zod";

export const EXPENSE_DEPARTMENTS = ["Amir Engineering", "Fine Foods Industries", "Shared / General"] as const;

export const expenseSchema = z.object({
  description: z.string().trim().min(2, "Enter a description").max(200),
  amount: z.number().positive("Enter an amount greater than 0"),
  expenseDate: z.string().trim().min(1, "Select a date"),
  categoryId: z.string().trim().min(1, "Select a category"),
  vendorId: z.string().trim().optional().or(z.literal("")),
  department: z.enum(EXPENSE_DEPARTMENTS),
  paymentMethod: z.string().trim().max(60).optional().or(z.literal("")),
  project: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
