import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  profileImage: z
    .any()
    .refine((file) => {
      // If it's a string, it means it's an existing URL and hasn't been changed
      if (typeof file === "string") return true;
      // If null or undefined, consider it passed and assume removal or not provided
      if (!file) return true;
      
      // Validation for new uploaded File
      return file?.size <= MAX_FILE_SIZE;
    }, "Max file size is 2MB.")
    .refine((file) => {
      if (typeof file === "string") return true;
      if (!file) return true;
      
      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional()
    .nullable(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
