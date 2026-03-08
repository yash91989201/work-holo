/* ═══════════════════════════════════════════════════════
   Feature Page Data — types + slug helper
   ═══════════════════════════════════════════════════════ */

export interface FeatureSection {
  layout: "image-left" | "content-left";
  badge?: string;
  heading: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  bgVariant?: "white" | "gray";
}

export interface FeatureStat {
  iconPaths: string[];
  title: string;
  description: string;
}

export interface FeatureFaq {
  question: string;
  answer: string;
}

export interface FeaturePageData {
  slug: string;
  category: string;
  headingBefore: string;
  headingHighlight: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  sections: FeatureSection[];
  statsHeadline: string;
  statsSubtitle: string;
  stats: FeatureStat[];
  faq: FeatureFaq[];
  ctaHeading: string;
}

/* ─── Icon SVG paths (reused across features) ─── */
const ICON = {
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z", "M7 11V7a5 5 0 0 1 10 0v4"],
  globe: ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  msg: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "m21 21-4.35-4.35"],
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  file: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  zap: ["M13 2 3 14h9l-1 10 10-12h-9l1-10z"],
  settings: ["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z", "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"],
  monitor: ["M2 3h20v14H2z", "M8 21h8", "M12 17v4"],
  image: ["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z", "M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z", "m21 15-5-5L5 21"],
  layers: ["M12 2 2 7l10 5 10-5-10-5Z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
};

