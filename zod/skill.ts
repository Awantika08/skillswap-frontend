import { z } from "zod";

// ---------- Mentor Skill Schema ----------
export const mentorSkillSchema = z.object({
  SkillID: z.string().uuid(),
  Name: z.string(),
  Description: z.string(),
  SkillCategoryID: z.string().uuid(),
  DetailedContent: z.string(),
  IsAvailable: z.boolean(),
  ExperienceLevel: z.number(),
  TeachingStyle: z.string(),
  AddedAt: z.string(),
  CategoryName: z.string(),
  CategoryId: z.string().uuid(),
});

export type MentorSkillType = z.infer<typeof mentorSkillSchema>;

// ---------- Add Mentor Skill Schema ----------
export const addMentorSkillSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(500, "Description must not exceed 500 characters")
    .trim(),
  detailedContent: z
    .string()
    .min(2, "Detailed content must be at least 2 characters")
    .trim(),
  skillCategoryId: z.string().uuid("Please select a valid category"),
  experienceLevel: z
    .string()
    .min(1, "Experience level is required"),
  teachingStyle: z
    .string()
    .min(1, "Teaching style is required"),
});

export type AddMentorSkillFormValues = z.infer<typeof addMentorSkillSchema>;

// ---------- Update Mentor Skill Schema ----------
export const updateMentorSkillSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .min(2, "Description must be at least 2 characters")
      .max(500, "Description must not exceed 500 characters")
      .trim()
      .optional(),
    detailedContent: z
      .string()
      .min(2, "Detailed content must be at least 2 characters")
      .trim()
      .optional(),
    skillCategoryId: z.string().uuid("Please select a valid category").optional(),
    experienceLevel: z
      .string()
      .min(1, "Experience level is required")
      .optional(),
    teachingStyle: z
      .string()
      .min(1, "Teaching style is required")
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    {
      message: "At least one field must be provided for update",
      path: ["name"],
    },
  );

export type UpdateMentorSkillFormValues = z.infer<typeof updateMentorSkillSchema>;

// ---------- Response Schemas ----------
export const mentorSkillsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(mentorSkillSchema),
  fromCache: z.boolean(),
});

export const addMentorSkillResponseSchema = z.object({
  success: z.boolean(),
  data: mentorSkillSchema,
});
