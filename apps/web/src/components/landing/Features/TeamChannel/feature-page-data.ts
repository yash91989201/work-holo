/* ═══════════════════════════════════════════════════════
   Feature Page Data — types + slug helper
   ═══════════════════════════════════════════════════════ */

export interface FeatureSection {
  layout: "image-left" | "content-left" | "image-right";
  badge?: string;
  heading: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  bgVariant?: "white" | "gray";
  /** Large bold stat to display below the description (e.g. "100%") */
  stat?: string;
  /** Label under the stat number */
  statLabel?: string;
  /** Small footnote/citation text */
  citation?: string;
  /** Large italic quote text */
  quote?: string;
  /** Author of the quote */
  quoteAuthor?: string;
  /** Role/Title of the author */
  quoteRole?: string;
  /** Team/Organization of the author */
  quoteTeam?: string;
}

export interface FeatureStat {
  iconPaths: string[];
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
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
  heroLayout?: "centered" | "image-right" | "media-preview-badges" | "drag-drop-badges" | "user-management-hero";
  heroImageSrc?: string;
  heroImageAlt?: string;
  heroHasPlayButton?: boolean;
  heroBgClass?: string;
  heroLinksTitle?: string;
  heroLinks?: { text: string; href: string }[];
  sections: FeatureSection[];
  statsHeadline?: string;
  statsSubtitle?: string;
  stats?: FeatureStat[];
  resourceCardsHeadline?: string;
  resourceCards?: {
    imageSrc: string;
    imageAlt: string;
    tag: string;
    title: string;
    linkText: string;
    linkHref: string;
  }[];
  resourceCardsBgClass?: string;
  templatesSection?: {
    heading: string;
    subtitle: string;
    items: {
      id: string;
      title: string;
      description: string;
      imageSrc: string;
    }[];
  };
  faqHeadline?: string;
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
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
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
    category: "DOCUMENT & MEDIA SHARING",
    headingBefore: "Share files and media with your team seamlessly.",
    headingHighlight: "",
    subtitle: "Upload documents, images, or audio and keep everyone in the loop. Collaboration has never been this easy.",
    ctaPrimary: "GET STARTED",
    ctaSecondary: "TALK TO SALES",
    heroLayout: "image-right",
    heroImageSrc: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    heroImageAlt: "Media sharing",
    heroHasPlayButton: true,
    sections: [
      { layout: "image-left", badge: "", heading: "Upload and share documents in a click.", description: "Easily upload PDFs, spreadsheets, or word files and share them with your team. Keep all your important documents in one place.", imageSrc: "https://images.unsplash.com/photo-1490750967868-88cb4ecb0ee0?w=800&q=80", imageAlt: "Upload documents", bgVariant: "white" },
      { layout: "content-left", badge: "MEDIA SHARING", heading: "Share images and audio effortlessly.", description: "Upload pictures, recordings, and other media files to keep your team visually and audibly informed, anytime and anywhere.", linkText: "Learn more about media sharing →", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80", imageAlt: "Share images and audio", bgVariant: "white" },
    ],
    faq: [
      { question: "How do I share documents?", answer: "Click the upload button, select your file, and choose the team or channel you want to share it with." },
      { question: "Can I share images and audio?", answer: "Yes, you can easily share image and audio files within the platform." },
      { question: "Are there any file size limits?", answer: "File size limits depend on your workspace's current subscription plan." },
      { question: "Can I organize my uploads?", answer: "Yes, files can be organized by project, channel, or custom folders." },
      { question: "Is media sharing secure?", answer: "All uploaded files are encrypted and secure." },
    ],
    ctaHeading: "Start sharing files and media with your team for free",
  },