const featurePages: FeaturePageData[] = [
  // ─── 1. Team Channels ───
  {
    slug: "team-channels",
    category: "Workspace Management",
    headingBefore: "Structure your workspace with",
    headingHighlight: "custom channels.",
    subtitle: "Owners and admins can build a structured environment by creating dedicated channels for every team and project, ensuring everyone is in the right place for the right conversation.",
    ctaPrimary: "Create Channel",
    ctaSecondary: "Admin Dashboard",
    sections: [
      { layout: "image-left", badge: "Organization", heading: "Organize your team by specific interests and projects.", description: "Admins can create multiple channels and assign team members to them, ensuring everyone is in the right place for the right conversation. No more cluttered inboxes or missed updates.", imageSrc: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", imageAlt: "Team workspace", bgVariant: "white" },
      { layout: "content-left", badge: "Admin Controls", heading: "Admin-controlled access for seamless team integration.", description: "Manage who joins which channel. Admins have full control over channel creation and team assignments to keep conversations focused and secure. Set permissions and manage roles with ease.", linkText: "Explore admin settings", linkHref: "/features/admin-dashboard", imageSrc: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80", imageAlt: "Admin controls", bgVariant: "gray" },
      { layout: "image-left", badge: "Smart Updates", heading: "Keep every channel member aligned with smart updates.", description: "Even with multiple channels, staying updated is easy. Members get structured summaries of conversations they might have missed, ensuring no one falls behind on project progress.", linkText: "Learn about AI summaries", linkHref: "/features/mentions", imageSrc: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80", imageAlt: "Notifications", bgVariant: "white" },
      { layout: "content-left", badge: "External Collaboration", heading: "Extend your structure to partners and clients.", description: "Admins can safely add external teams to specific channels, maintaining the same structured approach for cross-company collaboration without compromising security.", linkText: "Manage external access", linkHref: "/features/role-based-access", imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", imageAlt: "Collaboration", bgVariant: "gray" },
      { layout: "image-left", badge: "Automated Support", heading: "Automated support for structured team growth.", description: "Help new members get up to speed in any channel. Admins can deploy automated experts to answer FAQs and guide team members, ensuring a smooth onboarding experience for everyone.", linkText: "See automation in action", linkHref: "/features/workspace-control", imageSrc: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", imageAlt: "Automation", bgVariant: "white" },
    ],
    statsHeadline: "Structured. Secure. Scalable.",
    statsSubtitle: "Whether you're managing a small team or a global enterprise, our channel structure keeps you organized.",
    stats: [
      { iconPaths: ICON.lock, title: "Granular Access Control", description: "Admins can set precise permissions for each channel, ensuring sensitive information stays with the right people." },
      { iconPaths: ICON.globe, title: "Global Team Alignment", description: "Create channels for different regions and time zones, keeping global teams connected and structured." },
      { iconPaths: ICON.filter, title: "Structured Search", description: "Find exactly what you need with channel-specific search filters, making institutional knowledge easy to access." },
    ],
    faq: [
      { question: "Who can create channels in the workspace?", answer: "Workspace owners and admins can create channels. They control channel creation, membership, and permissions from the admin dashboard." },
      { question: "How do I add team members to a specific channel?", answer: "Navigate to the channel settings and use the 'Add Members' option. You can add individuals or entire teams at once." },
      { question: "Can I create private channels for sensitive projects?", answer: "Yes. Admins can create private channels with restricted access. Only invited members can view and participate in private channels." },
      { question: "How many channels can I create?", answer: "There is no limit to the number of channels you can create. Organize your workspace with as many channels as your team needs." },
      { question: "What happens when a project ends?", answer: "Channels can be archived while preserving their full history. Archived channels remain searchable but are removed from active views." },
      { question: "Can I move members between channels?", answer: "Yes. Admins can add or remove members from any channel at any time without disrupting ongoing conversations." },
    ],
    ctaHeading: "Build a better team with Workholo.",
  },

  // ─── 2. Direct Messaging ───
  {
    slug: "direct-messaging",
    category: "Communication",
    headingBefore: "Private conversations with",
    headingHighlight: "direct messaging.",
    subtitle: "Send 1-on-1 messages to any team member instantly. Share files, images, and have focused private conversations without the noise of public channels.",
    ctaPrimary: "Start Messaging",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Private Chat", heading: "Focused 1-on-1 conversations.", description: "Connect directly with colleagues for private discussions. Direct messages keep sensitive topics out of public channels while maintaining a full searchable history.", imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", imageAlt: "Private messaging", bgVariant: "white" },
      { layout: "content-left", badge: "Rich Media", heading: "Share files and media seamlessly.", description: "Exchange documents, images, and videos in direct messages. Preview files inline and access a shared media gallery for quick reference.", imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", imageAlt: "File sharing", bgVariant: "gray" },
      { layout: "image-left", badge: "Admin Control", heading: "Configurable by administrators.", description: "Organization admins can enable or disable direct messaging based on company policy, giving full control over communication pathways.", imageSrc: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80", imageAlt: "Admin settings", bgVariant: "white" },
    ],
    statsHeadline: "Fast. Private. Reliable.",
    statsSubtitle: "Direct messaging built for teams that value speed and privacy.",
    stats: [
      { iconPaths: ICON.zap, title: "Instant Delivery", description: "Messages are delivered in real-time with read receipts and typing indicators." },
      { iconPaths: ICON.lock, title: "End-to-End Privacy", description: "Direct messages are private between participants, with enterprise-grade encryption." },
      { iconPaths: ICON.file, title: "File Sharing", description: "Share documents up to 100MB directly in conversations with inline preview." },
    ],
    faq: [
      { question: "Can admins read direct messages?", answer: "No. Direct messages are private between participants. Admins can enable or disable the DM feature but cannot access message content." },
      { question: "Is there a file size limit?", answer: "You can share files up to 100MB in direct messages. Larger files can be shared via linked cloud storage." },
      { question: "Can I search through old direct messages?", answer: "Yes. All direct messages are fully searchable. Use keywords, dates, or file types to find past conversations." },
      { question: "Can I message someone outside my organization?", answer: "Direct messaging is limited to members within your workspace for security. External collaboration uses shared channels." },
    ],
    ctaHeading: "Start private conversations today.",
  },

  // ─── 3. Real-Time Messaging ───
  {
    slug: "real-time-messaging",
    category: "Communication",
    headingBefore: "Stay connected with",
    headingHighlight: "real-time messaging.",
    subtitle: "Instant team communication with zero lag. Messages are delivered in real-time with typing indicators, read receipts, and smart notifications.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Watch Demo",
    sections: [
      { layout: "image-left", badge: "Instant", heading: "Messages delivered in milliseconds.", description: "Our real-time infrastructure ensures your messages are delivered instantly. See typing indicators, online status, and read receipts for full visibility.", imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80", imageAlt: "Real-time chat", bgVariant: "white" },
      { layout: "content-left", badge: "Presence", heading: "Always know who's available.", description: "Live presence indicators show you who's online, away, or in a meeting. Smart status updates let your team coordinate without interrupting workflows.", imageSrc: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80", imageAlt: "Online presence", bgVariant: "gray" },
      { layout: "image-left", badge: "Sync", heading: "Seamless multi-device experience.", description: "Start a conversation on your desktop and continue on mobile. Messages sync instantly across all devices with full history and notifications.", imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80", imageAlt: "Multi-device", bgVariant: "white" },
    ],
    statsHeadline: "Speed. Reliability. Scale.",
    statsSubtitle: "Built on infrastructure that keeps your team connected at any scale.",
    stats: [
      { iconPaths: ICON.zap, title: "Sub-Second Delivery", description: "Messages arrive in under 100ms, keeping conversations natural and fluid." },
      { iconPaths: ICON.monitor, title: "99.9% Uptime", description: "Enterprise-grade infrastructure ensures your team stays connected 24/7." },
      { iconPaths: ICON.users, title: "Unlimited Members", description: "Scale from 10 to 10,000 members without performance degradation." },
    ],
    faq: [
      { question: "How fast are messages delivered?", answer: "Messages are typically delivered in under 100 milliseconds, making conversations feel natural and instantaneous." },
      { question: "Does it work offline?", answer: "Messages sent while offline are queued and delivered automatically when you reconnect. You can still browse cached messages." },
      { question: "Are there notification controls?", answer: "Yes. Customize notifications per channel, set do-not-disturb schedules, and configure priority notifications for important messages." },
      { question: "What about message reliability?", answer: "Every message is persisted immediately. Our infrastructure ensures zero message loss even during network interruptions." },
    ],
    ctaHeading: "Experience real-time collaboration.",
  },

  // ─── 4. Message History ───
  {
    slug: "message-history",
    category: "Communication",
    headingBefore: "Never miss a thing with",
    headingHighlight: "message history.",
    subtitle: "Full searchable history of every conversation. New team members get instant context and nothing is ever lost.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Search", heading: "Find any message instantly.", description: "Powerful search lets you find messages by keyword, date, sender, or channel. Filter results by file type, mentions, or reactions to pinpoint exactly what you need.", imageSrc: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80", imageAlt: "Search messages", bgVariant: "white" },
      { layout: "content-left", badge: "Onboarding", heading: "New members start with full context.", description: "When new team members join a channel, they get access to its complete history. No more re-explaining decisions or searching for lost context.", imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", imageAlt: "Team onboarding", bgVariant: "gray" },
    ],
    statsHeadline: "Complete. Searchable. Secure.",
    statsSubtitle: "Your team's institutional knowledge preserved forever.",
    stats: [
      { iconPaths: ICON.search, title: "Advanced Search", description: "Full-text search with filters for date, sender, channel, and file type." },
      { iconPaths: ICON.layers, title: "Unlimited History", description: "All messages are retained permanently with no storage limits on any plan." },
      { iconPaths: ICON.shield, title: "Compliance Ready", description: "Message retention policies and export tools for regulatory compliance." },
    ],
    faq: [
      { question: "How far back does message history go?", answer: "Message history is unlimited. Every message sent in your workspace is permanently stored and searchable." },
      { question: "Can I export message history?", answer: "Yes. Admins can export complete channel histories in standard formats for compliance or record-keeping." },
      { question: "Do new members see all past messages?", answer: "New members joining a channel see its full history, giving them immediate context for ongoing discussions." },
    ],
    ctaHeading: "Never lose a conversation again.",
  },

  // ─── 5. @Mentions ───
  {
    slug: "mentions",
    category: "Notifications",
    headingBefore: "Get attention with",
    headingHighlight: "@mentions.",
    subtitle: "Tag teammates directly in conversations to grab their attention instantly. Mentions cut through the noise and ensure critical messages are seen.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Instant Alerts", heading: "Notify the right people immediately.", description: "Use @mentions to send real-time notifications to specific team members, entire channels, or custom groups. Recipients get visual and audio alerts so nothing gets missed.", imageSrc: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80", imageAlt: "Mentions", bgVariant: "white" },
      { layout: "content-left", badge: "Smart Filtering", heading: "Filter your mentions for quick review.", description: "View all your mentions across every channel in a single feed. Quickly catch up on conversations where you were directly called out.", imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", imageAlt: "Mention feed", bgVariant: "gray" },
    ],
    statsHeadline: "Focused. Actionable. Transparent.",
    statsSubtitle: "Make sure the right people see the right messages at the right time.",
    stats: [
      { iconPaths: ICON.bell, title: "Priority Notifications", description: "Mentions trigger priority notifications across all connected devices." },
      { iconPaths: ICON.users, title: "Group Mentions", description: "Tag entire teams or departments with @channel and @here shortcuts." },
      { iconPaths: ICON.search, title: "Mention Feed", description: "Dedicated feed shows all your mentions across channels in one view." },
    ],
    faq: [
      { question: "How do @mentions work?", answer: "Type @ followed by a team member's name to mention them. They'll receive a real-time notification with a link to the conversation." },
      { question: "Can I mention an entire channel?", answer: "Yes. Use @channel to notify all members or @here to notify only those currently online." },
      { question: "Can I mute mentions from specific channels?", answer: "Yes. You can configure notification preferences per channel, including muting non-critical mentions." },
    ],
    ctaHeading: "Never miss an important message.",
  },

  // ─── 6. File Sharing ───
  {
    slug: "file-sharing",
    category: "Media & Attachments",
    headingBefore: "Share documents with",
    headingHighlight: "seamless file sharing.",
    subtitle: "Upload and share documents, spreadsheets, and files directly in your conversations. Keep everything organized and accessible.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Upload", heading: "Share any file type instantly.", description: "Upload documents, spreadsheets, PDFs, and more directly into channels or direct messages. Files are stored securely and accessible to all channel members.", imageSrc: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=800&q=80", imageAlt: "File upload", bgVariant: "white" },
      { layout: "content-left", badge: "Organization", heading: "All files in one accessible place.", description: "Browse shared files across channels with filterable views. Sort by date, type, or channel to find documents quickly.", imageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80", imageAlt: "File organization", bgVariant: "gray" },
    ],
    statsHeadline: "Organized. Accessible. Secure.",
    statsSubtitle: "File sharing designed for productive teams.",
    stats: [
      { iconPaths: ICON.file, title: "Any File Type", description: "Share documents, images, videos, code files, and more with no format restrictions." },
      { iconPaths: ICON.lock, title: "Secure Storage", description: "All files are encrypted at rest and in transit with enterprise-grade security." },
      { iconPaths: ICON.search, title: "Quick Search", description: "Find shared files instantly with search by name, type, and date." },
    ],
    faq: [
      { question: "What file types are supported?", answer: "All file types are supported including documents, images, videos, archives, and code files." },
      { question: "What is the file size limit?", answer: "Individual files can be up to 100MB. Contact sales for higher limits on enterprise plans." },
      { question: "Are shared files backed up?", answer: "Yes. All uploaded files are redundantly stored and backed up with 99.99% durability." },
    ],
    ctaHeading: "Share files smarter with Workholo.",
  },

  // ─── 7. Media Preview ───
  {
    slug: "media-preview",
    category: "Media & Attachments",
    headingBefore: "Preview media with",
    headingHighlight: "inline previews.",
    subtitle: "See images, videos, and rich media directly in your conversations without leaving the chat. Full-screen viewing and easy downloading included.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Inline Preview", heading: "View images and videos without leaving chat.", description: "Shared media renders directly in conversations with expandable previews. Click to view full-screen with zoom and navigation controls.", imageSrc: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", imageAlt: "Media preview", bgVariant: "white" },
      { layout: "content-left", badge: "Gallery", heading: "Browse all shared media in one place.", description: "Access a visual gallery of all media shared in a channel. Filter by type, date, or sender for quick reference.", imageSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", imageAlt: "Media gallery", bgVariant: "gray" },
    ],
    statsHeadline: "Rich. Visual. Instant.",
    statsSubtitle: "Media experience designed for modern teams.",
    stats: [
      { iconPaths: ICON.image, title: "Rich Previews", description: "Images, videos, GIFs, and documents preview directly inline." },
      { iconPaths: ICON.monitor, title: "Full-Screen View", description: "Expand any media to full-screen with zoom and download options." },
      { iconPaths: ICON.layers, title: "Media Gallery", description: "Centralized gallery view of all shared media across channels." },
    ],
    faq: [
      { question: "What media formats are supported?", answer: "JPEG, PNG, GIF, WebP, MP4, WebM, and most common media formats are supported with inline preview." },
      { question: "Can I download shared media?", answer: "Yes. Every media preview includes a download button for saving files locally." },
      { question: "Is there a media gallery?", answer: "Yes. Each channel has a media gallery tab that shows all shared images and videos in a grid view." },
    ],
    ctaHeading: "Experience rich media sharing.",
  },

  // ─── 8. Drag & Drop ───
  {
    slug: "drag-and-drop",
    category: "Media & Attachments",
    headingBefore: "Upload files with",
    headingHighlight: "drag and drop.",
    subtitle: "Simply drag files from your desktop onto any conversation to share them instantly. No dialogs, no friction.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Effortless", heading: "Drop files directly into conversations.", description: "Drag any file from your desktop, file manager, or browser directly into a channel or DM. Files upload automatically with progress indicators.", imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", imageAlt: "Drag and drop", bgVariant: "white" },
      { layout: "content-left", badge: "Batch Upload", heading: "Share multiple files at once.", description: "Select and drop multiple files simultaneously. All files upload in parallel with individual progress tracking.", imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", imageAlt: "Batch upload", bgVariant: "gray" },
    ],
    statsHeadline: "Fast. Simple. Efficient.",
    statsSubtitle: "File uploads that stay out of your way.",
    stats: [
      { iconPaths: ICON.zap, title: "Instant Upload", description: "Files start uploading the moment you drop them with zero configuration." },
      { iconPaths: ICON.layers, title: "Batch Support", description: "Drop multiple files at once and they all upload in parallel." },
      { iconPaths: ICON.file, title: "Progress Tracking", description: "Real-time progress indicators for every file being uploaded." },
    ],
    faq: [
      { question: "How many files can I drag at once?", answer: "You can drag and drop up to 10 files simultaneously. Each file uploads independently in parallel." },
      { question: "What happens if upload fails?", answer: "Failed uploads can be retried with a single click. The system automatically retries on temporary network issues." },
    ],
    ctaHeading: "Upload files the easy way.",
  },

  // ─── 9. User Management ───
  {
    slug: "user-management",
    category: "Team & Admin",
    headingBefore: "Manage your team with",
    headingHighlight: "user management.",
    subtitle: "Create, invite, and manage unlimited users with powerful admin tools. Handle onboarding, offboarding, and everything in between.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Admin Dashboard",
    sections: [
      { layout: "image-left", badge: "User Control", heading: "Complete control over your team roster.", description: "Add new team members individually or in bulk. Manage user profiles, permissions, and access levels from a centralized admin panel.", imageSrc: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80", imageAlt: "Team management", bgVariant: "white" },
      { layout: "content-left", badge: "Onboarding", heading: "Streamlined onboarding for new members.", description: "New users get preconfigured channel access and welcome messages. Automated onboarding flows ensure everyone starts productive from day one.", imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", imageAlt: "Onboarding", bgVariant: "gray" },
      { layout: "image-left", badge: "Offboarding", heading: "Secure offboarding with data retention.", description: "When team members leave, their messages and files are preserved. Revoke access instantly while keeping institutional knowledge intact.", imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80", imageAlt: "Offboarding", bgVariant: "white" },
    ],
    statsHeadline: "Scalable. Secure. Simple.",
    statsSubtitle: "User management that grows with your organization.",
    stats: [
      { iconPaths: ICON.users, title: "Unlimited Users", description: "Add as many team members as needed with no per-seat limits." },
      { iconPaths: ICON.shield, title: "Instant Deprovisioning", description: "Revoke access immediately when team members depart." },
      { iconPaths: ICON.settings, title: "Bulk Operations", description: "Import, export, and manage users in bulk with CSV support." },
    ],
    faq: [
      { question: "Is there a limit on users?", answer: "No. You can create unlimited users on any plan. Scale your team without worrying about per-seat costs." },
      { question: "Can I import users from a CSV?", answer: "Yes. Bulk import users from CSV files with automatic profile creation and channel assignment." },
      { question: "What happens to data when a user is removed?", answer: "Messages and files from removed users are preserved. Only their access is revoked." },
    ],
    ctaHeading: "Manage your team effortlessly.",
  },

  // ─── 10. Role-Based Access ───
  {
    slug: "role-based-access",
    category: "Team & Admin",
    headingBefore: "Secure your workspace with",
    headingHighlight: "role-based access.",
    subtitle: "Define granular permissions with Admin and Associate roles. Ensure the right people have the right access to the right resources.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Roles", heading: "Built-in roles for every need.", description: "Assign Admin or Associate roles to control who can create channels, manage users, and access admin settings. Custom roles coming soon.", imageSrc: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80", imageAlt: "Role management", bgVariant: "white" },
      { layout: "content-left", badge: "Permissions", heading: "Granular control over every action.", description: "Define exactly what each role can do — from channel creation to user management. Permissions cascade through the organization hierarchy.", imageSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80", imageAlt: "Permissions", bgVariant: "gray" },
    ],
    statsHeadline: "Controlled. Flexible. Enterprise-Ready.",
    statsSubtitle: "Access control designed for modern organizations.",
    stats: [
      { iconPaths: ICON.shield, title: "Granular Permissions", description: "Fine-grained control over every workspace action and resource." },
      { iconPaths: ICON.users, title: "Role Hierarchy", description: "Clear role hierarchy with Admin and Associate levels." },
      { iconPaths: ICON.lock, title: "Audit Trail", description: "Every permission change is logged for compliance and security." },
    ],
    faq: [
      { question: "What roles are available?", answer: "Currently Admin and Associate roles are built-in. Custom roles are on our roadmap." },
      { question: "Can I restrict channel creation?", answer: "Yes. Only Admin-level users can create channels by default. This can be configured in workspace settings." },
      { question: "Are role changes logged?", answer: "Yes. All role and permission changes are logged in the audit trail for compliance." },
    ],
    ctaHeading: "Secure your workspace today.",
  },

  // ─── 11. Workspace Control ───
  {
    slug: "workspace-control",
    category: "Team & Admin",
    headingBefore: "Take charge of your",
    headingHighlight: "entire workspace.",
    subtitle: "Configure workspace-wide settings, branding, and policies from one centralized admin dashboard.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Admin Dashboard",
    sections: [
      { layout: "image-left", badge: "Configuration", heading: "One dashboard to rule them all.", description: "Manage workspace settings, branding, default channels, and organization policies from a single admin panel.", imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", imageAlt: "Dashboard", bgVariant: "white" },
      { layout: "content-left", badge: "Branding", heading: "White-label your workspace.", description: "Customize logos, colours, and product name. Deliver a branded experience that feels like your own product.", imageSrc: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80", imageAlt: "Branding", bgVariant: "gray" },
    ],
    statsHeadline: "Centralized. Branded. Powerful.",
    statsSubtitle: "Everything you need to manage your workspace in one place.",
    stats: [
      { iconPaths: ICON.settings, title: "Full Configuration", description: "Control every aspect of your workspace from a single settings panel." },
      { iconPaths: ICON.image, title: "Custom Branding", description: "Logo, colours, and product name customization for white-label deployments." },
      { iconPaths: ICON.shield, title: "Policy Controls", description: "Set organization-wide policies for security, messaging, and access." },
    ],
    faq: [
      { question: "Can I white-label the workspace?", answer: "Yes. Customize the logo, colour scheme, and product name to match your brand." },
      { question: "What settings can I configure?", answer: "Everything from default channels and user permissions to notification preferences and security policies." },
    ],
    ctaHeading: "Take control of your workspace.",
  },

  // ─── 12. Admin Dashboard ───
  {
    slug: "admin-dashboard",
    category: "Team & Admin",
    headingBefore: "Centralized controls with",
    headingHighlight: "admin dashboard.",
    subtitle: "A powerful dashboard for managing users, channels, permissions, and workspace analytics all in one place.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Overview", heading: "See everything at a glance.", description: "The admin dashboard gives you a bird's-eye view of your workspace — active users, channel activity, storage usage, and recent actions.", imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", imageAlt: "Dashboard overview", bgVariant: "white" },
      { layout: "content-left", badge: "Actions", heading: "Manage users and channels instantly.", description: "Create users, manage roles, create channels, and configure settings directly from the dashboard with zero friction.", imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", imageAlt: "Admin actions", bgVariant: "gray" },
    ],
    statsHeadline: "Visibility. Control. Efficiency.",
    statsSubtitle: "Everything an admin needs in a single view.",
    stats: [
      { iconPaths: ICON.monitor, title: "Real-Time Analytics", description: "Live dashboards showing user activity, channel usage, and system health." },
      { iconPaths: ICON.users, title: "User Management", description: "Add, remove, and manage user roles directly from the dashboard." },
      { iconPaths: ICON.settings, title: "Quick Actions", description: "Common admin tasks accessible with one click from the overview." },
    ],
    faq: [
      { question: "Who has access to the admin dashboard?", answer: "Only users with Admin roles can access the admin dashboard and its management features." },
      { question: "Can I export analytics data?", answer: "Yes. Dashboard analytics can be exported as CSV for reporting and compliance." },
    ],
    ctaHeading: "Manage your workspace effortlessly.",
  },

  // ─── 13. Structured Communication ───
  {
    slug: "structured-comm",
    category: "Productivity",
    headingBefore: "Drive clarity with",
    headingHighlight: "structured communication.",
    subtitle: "Keep team conversations organized and on-topic with structured channels, threads, and clear ownership.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Structure", heading: "Every conversation has a home.", description: "Department channels, project channels, and topic-based channels ensure every discussion has a dedicated place, reducing clutter and increasing focus.", imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", imageAlt: "Structured comms", bgVariant: "white" },
      { layout: "content-left", badge: "Clarity", heading: "Clear ownership and accountability.", description: "Channel descriptions, pinned messages, and topic labels make it easy to understand the purpose and rules of every conversation space.", imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", imageAlt: "Accountability", bgVariant: "gray" },
    ],
    statsHeadline: "Focused. Organized. Productive.",
    statsSubtitle: "Communication that drives results, not noise.",
    stats: [
      { iconPaths: ICON.msg, title: "Topic Channels", description: "Dedicated channels for every team, project, and topic." },
      { iconPaths: ICON.filter, title: "Noise Reduction", description: "Structured channels eliminate irrelevant cross-talk and information overload." },
      { iconPaths: ICON.users, title: "Clear Ownership", description: "Every channel has defined admins, topics, and participation rules." },
    ],
    faq: [
      { question: "How is this different from regular channels?", answer: "Structured communication adds topic labels, enforced descriptions, and clear purpose to every channel for maximum clarity." },
      { question: "Can I pin important messages?", answer: "Yes. Pin critical messages, guidelines, or resources to the top of any channel for easy access." },
    ],
    ctaHeading: "Bring structure to your team.",
  },

  // ─── 14. Centralized Workspace ───
  {
    slug: "centralized-workspace",
    category: "Productivity",
    headingBefore: "Everything in one place with a",
    headingHighlight: "centralized workspace.",
    subtitle: "Messages, files, channels, and team management — all accessible from a single unified platform.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Unified", heading: "One platform for everything.", description: "No more switching between apps. Messages, files, channels, user management, and analytics live together in one cohesive workspace.", imageSrc: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", imageAlt: "Centralized platform", bgVariant: "white" },
      { layout: "content-left", badge: "Integration", heading: "Connect your existing tools.", description: "Integrate with Google Workspace, developer APIs, and webhooks to bring your external workflows into Workholo.", imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80", imageAlt: "Integrations", bgVariant: "gray" },
    ],
    statsHeadline: "Unified. Connected. Efficient.",
    statsSubtitle: "Stop tool-switching and start collaborating.",
    stats: [
      { iconPaths: ICON.layers, title: "All-in-One", description: "Messages, files, channels, and admin tools in a single platform." },
      { iconPaths: ICON.globe, title: "API Access", description: "RESTful APIs and webhooks for custom integrations and automations." },
      { iconPaths: ICON.zap, title: "Zero Context Switching", description: "Everything your team needs without leaving the workspace." },
    ],
    faq: [
      { question: "What integrations are available?", answer: "Google Workspace (Drive, Calendar, Meet), developer APIs, and webhooks. More integrations are on the roadmap." },
      { question: "Can I build custom integrations?", answer: "Yes. Our RESTful APIs and webhook system allow you to build any custom integration your team needs." },
    ],
    ctaHeading: "Unify your team's workspace.",
  },

  // ─── 15. Mobile Responsive ───
  {
    slug: "mobile-responsive",
    category: "Productivity",
    headingBefore: "Work from anywhere with",
    headingHighlight: "mobile-responsive design.",
    subtitle: "Access your full workspace from any device. The responsive interface adapts perfectly to phones, tablets, and desktops.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Responsive", heading: "Perfect on every screen size.", description: "The workspace adapts seamlessly to any device. Read messages, share files, and manage channels from your phone just as easily as your desktop.", imageSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", imageAlt: "Mobile responsive", bgVariant: "white" },
      { layout: "content-left", badge: "On the Go", heading: "Stay productive from anywhere.", description: "Push notifications, quick replies, and full channel access ensure you never miss a beat — whether you're commuting, traveling, or working remotely.", imageSrc: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80", imageAlt: "Mobile productivity", bgVariant: "gray" },
    ],
    statsHeadline: "Anywhere. Anytime. Any Device.",
    statsSubtitle: "Your workspace is always within reach.",
    stats: [
      { iconPaths: ICON.monitor, title: "Adaptive UI", description: "Fully responsive interface that looks and works great on every screen size." },
      { iconPaths: ICON.bell, title: "Push Notifications", description: "Real-time push notifications on mobile keep you in the loop." },
      { iconPaths: ICON.zap, title: "Fast Performance", description: "Optimized for mobile networks with minimal data usage." },
    ],
    faq: [
      { question: "Is there a mobile app?", answer: "The web app is fully responsive and works perfectly in mobile browsers. A native app is on the roadmap." },
      { question: "Do I get notifications on mobile?", answer: "Yes. Push notifications work across all modern mobile browsers." },
    ],
    ctaHeading: "Work from anywhere with Workholo.",
  },

  // ─── 16. SSO ───
  {
    slug: "sso",
    category: "Enterprise Security",
    headingBefore: "Secure login with",
    headingHighlight: "Single Sign-On.",
    subtitle: "Integrate with your existing identity provider for seamless, secure authentication across your organization.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Contact Sales",
    sections: [
      { layout: "image-left", badge: "Identity", heading: "One login for everything.", description: "Connect Workholo to your existing identity provider (SAML, OIDC) for frictionless login. Users authenticate once and access all workspace resources.", imageSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80", imageAlt: "SSO login", bgVariant: "white" },
      { layout: "content-left", badge: "Compliance", heading: "Meet enterprise security requirements.", description: "SSO integration ensures compliance with enterprise security policies, reduces password fatigue, and centralizes access management.", imageSrc: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80", imageAlt: "Compliance", bgVariant: "gray" },
    ],
    statsHeadline: "Secure. Seamless. Compliant.",
    statsSubtitle: "Enterprise authentication made simple.",
    stats: [
      { iconPaths: ICON.lock, title: "SAML & OIDC", description: "Support for industry-standard SSO protocols." },
      { iconPaths: ICON.shield, title: "Zero Password Fatigue", description: "Users log in once with their corporate credentials." },
      { iconPaths: ICON.users, title: "Centralized Access", description: "Manage all user access from your identity provider." },
    ],
    faq: [
      { question: "What SSO providers are supported?", answer: "Any SAML 2.0 or OIDC-compliant identity provider including Okta, Azure AD, and Google Workspace." },
      { question: "Is SSO available on all plans?", answer: "SSO is available on Enterprise plans. Contact sales for details." },
    ],
    ctaHeading: "Simplify authentication today.",
  },

  // ─── 17. 2FA ───
  {
    slug: "2fa",
    category: "Enterprise Security",
    headingBefore: "Add extra security with",
    headingHighlight: "two-factor authentication.",
    subtitle: "Protect your workspace with TOTP-based two-factor authentication for an extra layer of security on every login.",
    ctaPrimary: "Enable 2FA",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Security Layer", heading: "Double your login security.", description: "Enable TOTP-based 2FA to require a time-based code in addition to passwords. Compatible with Google Authenticator, Authy, and other TOTP apps.", imageSrc: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80", imageAlt: "Two-factor auth", bgVariant: "white" },
      { layout: "content-left", badge: "Admin Enforcement", heading: "Enforce 2FA organization-wide.", description: "Admins can require 2FA for all users, ensuring every account in the workspace meets your security standards.", imageSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80", imageAlt: "Admin enforcement", bgVariant: "gray" },
    ],
    statsHeadline: "Protected. Enforced. Reliable.",
    statsSubtitle: "Two-factor authentication that keeps your team secure.",
    stats: [
      { iconPaths: ICON.lock, title: "TOTP Standard", description: "Industry-standard time-based one-time passwords." },
      { iconPaths: ICON.shield, title: "Organization-Wide", description: "Admins can enforce 2FA for every user in the workspace." },
      { iconPaths: ICON.settings, title: "Recovery Codes", description: "Backup recovery codes ensure users never get locked out." },
    ],
    faq: [
      { question: "What authenticator apps are supported?", answer: "Any TOTP-compliant app including Google Authenticator, Authy, 1Password, and Microsoft Authenticator." },
      { question: "What if I lose my device?", answer: "Recovery codes are provided during setup. Admins can also reset 2FA for any user." },
    ],
    ctaHeading: "Protect your workspace with 2FA.",
  },

  // ─── 18. Data Encryption ───
  {
    slug: "data-encryption",
    category: "Enterprise Security",
    headingBefore: "Protect your data with",
    headingHighlight: "256-bit encryption.",
    subtitle: "All data is encrypted at rest and in transit with AES-256 encryption, meeting the highest enterprise security standards.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Security Docs",
    sections: [
      { layout: "image-left", badge: "At Rest", heading: "Data encrypted in storage.", description: "All messages, files, and metadata are encrypted at rest using AES-256 encryption. Your data is secure even in the unlikely event of physical access to storage.", imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", imageAlt: "Data encryption", bgVariant: "white" },
      { layout: "content-left", badge: "In Transit", heading: "Secure every connection.", description: "TLS 1.3 encryption protects all data in transit. Every API call, message, and file transfer is encrypted end-to-end.", imageSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80", imageAlt: "Transit encryption", bgVariant: "gray" },
    ],
    statsHeadline: "Encrypted. Certified. Trusted.",
    statsSubtitle: "Enterprise-grade encryption for all your data.",
    stats: [
      { iconPaths: ICON.lock, title: "AES-256 Encryption", description: "Military-grade encryption for all stored data." },
      { iconPaths: ICON.shield, title: "TLS 1.3", description: "Latest transport layer security for all connections." },
      { iconPaths: ICON.file, title: "File Encryption", description: "Every uploaded file is individually encrypted before storage." },
    ],
    faq: [
      { question: "What encryption standard is used?", answer: "AES-256 for data at rest and TLS 1.3 for data in transit — the same standards used by banks and governments." },
      { question: "Is data encrypted per-tenant?", answer: "Yes. Each organization's data is encrypted with unique keys for maximum isolation." },
    ],
    ctaHeading: "Your data, fully encrypted.",
  },

  // ─── 19. Audit Logs ───
  {
    slug: "audit-logs",
    category: "Enterprise Security",
    headingBefore: "Track activity with",
    headingHighlight: "comprehensive audit logs.",
    subtitle: "Monitor every action in your workspace with detailed audit logs for compliance, security, and operational visibility.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    sections: [
      { layout: "image-left", badge: "Tracking", heading: "Every action recorded.", description: "Login events, permission changes, channel modifications, and admin actions are all logged with timestamps, IP addresses, and user details.", imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", imageAlt: "Audit logs", bgVariant: "white" },
      { layout: "content-left", badge: "Compliance", heading: "Ready for regulatory audits.", description: "Export audit logs in standard formats for compliance reporting. Meet requirements for HIPAA, SOC 2, GDPR, and other regulatory frameworks.", imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80", imageAlt: "Compliance audit", bgVariant: "gray" },
    ],
    statsHeadline: "Transparent. Compliant. Detailed.",
    statsSubtitle: "Complete visibility into workspace activity.",
    stats: [
      { iconPaths: ICON.file, title: "Detailed Logs", description: "Every action logged with timestamp, user, IP address, and context." },
      { iconPaths: ICON.search, title: "Searchable History", description: "Filter and search audit logs by user, action type, date, and more." },
      { iconPaths: ICON.shield, title: "Export Ready", description: "Export logs in CSV or JSON for compliance reporting." },
    ],
    faq: [
      { question: "What actions are logged?", answer: "All actions including logins, logouts, permission changes, channel modifications, user management, and admin actions." },
      { question: "How long are audit logs retained?", answer: "Audit logs are retained for 1 year by default. Enterprise plans offer extended retention." },
      { question: "Can I export audit logs?", answer: "Yes. Export in CSV or JSON format for compliance reporting and external analysis." },
    ],
    ctaHeading: "Full accountability for your workspace.",
  },
];

export function getFeaturePageBySlug(slug: string): FeaturePageData | undefined {
  return featurePages.find((p) => p.slug === slug);
}

export function getAllFeatureSlugs(): string[] {
  return featurePages.map((p) => p.slug);
}

export { featurePages };
