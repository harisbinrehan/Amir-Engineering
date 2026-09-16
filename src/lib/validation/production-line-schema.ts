import { z } from "zod";

export const productionLineSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  shortDescription: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  capacity: z.string().trim().max(120).optional().or(z.literal("")),
  requiredSpace: z.string().trim().max(120).optional().or(z.literal("")),
  powerRequirement: z.string().trim().max(120).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  brochureUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type ProductionLineInput = z.infer<typeof productionLineSchema>;

export const stageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0),
});

export type StageInput = z.infer<typeof stageSchema>;

export const lineMachineSchema = z.object({
  machineryId: z.string().trim().min(1),
  stageId: z.string().trim().min(1).optional().or(z.literal("")),
  quantity: z.number().int().min(1),
  sortOrder: z.number().int().min(0),
});

export type LineMachineInput = z.infer<typeof lineMachineSchema>;
