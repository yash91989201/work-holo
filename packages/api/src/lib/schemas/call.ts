import { z } from "zod";

export const InitiateCallInput = z.object({
  type: z.enum(["voice", "video"]),
  sourceConversationId: z.string().optional(),
  sourceType: z.enum(["dm", "channel"]).optional(),
  calleeIds: z.array(z.string()).min(0).max(24),
});

export const GetJoinTokenInput = z.object({
  callId: z.string(),
});

export const AcceptCallInput = z.object({
  callId: z.string(),
});

export const RejectCallInput = z.object({
  callId: z.string(),
});

export const CancelCallInput = z.object({
  callId: z.string(),
});

export const EndCallInput = z.object({
  callId: z.string(),
});

export const AddParticipantInput = z.object({
  callId: z.string(),
  userId: z.string(),
});

export const MuteParticipantInput = z.object({
  callId: z.string(),
  participantUserId: z.string(),
  trackSid: z.string(),
  muted: z.boolean(),
});

export const RemoveParticipantInput = z.object({
  callId: z.string(),
  participantUserId: z.string(),
});

export const ListCallsInput = z.object({
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

export const CallParticipantOutput = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.enum(["host", "participant"]),
  joinedAt: z.date().nullable(),
  leftAt: z.date().nullable(),
  isRemoved: z.boolean(),
});

export const CallOutput = z.object({
  id: z.string(),
  orgId: z.string(),
  type: z.enum(["voice", "video"]),
  status: z.enum([
    "ringing",
    "active",
    "missed",
    "rejected",
    "cancelled",
    "ended",
  ]),
  initiatorId: z.string(),
  sourceConversationId: z.string().nullable(),
  sourceType: z.enum(["dm", "channel"]).nullable(),
  livekitRoomName: z.string(),
  startedAt: z.date().nullable(),
  endedAt: z.date().nullable(),
  createdAt: z.date(),
  participants: z.array(CallParticipantOutput),
});

export const InitiateCallOutput = z.object({
  callId: z.string(),
  livekitRoomName: z.string(),
  token: z.string(),
});

export const GetJoinTokenOutput = z.object({
  token: z.string(),
  livekitRoomName: z.string(),
});
