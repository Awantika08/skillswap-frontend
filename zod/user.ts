import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").nullable().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  status: z.enum(["Active", "Inactive", "Suspended"]),
  profileImage: z
    .any()
    .refine((file) => !file || file instanceof File, "Invalid file format")
    .optional(),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
