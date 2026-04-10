import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;