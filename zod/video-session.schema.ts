import { z } from "zod";

export const SessionMeetingInfoSchema = z.object({
  SessionID: z.string().uuid(),
  MeetingRoomId: z.string(),
  Status: z.enum([
    "PENDING_MATCH",
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "REPORTED",
  ]),
  ScheduledStart: z.string().nullable(),
  ScheduledEnd: z.string().nullable(),
  mentorName: z.string(),
  mentorId: z.string().uuid(),
  learnerName: z.string(),
  learnerId: z.string().uuid(),
});

export type SessionMeetingInfo = z.infer<typeof SessionMeetingInfoSchema>;

export const WebRTCSignalingSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("offer"),
    offer: z.any(),
    from: z.string(),
    fromUserId: z.string().optional(),
    fromUserName: z.string().optional(),
  }),
  z.object({
    type: z.literal("answer"),
    answer: z.any(),
    from: z.string(),
  }),
  z.object({
    type: z.literal("ice-candidate"),
    candidate: z.any(),
    from: z.string(),
  }),
]);