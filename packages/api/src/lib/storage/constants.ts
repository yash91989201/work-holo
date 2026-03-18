// Bucket names matching the ones used in Supabase
export const BUCKETS = {
  MESSAGE_ATTACHMENT: "message-attachment",
  MESSAGE_AUDIO: "message-audio",
  MESSAGE_IMAGE: "message-image",
  USER_PROFILE: "user-profile",
  ORG_LOGO: "org-logo",
  NOTIFICATION_SOUND: "notification-sound",
} as const;

// All bucket names as array for initialization
export const ALL_BUCKETS = Object.values(BUCKETS);

// File size limits in bytes
export const FILE_SIZE_LIMITS = {
  DEFAULT: 100 * 1024 * 1024, // 100MB
  IMAGE: 10 * 1024 * 1024, // 10MB
  AUDIO: 50 * 1024 * 1024, // 50MB
  PROFILE: 5 * 1024 * 1024, // 5MB
  LOGO: 5 * 1024 * 1024, // 5MB
  NOTIFICATION_SOUND: 5 * 1024 * 1024, // 5MB
} as const;

// Presigned URL expiry times in seconds
export const URL_EXPIRY = {
  UPLOAD: 60 * 60, // 1 hour for uploads
  DOWNLOAD: 60 * 60 * 24, // 24 hours for downloads
} as const;

// Allowed MIME types per bucket
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  [BUCKETS.MESSAGE_IMAGE]: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  [BUCKETS.MESSAGE_AUDIO]: [
    "audio/webm",
    "audio/mp3",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
  ],
  [BUCKETS.USER_PROFILE]: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  [BUCKETS.ORG_LOGO]: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  [BUCKETS.MESSAGE_ATTACHMENT]: [], // Empty array means all types allowed
  [BUCKETS.NOTIFICATION_SOUND]: [
    "audio/webm",
    "audio/mp3",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "audio/flac",
    "audio/mp4",
  ],
};
