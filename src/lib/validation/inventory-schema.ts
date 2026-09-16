import { z } from "zod";

export const stockAdjustmentSchema = z.object({
  changeQty: z.number().int().refine((v) => v !== 0, "Enter a non-zero amount"),
  reason: z.string().trim().min(2).max(200),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
