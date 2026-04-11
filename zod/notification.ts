import { z } from "zod";
import { NotificationType } from "@/types/notification";

export const broadcastNotificationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
  type: z.nativeEnum(NotificationType, {
    message: "Please select a valid notification type",
  }),
  userRole: z.enum(["Mentor", "Learner", "Admin", "All"], {
    message: "Please select a valid user role",
  }),
});

export type BroadcastNotificationFormData = z.infer<typeof broadcastNotificationSchema>;
