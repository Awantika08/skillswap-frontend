import { z } from "zod";

export const SendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]).optional().default("TEXT"),
  replyToId: z.string().optional(),
});

export type SendMessageData = z.infer<typeof SendMessageSchema>;
