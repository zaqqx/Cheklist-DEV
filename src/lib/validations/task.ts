import { z } from "zod";

export const URGENCY_VALUES = ["BASSE", "MOYENNE", "HAUTE", "CRITIQUE"] as const;
export const STATUS_VALUES = ["A_FAIRE", "EN_COURS", "TERMINE"] as const;

export const taskSchema = z.object({
  cabCode: z.string().trim().max(100).optional().or(z.literal("")),
  cabLink: z
    .string()
    .trim()
    .url("Lien CAB invalide")
    .max(2048)
    .optional()
    .or(z.literal("")),
  siteUrl: z.union([z.string().trim().url("Lien du site invalide").max(2048), z.literal("")]),
  siteName: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  urgency: z.enum(URGENCY_VALUES),
  deadline: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Date invalide",
    }),
  assignedTo: z.string().trim().max(100).optional().or(z.literal("")),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(STATUS_VALUES),
});
