import type { NotificationEventType } from "@work-holo/api/services/notification/types";

export const EVENT_TYPES: {
  id: NotificationEventType;
  label: string;
  description: string;
}[] = [
  {
    id: "channel_message",
    label: "Channel Messages",
    description: "New messages in channels",
  },
  {
    id: "channel_reply",
    label: "Channel Replies",
    description: "Replies to threads in channels",
  },
  {
    id: "channel_reaction",
    label: "Channel Reactions",
    description: "Reactions to your messages in channels",
  },
  {
    id: "channel_mention",
    label: "Channel Mentions",
    description: "When you are mentioned in a channel",
  },
  {
    id: "channel_direct_reply",
    label: "Channel Direct Replies",
    description: "When someone replies directly to your message in a channel",
  },
  {
    id: "dm_message",
    label: "Direct Messages",
    description: "New direct messages",
  },
  {
    id: "dm_reply",
    label: "DM Replies",
    description: "Replies to threads in DMs",
  },
  {
    id: "dm_direct_reply",
    label: "DM Direct Replies",
    description: "When someone replies directly to your message in a DM",
  },
  {
    id: "dm_reaction",
    label: "DM Reactions",
    description: "Reactions to your messages in DMs",
  },
];

export const CHANNEL_EVENT_DEFINITIONS: {
  id: NotificationEventType;
  label: string;
  description: string;
}[] = [
  {
    id: "channel_message",
    label: "Channel Messages",
    description: "New messages in this channel",
  },
  {
    id: "channel_reply",
    label: "Channel Replies",
    description: "Replies to threads in this channel",
  },
  {
    id: "channel_reaction",
    label: "Channel Reactions",
    description: "Reactions to your messages in this channel",
  },
  {
    id: "channel_mention",
    label: "Channel Mentions",
    description: "When you are mentioned in this channel",
  },
  {
    id: "channel_direct_reply",
    label: "Channel Direct Replies",
    description:
      "When someone replies directly to your message in this channel",
  },
];

export const DM_EVENT_DEFINITIONS: {
  id: NotificationEventType;
  label: string;
  description: string;
}[] = [
  {
    id: "dm_message",
    label: "Direct Messages",
    description: "New messages in this conversation",
  },
  {
    id: "dm_reply",
    label: "DM Replies",
    description: "Replies to threads in this conversation",
  },
  {
    id: "dm_direct_reply",
    label: "DM Direct Replies",
    description:
      "When someone replies directly to your message in this conversation",
  },
  {
    id: "dm_reaction",
    label: "DM Reactions",
    description: "Reactions to your messages in this conversation",
  },
];

export const CHANNEL_EVENTS: NotificationEventType[] = [
  "channel_message",
  "channel_reply",
  "channel_direct_reply",
  "channel_reaction",
  "channel_mention",
];

export const DM_EVENTS: NotificationEventType[] = [
  "dm_message",
  "dm_reply",
  "dm_direct_reply",
  "dm_reaction",
];
