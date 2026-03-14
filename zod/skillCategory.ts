import { z } from "zod";

// ---------- Skill Category Schema ----------
export const skillCategorySchema = z.object({
  SkillCategoryID: z.string().uuid(),
  Name: z.string(),
  Description: z.string(),
});

export type SkillCategoryType = z.infer<typeof skillCategorySchema>;

// ---------- Create Skill Category Schema ----------
export const createSkillCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  description: z.string().default(""),
});

export type CreateSkillCategoryFormValues = z.infer<
  typeof createSkillCategorySchema
>;

// ---------- Update Skill Category Schema ----------
export const updateSkillCategorySchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .default("") // Just default here too
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided for update",
    path: ["name"],
  });

export type UpdateSkillCategoryFormValues = z.infer<
  typeof updateSkillCategorySchema
>;

// ---------- Pagination Params Schema ----------
export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(20),
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

// ---------- Response Schemas (for runtime validation if needed) ----------
export const skillCategoryResponseSchema = z.object({
  success: z.boolean(),
  data: skillCategorySchema,
});

export const getAllSkillCategoriesResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    categories: z.array(skillCategorySchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      pages: z.number().int().nonnegative(),
    }),
  }),
  fromCache: z.boolean().optional(),
});

export const deleteSkillCategoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