  // ─── 7. Media Preview ───
  {
    slug: "media-preview",
    category: "MEDIA TOOLS",
    headingBefore: "Explore Media Preview Options Instantly",
    headingHighlight: "",
    subtitle: "Preview images, videos, and documents directly without downloading. Stay organized and make collaboration effortless.",
    ctaPrimary: "TRY NOW",
    ctaSecondary: "LEARN MORE",
    heroLayout: "media-preview-badges",
    heroImageAlt: "Media preview options",
    heroBgClass: "bg-[#F3EBE1]",
    sections: [
      { layout: "image-left", badge: "", heading: "Preview media in the right context", description: "Add notes, comments, or context while previewing files without the hassle of downloading or opening new apps.", imageSrc: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&q=80", imageAlt: "Media in context", bgVariant: "white" },
      { layout: "content-left", badge: "", heading: "Access previews from anywhere", description: "Instantly preview files from your device, cloud storage, or external links, all within your workflow.", linkText: "Explore Integrations →", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1542332213-31f87348057f?w=800&q=80", imageAlt: "Access previews", bgVariant: "white" },
      { layout: "image-left", badge: "", heading: "Collaborate on shared media", description: "Work together on images, videos, and documents. Add feedback, highlight sections, and finalize content seamlessly.", imageSrc: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&q=80", imageAlt: "Collaborate on media", bgVariant: "white" },
    ],
    statsHeadline: "Media Preview Options at a glance",
    statsSubtitle: "Quickly access and preview all your images, videos, and documents in one place. Reduce clutter and speed up collaboration with instant media previews.",
    stats: [
      { iconPaths: ICON.file, title: "Instant previews", description: "Preview images, videos, and documents directly in the browser without waiting for downloads or opening external apps." },
      { iconPaths: ICON.globe, title: "Secure and private", description: "All previews are protected. Only authorized users can view your media, keeping sensitive content safe and accessible." },
      { iconPaths: ICON.monitor, title: "Accessible on all devices", description: "View previews seamlessly on desktop, tablet, or mobile. Your media stays consistent and easy to access wherever you are." },
    ],
    resourceCardsHeadline: "Discover Media Preview Options",
    resourceCardsBgClass: "bg-[#F3EBE1]",
    resourceCards: [
      {
        imageSrc: "https://images.unsplash.com/photo-1520967824495-b529aeba26df?w=600&q=80",
        imageAlt: "Tower",
        tag: "Tips",
        title: "Master media previews for faster collaboration",
        linkText: "READ STORY",
        linkHref: "#",
      },
      {
        imageSrc: "https://images.unsplash.com/photo-1504280629986-e3d1ac1d09e5?w=600&q=80",
        imageAlt: "Deer",
        tag: "Guide",
        title: "How to preview videos, images, and documents",
        linkText: "LEARN MORE",
        linkHref: "#",
      },
      {
        imageSrc: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=600&q=80",
        imageAlt: "Wave",
        tag: "Tips",
        title: "Boost teamwork with inline media previews",
        linkText: "READ STORY",
        linkHref: "#",
      },
    ],
    faq: [
      { question: "Which media types can I preview?", answer: "We support a wide range of formats including JPEG, PNG, GIF, MP4, WebM, PDF, and more directly in your browser." },
      { question: "Can I preview media without downloading?", answer: "Yes, you can preview all supported media files entirely within the browser without any extra downloads." },
      { question: "Does this support cloud storage previews?", answer: "Yes, files linked from external cloud storage providers can optionally be previewed if the integration supports it." },
      { question: "Is media preview secure and private?", answer: "Absolutely. All media is encrypted and previews are restricted to authorized users across the channels." },
      { question: "Are there limits to media file size?", answer: "Large videos or excessively large PDFs may require downloading to view fully, depending on your organization's storage limits." },
    ],
    faqHeadline: "Frequently asked questions about media previews",
    ctaHeading: "Enhance collaboration with previews",
  },

  // ─── 8. Drag & Drop ───
  {
    slug: "drag-and-drop",
    category: "FILE MANAGEMENT",
    headingBefore: "Drag and Drop Your Media Effortlessly",
    headingHighlight: "",
    subtitle: "Upload images, files, documents, audio, and more with a simple drag and drop. Collaboration has never been faster or easier.",
    ctaPrimary: "UPLOAD NOW",
    ctaSecondary: "LEARN HOW",
    heroLayout: "drag-drop-badges",
    heroBgClass: "bg-[#F3EBE1]",
    heroImageAlt: "Drag and drop interface preview",
    sections: [
      { layout: "image-left", badge: "", heading: "Drag files into the right spot", description: "Easily upload and share images, documents, audio, and more without extra steps.", imageSrc: "https://images.unsplash.com/photo-1549646401-4c1fa93096e2?w=800&q=80", imageAlt: "Train tracks", bgVariant: "white" },
      { layout: "image-right", badge: "", heading: "Upload from anywhere", description: "Drag files from your computer or cloud storage and start sharing instantly.", linkText: "See Supported Integrations →", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1469539070868-8316a9088523?w=800&q=80", imageAlt: "Landscape path", bgVariant: "white" },
      { layout: "image-left", badge: "", heading: "Collaborate on any file", description: "Share and discuss images, videos, audio, and documents together seamlessly.", imageSrc: "https://images.unsplash.com/photo-1563854746402-463e2d6ae1e6?w=800&q=80", imageAlt: "Walrus on beach", bgVariant: "white" },
    ],
    statsHeadline: "Drag and drop everything in one place",
    statsSubtitle: "Upload images, documents, audio, and more by dragging them into your workspace. Save time and collaborate faster without switching apps.",
    stats: [
      { iconPaths: ICON.download, title: "Drag & Drop simplicity", description: "Easily move images, files, audio, or documents into your workspace with a simple drag and drop.", linkText: "Learn how to drag and drop →", linkHref: "#" },
      { iconPaths: ICON.globe, title: "Secure uploads", description: "All uploads are encrypted and accessible only to authorized users. Keep your files safe while sharing seamlessly." },
      { iconPaths: ICON.globe, title: "Works across devices", description: "Drag and drop files from desktop, mobile, or cloud storage. Your workflow remains uninterrupted everywhere.", linkText: "Try Drag & Drop Now →", linkHref: "#" },
    ],
    resourceCardsHeadline: "Drag and Drop Media Made Simple",
    resourceCardsBgClass: "bg-[#F3EBE1]",
    resourceCards: [
      {
        imageSrc: "https://images.unsplash.com/photo-1520967824495-b529aeba26df?w=600&q=80",
        imageAlt: "How to drag and drop media",
        tag: "Tips",
        title: "How to drag and drop media effortlessly",
        linkText: "READ STORY →",
        linkHref: "#"
      },
      {
        imageSrc: "https://images.unsplash.com/photo-1469539070868-8316a9088523?w=600&q=80",
        imageAlt: "Upload images, audio, files",
        tag: "Guide",
        title: "Upload images, audio, files, and documents",
        linkText: "LEARN MORE →",
        linkHref: "#"
      },
      {
        imageSrc: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
        imageAlt: "Speed up collaboration",
        tag: "Tips",
        title: "Speed up collaboration with drag & drop",
        linkText: "READ STORY →",
        linkHref: "#"
      }
    ],
    faqHeadline: "Frequently asked questions about drag & drop",
    faq: [
      { question: "Can I drag and drop any file type?", answer: "Yes, you can drag and drop images, documents, audio files, and most common formats directly into your workspace." },
      { question: "Do files upload automatically after drag and drop?", answer: "Yes, files begin uploading instantly the moment you release them into the designated area." },
      { question: "Can I drag from cloud storage directly?", answer: "Yes, if your cloud storage is synced locally to your computer, you can drag files straight from your file explorer." },
      { question: "Is drag and drop secure?", answer: "Absolutely. All uploads are fully encrypted and only accessible by authorized users in your workspace." },
      { question: "Are there size limits for drag and drop?", answer: "There are standard storage limits depending on your organization's plan, but most day-to-day files are fully supported." },
    ],
    ctaHeading: "Drag and drop for seamless uploads",
  },

  // ─── 9. User Management ───
  {
    slug: "user-management",
    category: "Team & Admin",
    headingBefore: "User management, directly from one dashboard",
    headingHighlight: "",
    subtitle: "User management allows administrators to control user accounts, permissions, and access levels from one centralized dashboard.",
    ctaPrimary: "REQUEST A DEMO",
    ctaSecondary: "GET STARTED",
    heroLayout: "user-management-hero",
    heroImageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    sections: [
      { layout: "image-left", badge: "COLLABORATING", heading: "Add and manage users quickly", description: "Easily add new users to your system and assign them the correct access level so your team can start working immediately. Huddle to chat live with your team, or record a clip to quickly share updates and feedback.", imageSrc: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80", imageAlt: "Team management", bgVariant: "white" },
      { layout: "image-right", badge: "MANAGING PERMISSIONS", heading: "Control user permissions securely", description: "Assign roles and permissions to users to control what actions they can perform within the system. list. Here, teams can manage tasks, prioritise work, monitor progress and drive accountability.", imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", imageAlt: "Onboarding", bgVariant: "white" },
      { layout: "image-left", badge: "ORGANISING", heading: "Role based user management for better control", description: "Create a canvas to collect and manage project information, including everything from key stakeholders and resources to project timelines and deliverables.", imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80", imageAlt: "Offboarding", bgVariant: "white" },
    ],
    templatesSection: {
      heading: "Simplify user administration",
      subtitle: "Use predefined user management templates to quickly configure roles, permissions, and access policies.",
      items: [
        {
          id: "starter-kit",
          title: "User management starter kit",
          description: "Essentials for keeping projects on track.",
          imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        },
        {
          id: "feedback-tracker",
          title: "User feedback tracker",
          description: "Organize and prioritize user feedback and requests efficiently",
          imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        },
        {
          id: "role-manager",
          title: "Role permission manager",
          description: "Essentials for keeping projects on track.",
          imageSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80",
        },
        {
          id: "admin-dashboard",
          title: "Admin dashboard checklist",
          description: "Essentials for keeping projects on track.",
          imageSrc: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
        }
      ]
    },
    faqHeadline: "Frequently asked questions",
    faq: [
      { question: "What is project management?", answer: "Project management involves organizing and managing resources to complete a specific project successfully." },
      { question: "Is Slack a PM tool?", answer: "While Slack is not primarily a PM tool, it integrates with many project management tools to facilitate communication." },
      { question: "What types of projects can I manage with Slack?", answer: "You can manage a wide variety of collaborative projects, from software launches to marketing campaigns, using dedicated channels and integrations." },
    ],
    ctaHeading: "Manage your team effortlessly.",
  },

  // ─── 10. Role-Based Access ───
  {
    slug: "role-based-access",
    category: "Role Based Access Control",
    headingBefore: "Control user access with",
    headingHighlight: "role-based permissions",
    subtitle: "Manage user permissions across your system. Owners and administrators can grant or restrict access for any team member instantly.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "Talk to Sales",
    heroLayout: "user-management-hero" as const,
    heroImageSrc: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    heroImageAlt: "Role-based access control",
    heroBgClass: "bg-white",
    sections: [
      {
        layout: "image-left" as const,
        heading: "Just press record",
        description: "Admins and owners can instantly grant permissions to team members, allowing them to access features, manage resources, or collaborate with the team securely.",
        bgVariant: "gray" as const,
      },
      {
        layout: "content-left" as const,
        heading: "Sync on any schedule",
        description: "Owners and administrators can control who can access specific tools, dashboards, and data. Permissions can be changed anytime to maintain security.",
        bgVariant: "white" as const,
        stat: "100%",
        statLabel: "control over user access using role-based permissions",
        citation: "* FY24 Customer Tracking Survey, Slack from Salesforce, responses from 46 Slack users, October 2023.",
      },
      {
        layout: "image-left" as const,
        heading: "Play 'em your way",
        description: "Assign roles like Owner, Admin, or Member to control what each user can see and do inside your platform.",
        bgVariant: "gray" as const,
      },
      {
        layout: "content-left" as const,
        heading: "Quote attribution",
        description: "Hidden heading for structure",
        bgVariant: "white" as const,
        quote: "Our role-based permission system ensures that only the right people have access to critical tools and information across the organization.",
        quoteAuthor: "Ocado Group",
        quoteRole: "System Administrator",
        quoteTeam: "Security & Access Management Team",
      },
    ],
    resourceCardsHeadline: undefined,
    faqHeadline: "Frequently asked questions",
    faq: [
      { question: "What are role-based permissions?", answer: "Role-based permissions allow administrators to assign specific access levels to users based on their role, ensuring only the right people can access sensitive data and features." },
      { question: "Who can manage user permissions?", answer: "Workspace owners and administrators can manage user permissions. They can grant, restrict, or revoke access for any team member at any time." },
      { question: "Can permissions be updated anytime?", answer: "Yes. Permissions can be updated instantly from the admin dashboard. Changes take effect immediately without requiring users to log out." },
      { question: "Why is role-based access important?", answer: "Role-based access ensures data security, compliance, and productivity by making sure team members only access systems and features relevant to their work." },
    ],
    ctaHeading: "Secure your workspace with role-based access.",
  },

  // ─── 11. Workspace Control ───
  {
    slug: "workspace-control",
    category: "ORGANIZATION MANAGEMENT",
    headingBefore: "Organize your work",
    headingHighlight: "inside one Organization",
    subtitle: "The owner can create an organization and manage channels, structured teams, and members. Keep everything of your Dialer Team App organized in one place.",
    heroLinksTitle: "Learn how administrators manage users by:",
    heroLinks: [
      { text: "ADDING USERS", href: "#" },
      { text: "MANAGING PERMISSIONS", href: "#" },
      { text: "ORGANISING ROLES", href: "#" },
    ],
    ctaPrimary: "Get Started",
    ctaSecondary: "Talk to Sales",
    heroLayout: "user-management-hero" as const,
    heroImageSrc: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&q=80",
    heroImageAlt: "Organization management",
    heroBgClass: "bg-[#f5f0e8]",
    sections: [
      {
        layout: "image-left" as const,
        heading: "Create an organization for your team",
        description: "Owners can create an organization to keep all channels, structured teams, and resources of your Dialer Team App in one place.",
        imageSrc: "https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=800&q=80", // Machu Picchu
        imageAlt: "Machu Picchu mist",
        bgVariant: "white" as const,
      },
      {
        layout: "content-left" as const,
        heading: "Add channels and structured teams",
        description: "Within an organization, channels can be created and members assigned to specific teams for organized collaboration.",
        linkText: "Learn more about managing teams",
        linkHref: "#",
        imageSrc: "https://images.unsplash.com/photo-1543716627-839b56ec42e3?w=800&q=80", // Grand Central
        imageAlt: "Busy station hall",
        bgVariant: "white" as const,
      },
      {
        layout: "image-left" as const,
        heading: "Centralized work management",
        description: "Keep all communications, tasks, and shared resources centralized inside your organization for better productivity and oversight.",
        imageSrc: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80", // Train tracks
        imageAlt: "Train tracks at sunset",
        bgVariant: "white" as const,
      },
    ],
    statsHeadline: "Centralize your organization",
    statsSubtitle: "Create an organization to structure channels, assign teams, and keep all resources of your Dialer Team App together in one centralized workspace.",
    stats: [
      {
        iconPaths: [
          "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        ],
        title: "Create an organization",
        description: "Owners can create an organization to keep all channels, teams, and resources under one roof.",
        linkText: "Learn about organizations",
      },
      {
        iconPaths: [
          "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0V3m9 9H3",
        ],
        title: "Manage channels and teams",
        description: "Inside the organization, channels and structured teams can be created for better collaboration.",
      },
      {
        iconPaths: [
          "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0V3m9 9H3m1-7.5l-2 2-2-2m-3 5l2 2 2-2",
        ],
        title: "Centralized work management",
        description: "Keep all Dialer Team App resources, channels, and team communication organized in one place.",
        linkText: "Get started with organizations",
      },
    ],
    resourceCardsHeadline: "Manage your organization efficiently",
    resourceCards: [
      {
        tag: "Tips",
        title: "How to create an organization",
        imageSrc: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
        imageAlt: "Admin creating organization",
        linkText: "READ STORY",
        linkHref: "#",
      },
      {
        tag: "Guide",
        title: "Structure channels and teams effectively",
        imageSrc: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&q=80",
        imageAlt: "Team structure diagram",
        linkText: "LEARN MORE",
        linkHref: "#",
      },
      {
        tag: "Tips",
        title: "Keep all Dialer Team App resources centralized",
        imageSrc: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        imageAlt: "Centralized resources landscape",
        linkText: "READ STORY",
        linkHref: "#",
      },
    ],
    faqHeadline: "Frequently asked questions",
    faq: [
      { question: "How do I create a new organization?", answer: "Owners can create a new organization directly from the admin dashboard by following the setup wizard." },
      { question: "Can I add channels inside an organization?", answer: "Yes, once an organization is created, you can add as many public or private channels as needed." },
      { question: "How do I assign members to structured teams?", answer: "Admins can invite members and assign them to specific teams or channels within the organization settings." },
      { question: "Can I manage multiple teams in one organization?", answer: "Absolutely. Organizations are designed to house multiple teams with different access levels and resources." },
      { question: "Is it possible to reorganize channels later?", answer: "Yes, you can rename, archive, or move channels anytime to keep your workspace organized." },
    ],
    ctaHeading: "Centralize your Dialer Team App workflow",
  },

  // ─── 12. Admin Dashboard ───
  {
    slug: "admin-dashboard",
    category: "TASK LISTS",
    headingBefore: "Create and manage team channels from the",
    headingHighlight: "admin dashboard",
    subtitle: "Admins can create channels for teams, add members to collaborate, remove users when needed and monitor conversations to keep communication organized.",
    ctaPrimary: "GET STARTED",
    ctaSecondary: "TALK TO SALES",
    heroLayout: "user-management-hero", // Using this for central layout + buttons
    sections: [
      { layout: "image-left", badge: "Overview", heading: "Create channels for every team", description: "Admins can create dedicated channels for different teams such as sales, marketing or support so that conversations stay organized and easy to manage.", linkText: "Learn how admins create team channels", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&q=80", imageAlt: "Create channels", bgVariant: "white" },
      { layout: "content-left", badge: "Actions", heading: "Add and remove members easily", description: "Admins can invite members into channels to start collaboration and remove members whenever access is no longer required.", imageSrc: "https://images.unsplash.com/photo-1549213783-8284d03d6c4f?w=800&q=80", imageAlt: "Manage members", bgVariant: "gray" },
      { layout: "image-left", badge: "Triage", heading: "Collect, automate and triage requests", description: "Admins can access team channel chats to monitor discussions, track activity and ensure smooth communication across teams.", linkText: "See how admins monitor team channels", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1503095396549-807759c4bc0e?w=800&q=80", imageAlt: "Triage requests", bgVariant: "white", quote: "'Channel management makes it easy for our admins to organize team communication and ensure that the right members are in the right conversations.'", quoteAuthor: "System Administrator", quoteRole: "Collaboration Platform Manager" },
    ],
    statsHeadline: "Visibility. Control. Efficiency.",
    statsSubtitle: "Everything an admin needs in a single view.",
    stats: [
      { iconPaths: ICON.monitor, title: "Real-Time Analytics", description: "Live dashboards showing user activity, channel usage, and system health." },
      { iconPaths: ICON.users, title: "User Management", description: "Add, remove, and manage user roles directly from the dashboard." },
      { iconPaths: ICON.settings, title: "Quick Actions", description: "Common admin tasks accessible with one click from the overview." },
    ],
    templatesSection: {
      heading: "Channel management works for every team in your organization",
      subtitle: "Admins can organize teams into channels so members can communicate, collaborate and stay aligned in one place.",
      items: [
        { id: "create-channel", title: "Create Channel", description: "Admins can create dedicated channels for different teams to organize communication and collaboration.", imageSrc: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" },
        { id: "add-members", title: "Add Members", description: "Invite team members to channels to start collaborating immediately.", imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
        { id: "remove-members", title: "Remove Members", description: "Easily manage channel participation by removing members when needed.", imageSrc: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
      ],
    },
    faqHeadline: "Frequently asked questions",
    faq: [
      { question: "Can admins create team channels?", answer: "Yes, admins have full control over channel creation to keep the workspace organized." },
      { question: "Can admins add members to channels?", answer: "Yes, admins can invite any team member to any channel to facilitate collaboration." },
      { question: "Can admins remove members from channels?", answer: "Yes, admins can manage channel membership at any time." },
      { question: "Can admins view channel chats?", answer: "Admins can monitor channel activity to ensure security and organizational compliance." },
      { question: "Why is channel management important?", answer: "Effective channel management reduces noise, improves focus, and ensures information reaches the right people." },
    ],
    ctaHeading: "Manage team communication with powerful channel controls",
  },

  // ─── 13. Structured Communication ───
  {
    slug: "structured-comm",
    category: "TEAM COLLABORATION",
    headingBefore: "Organize team collaboration with",
    headingHighlight: "Admin",
    subtitle: "Admin can create channels, assign members to specific channels, and structure teams effectively for better collaboration and organized work.",
    ctaPrimary: "GET STARTED",
    ctaSecondary: "TALK TO SALES",
    heroLayout: "user-management-hero",
    heroBgClass: "bg-[#F3EDE4]",
    sections: [
      { layout: "image-right", badge: "Structure", heading: "Create channels for structured work", description: "Admins can create channels for teams or projects and ensure conversations stay organized and accessible.", bgVariant: "white" },
      { layout: "image-left", badge: "Clarity", heading: "Assign members to channels", description: "Add members to specific channels so everyone is in the right place at the right time.", linkText: "Learn more about channel assignments", linkHref: "#", bgVariant: "white" },
      { layout: "content-left", badge: "Clarity", heading: "Collaborate and manage efficiently", description: "Admins and team members can collaborate within channels, share files, and manage tasks effectively for better productivity.", bgVariant: "white" },
    ],
    statsHeadline: "Organize your team with channels",
    statsSubtitle: "Admins can structure teams by creating channels, assigning members, and maintaining a clear flow of communication. Work becomes organized, searchable, and more productive.",
    stats: [
      { iconPaths: ICON.download, title: "Create and manage channels", description: "Admins can create specific channels for projects or teams, ensuring conversations and resources stay organized.", linkText: "Learn about channels", linkHref: "#" },
      { iconPaths: ICON.globe, title: "Assign members effectively", description: "Admins can add specific members to channels, ensuring the right people are in the right conversations and nothing gets lost." },
      { iconPaths: ICON.globe, title: "Structured teamwork", description: "Channels and member assignments help teams collaborate better, keep track of tasks, and maintain organized workflows.", linkText: "Get started with admin tools", linkHref: "#" },
    ],
    resourceCardsHeadline: "Take control of team collaboration",
    resourceCards: [
      { tag: "Tips", title: "How to assign members to specific channels", linkText: "READ STORY", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1495433334492-45243431f683?w=800&q=80", imageAlt: "Member assignments" },
      { tag: "Guide", title: "Creating structured teams for better collaboration", linkText: "LEARN MORE", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=800&q=80", imageAlt: "Structured teams" },
      { tag: "Tips", title: "Maximize teamwork with Admin tools", linkText: "READ STORY", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80", imageAlt: "Admin tools" },
    ],
    faqHeadline: "Frequently asked questions",
    faq: [
      { question: "How do I create a new channel?", answer: "Admins can create new channels through the admin dashboard by selecting 'Add Channel' and providing a name and description." },
      { question: "Can I assign members to multiple channels?", answer: "Yes, members can be part of as many channels as needed to facilitate their work across different teams and projects." },
      { question: "How do I organize teams effectively?", answer: "Use dedicated channels for specific projects, departments, or topics to keep conversations focused and information easy to find." },
      { question: "Is there a way to track channel activity?", answer: "Yes, admins can monitor channel participation and activity levels to ensure optimal team engagement." },
      { question: "Can I restructure channels after creation?", answer: "Yes, you can rename, archive, or move channels anytime to keep your workspace organized." },
    ],
    ctaHeading: "Empower your team with structured collaboration",
  },

  // ─── 14. Centralized Workspace ───
  {
    slug: "centralized-workspace",
    category: "ORGANIZATION MANAGEMENT",
    headingBefore: "Organize your work inside one",
    headingHighlight: "Organization",
    subtitle: "The owner can create an organization and manage channels, structured teams, and members. Keep everything of your Dialer Team App organized in one place.",
    ctaPrimary: "GET STARTED",
    ctaSecondary: "TALK TO SALES",
    heroLayout: "user-management-hero",
    heroBgClass: "bg-[#F3EDE4]",
    sections: [
      { layout: "image-right", badge: "Organization", heading: "Create an organization for your team", description: "Owners can create an organization to keep all channels, structured teams, and resources of your Dialer Team App in one place.", bgVariant: "white" },
      { layout: "image-left", badge: "Structure", heading: "Add channels and structured teams", description: "Within an organization, channels can be created and members assigned to specific teams for organized collaboration.", linkText: "Learn more about managing teams", linkHref: "#", bgVariant: "white" },
      { layout: "content-left", badge: "Management", heading: "Centralized work management", description: "Keep all communications, tasks, and shared resources centralized inside your organization for better productivity and oversight.", bgVariant: "white" },
    ],
    statsHeadline: "Centralize your organization",
    statsSubtitle: "Create an organization to structure channels, assign teams, and keep all resources of your Dialer Team App together in one centralized workspace.",
    stats: [
      { iconPaths: ICON.download, title: "Create an organization", description: "Owners can create an organization to keep all channels, teams, and resources under one roof.", linkText: "Learn about organizations", linkHref: "#" },
      { iconPaths: ICON.globe, title: "Manage channels and teams", description: "Inside the organization, channels and structured teams can be created for better collaboration." },
      { iconPaths: ICON.globe, title: "Centralized work management", description: "Keep all Dialer Team App resources, channels, and team communication organized in one place.", linkText: "Get started with organizations", linkHref: "#" },
    ],
    resourceCardsHeadline: "Manage your organization efficiently",
    resourceCards: [
      { tag: "Tips", title: "How to create an organization", linkText: "READ STORY", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1495433334492-45243431f683?w=800&q=80", imageAlt: "Create organization" },
      { tag: "Guide", title: "Structure channels and teams effectively", linkText: "LEARN MORE", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=800&q=80", imageAlt: "Structure teams" },
      { tag: "Tips", title: "Keep all Dialer Team App resources centralized", linkText: "READ STORY", linkHref: "#", imageSrc: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80", imageAlt: "Resources" },
    ],
    faqHeadline: "Frequently asked questions",
    faq: [
      { question: "How do I create a new organization?", answer: "Owners can create a new organization from the admin dashboard. Simply provide an organization name and invite your team members to get started." },
      { question: "Can I add channels inside an organization?", answer: "Yes, channels can be created within an organization to facilitate team discussions, project coordination, and resource sharing." },
      { question: "How do I assign members to structured teams?", answer: "Within your organization, you can create teams and assign members to specific roles and channels for organized collaboration." },
      { question: "Can I manage multiple teams in one organization?", answer: "Yes, your organization can contain multiple structured teams, each with their own channels and member assignments." },
      { question: "Is it possible to reorganize channels later?", answer: "Yes, administrators can rename, move, or restructure channels at any time to keep the workspace organized." },
    ],
    ctaHeading: "Centralize your Dialer Team App workflow",
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
