import { z } from "zod";

export const mentorAvailabilityItemSchema = z.object({
  dayOfWeek: z.number().min(1).max(7),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:mm)"),
});

export const mentorAvailabilitySchema = z.object({
  availability: z.array(mentorAvailabilityItemSchema),
});

export type MentorAvailabilitySchemaType = z.infer<typeof mentorAvailabilitySchema>;
