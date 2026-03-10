import { Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { Image } from "@/components/shared/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  hasDropdown?: boolean;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "/", hasDropdown: true },
  { label: "Solutions", href: "/", hasDropdown: true },
  { label: "BPO Services", href: "/", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
];

interface BpoCategory {
  items: { label: string; href: string }[];
  title?: string;
  titleColor?: string;
}

const bpoCategories: BpoCategory[] = [
  {
    title: "Outbound Services",
    titleColor: "text-[#6366f1]",
    items: [
      { label: "Customer Retention", href: "/bpo/customer-retention" },
      { label: "Outbound Sales", href: "/bpo/outbound-sales" },
      { label: "Lead Generation", href: "/bpo/lead-generation" },
    ],
  },
  {
    title: "Inbound Services",
    titleColor: "text-[#6366f1]",
    items: [
      { label: "Customer Service", href: "/bpo/customer-service" },
      { label: "Technical Support", href: "/bpo/technical-support" },
      { label: "Payment Processing", href: "/bpo/payment-processing" },
    ],
  },
  {
    items: [
      {
        label: "Accounting and Collections",
        href: "/bpo/accounting-and-collections",
      },
      { label: "Inbound Sales", href: "/bpo/inbound-sales" },
      {
        label: "Facility and Procurement",
        href: "/bpo/facility-and-procurement",
      },
    ],
  },
  {
    items: [
      {
        label: "Direct Response Marketing",
        href: "/bpo/direct-response-marketing",
      },
      {
        label: "Back Office Processing",
        href: "/bpo/back-office-processing",
      },
      { label: "Claims Processing", href: "/bpo/claims-processing" },
    ],
  },
  {
    title: "INDUSTRIES",
    titleColor: "text-foreground font-bold",
    items: [
      {
        label: "Healthcare & Life Sciences",
        href: "/bpo/healthcare-life-sciences",
      },
      {
        label: "Banking & Financial Services",
        href: "/bpo/banking-financial-services",
      },
      { label: "Retail & E-commerce", href: "/bpo/retail-ecommerce" },
      {
        label: "Technology & Telecom",
        href: "/bpo/technology-telecom",
      },
      {
        label: "Travel & Hospitality",
        href: "/bpo/travel-hospitality",
      },
      {
        label: "Manufacturing & Logistics",
        href: "/bpo/manufacturing-logistics",
      },
    ],
  },
];

const featuresCategories = [
  {
    title: "Core Communication",
    items: [
      {
        label: "Team Channels",
        desc: "Organized department channels",
        href: "/features/team-channels",
      },
      {
        label: "Direct Messaging",
        desc: "1-on-1 private chat",
        href: "/features/direct-messaging",
      },
      {
        label: "Real-Time Messaging",
        desc: "Instant team communication",
        href: "/features/real-time-messaging",
      },
      {
        label: "Message History",
        desc: "Searchable past conversations",
        href: "/features/message-history",
      },
      {
        label: "@Mentions",
        desc: "Instant team notifications",
        href: "/features/mentions",
      },
    ],
  },
  {
    title: "Media & Attachments",
    items: [
      {
        label: "File Sharing",
        desc: "Share documents and media",
        href: "/features/file-sharing",
      },
      {
        label: "Media Preview",
        desc: "Preview images and videos",
        href: "/features/media-preview",
      },
      {
        label: "Drag & Drop",
        desc: "Easy file uploads",
        href: "/features/drag-and-drop",
      },
    ],
  },
  {
    title: "Team & Admin Management",
    items: [
      {
        label: "User Management",
        desc: "Create and delete users",
        href: "/features/user-management",
      },
      {
        label: "Role-Based Access",
        desc: "Granular team permissions",
        href: "/features/role-based-access",
      },
      {
        label: "Workspace Control",
        desc: "Manage your entire team",
        href: "/features/workspace-control",
      },
      {
        label: "Admin Dashboard",
        desc: "Centralized admin controls",
        href: "/features/admin-dashboard",
      },
    ],
  },
  {
    title: "Productivity",
    items: [
      {
        label: "Structured Comm",
        desc: "Organized team collaboration",
        href: "/features/structured-comm",
      },
      {
        label: "Centralized Workspace",
        desc: "Everything in one place",
        href: "/features/centralized-workspace",
      },
      {
        label: "Mobile Responsive",
        desc: "Work from anywhere",
        href: "/features/mobile-responsive",
      },
    ],
  },
  {
    title: "Enterprise Security",
    items: [
      {
        label: "Single Sign-On (SSO)",
        desc: "Secure enterprise login",
        href: "/features/sso",
      },
      {
        label: "Two-Factor Auth",
        desc: "Extra layer of security",
        href: "/features/2fa",
      },
      {
        label: "Data Encryption",
        desc: "256-bit secure encryption",
        href: "/features/data-encryption",
      },
      {
        label: "Audit Logs",
        desc: "Track workspace activity",
        href: "/features/audit-logs",
      },
    ],
  },
];

const solutionsCategories = [
  {
    title: "BY DEPARTMENT",
    items: [
      { label: "Customer service", href: "/solutions/customer-service" },
      { label: "Sales", href: "/solutions/sales" },
      { label: "Human Resources", href: "/solutions/hr" },
    ],
  },
  {
    title: "BY INDUSTRY",
    items: [
      { label: "Manufacturing", href: "/solutions/manufacturing" },
      { label: "Technology", href: "/solutions/technology" },
      { label: "Small business", href: "/solutions/small-business" },
      { label: "Financial services", href: "/solutions/financial-services" },
      { label: "Retail", href: "/solutions/retail" },
      { label: "Health and life sciences", href: "/solutions/health" },
    ],
  },
];

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileBpoOpen, setMobileBpoOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = useCallback((label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full py-3">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-border/60 bg-background/95 px-5 py-2.5 shadow-sm backdrop-blur-sm sm:px-8">
          {/* Logo */}
          <Link className="flex shrink-0 items-center gap-2.5" to="/">
            <Image
              alt="Workholo logo"
              height={32}
              src="/logo.webp"
              width={32}
            />
            <span className="font-bold text-xl">Workholo</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {navItems.map((item) => (
              <div
                className="relative"
                key={item.label}
                onMouseEnter={() =>
                  item.hasDropdown ? openDropdown(item.label) : undefined
                }
                onMouseLeave={scheduleClose}
              >
                <Link
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-sm transition-colors",
                    activeDropdown === item.label
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                  to={item.href}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg
                      className={cn(
                        "transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )}
                      fill="none"
                      height="14"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              className="rounded-md px-5 font-semibold text-sm uppercase tracking-wide"
              size="default"
              variant="outline"
            >
              Request a Demo
            </Button>
            <Button
              className="rounded-md bg-[#7C5CFF] px-5 font-semibold text-sm uppercase tracking-wide"
              size="default"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? (
              <svg
                fill="none"
                height="26"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                fill="none"
                height="26"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </nav>

        {/* BPO Mega Dropdown (desktop) */}
        <div
          className={cn(
            "absolute right-0 left-0 z-40 origin-top px-4 transition-all duration-200 sm:px-6 lg:px-8",
            activeDropdown === "BPO Services"
              ? "pointer-events-auto scale-y-100 opacity-100"
              : "pointer-events-none scale-y-95 opacity-0"
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mt-1 rounded-2xl border border-border/60 bg-background shadow-xl">
              <div className="grid grid-cols-5 gap-x-6 px-8 py-7">
                {bpoCategories.map((category) => (
                  <div key={category.title ?? category.items[0].label}>
                    {category.title && (
                      <h4
                        className={cn(
                          "mb-4 font-semibold text-md uppercase tracking-wider",
                          category.titleColor ?? "text-[#6366f1]"
                        )}
                      >
                        {category.title}
                      </h4>
                    )}
                    <ul className="space-y-2.5">
                      {category.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            className="block text-foreground/70 text-md transition-colors hover:text-[#6366f1]"
                            onClick={() => setActiveDropdown(null)}
                            to={item.href}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Mega Dropdown (desktop) */}
        <div
          className={cn(
            "absolute right-0 left-0 z-40 origin-top px-4 transition-all duration-200 sm:px-6 lg:px-8",
            activeDropdown === "Features"
              ? "pointer-events-auto scale-y-100 opacity-100"
              : "pointer-events-none scale-y-95 opacity-0"
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mt-1 rounded-2xl border border-border/60 bg-background p-8 pb-6 shadow-xl">
              <div className="grid grid-cols-4 gap-x-8">
                {/* Column 1: Core Communication & Media */}
                <div className="space-y-8">
                  {[featuresCategories[0], featuresCategories[1]].map(
                    (category) => (
                      <div key={category.title}>
                        <h4 className="mb-4 font-bold text-foreground/80 text-xs uppercase tracking-wider">
                          {category.title}
                        </h4>
                        <ul className="space-y-4">
                          {category.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                className="group block"
                                onClick={() => setActiveDropdown(null)}
                                to={item.href as any}
                              >
                                <div className="font-semibold text-foreground text-sm transition-colors group-hover:text-[#6366f1]">
                                  {item.label}
                                </div>
                                <div className="mt-0.5 text-foreground/60 text-xs">
                                  {item.desc}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>

                {/* Column 2: Team Admin & Productivity */}
                <div className="space-y-8">
                  {[featuresCategories[2], featuresCategories[3]].map(
                    (category) => (
                      <div key={category.title}>
                        <h4 className="mb-4 font-bold text-foreground/80 text-xs uppercase tracking-wider">
                          {category.title}
                        </h4>
                        <ul className="space-y-4">
                          {category.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                className="group block"
                                onClick={() => setActiveDropdown(null)}
                                to={item.href as any}
                              >
                                <div className="font-semibold text-foreground text-sm transition-colors group-hover:text-[#6366f1]">
                                  {item.label}
                                </div>
                                <div className="mt-0.5 text-foreground/60 text-xs">
                                  {item.desc}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>

                {/* Column 3: Enterprise Security */}
                <div className="space-y-8">
                  {[featuresCategories[4]].map((category) => (
                    <div key={category.title}>
                      <h4 className="mb-4 font-bold text-foreground/80 text-xs uppercase tracking-wider">
                        {category.title}
                      </h4>
                      <ul className="space-y-4">
                        {category.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              className="group block"
                              onClick={() => setActiveDropdown(null)}
                              to={item.href as any}
                            >
                              <div className="font-semibold text-foreground text-sm transition-colors group-hover:text-[#6366f1]">
                                {item.label}
                              </div>
                              <div className="mt-0.5 text-foreground/60 text-xs">
                                {item.desc}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Column 4: Marketplace */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="mb-4 font-bold text-foreground/80 text-xs uppercase tracking-wider">
                      Workholo Marketplace
                    </div>
                    <Link
                      className="group mb-4 block"
                      onClick={() => setActiveDropdown(null)}
                      to={"/marketplace" as any}
                    >
                      <div className="relative mb-4 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 via-[#10245e] to-[#040e29] shadow-sm transition-transform group-hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
                        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                          <div className="absolute inset-0 rounded-full bg-blue-400/20 backdrop-blur-md" />
                          <div className="relative z-10 h-6 w-6 rounded-full bg-gradient-to-b from-blue-200 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.9)]" />
                        </div>
                      </div>
                      <p className="mb-3 text-foreground/80 text-sm leading-relaxed">
                        Find new agents and apps that fit your team's needs.
                      </p>
                      <span className="flex items-center gap-1 font-semibold text-[#6366f1] text-sm transition-all group-hover:gap-1.5">
                        Browse marketplace{" "}
                        <span aria-hidden="true">&rarr;</span>
                      </span>
                    </Link>
                  </div>

                  <div className="space-y-4 pb-1">
                    <Link
                      className="block font-semibold text-foreground/80 text-sm transition-colors hover:text-[#6366f1]"
                      onClick={() => setActiveDropdown(null)}
                      to={"/what-is-workholo" as any}
                    >
                      What is Workholo?
                    </Link>
                    <Link
                      className="block font-semibold text-foreground/80 text-sm transition-colors hover:text-[#6366f1]"
                      onClick={() => setActiveDropdown(null)}
                      to={"/workholo-vs-email" as any}
                    >
                      Workholo vs email
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer links under Col 1 & 2 */}
              <div className="mt-6 flex items-center gap-6 border-border/60 border-t pt-4">
                <Link
                  className="font-semibold text-[#6366f1] text-sm transition-colors hover:text-[#4f52c1]"
                  onClick={() => setActiveDropdown(null)}
                  to={"/demo" as any}
                >
                  Watch demo
                </Link>
                <Link
                  className="font-semibold text-[#6366f1] text-sm transition-colors hover:text-[#4f52c1]"
                  onClick={() => setActiveDropdown(null)}
                  to={"/download" as any}
                >
                  Download Workholo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Mega Dropdown (desktop) */}
        <div
          className={cn(
            "absolute right-0 left-0 z-40 origin-top px-4 transition-all duration-200 sm:px-6 lg:px-8",
            activeDropdown === "Solutions"
              ? "pointer-events-auto scale-y-100 opacity-100"
              : "pointer-events-none scale-y-95 opacity-0"
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mt-1 rounded-2xl border border-border/60 bg-background p-8 pb-6 shadow-xl">
              <div className="grid grid-cols-3 gap-x-8">
                {/* Column 1 & 2: Categories */}
                {solutionsCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="mb-4 font-bold text-foreground/80 text-xs uppercase tracking-wider">
                      {category.title}
                    </h4>
                    <ul className="space-y-4">
                      {category.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            className="group block"
                            onClick={() => setActiveDropdown(null)}
                            to={item.href as any}
                          >
                            <div className="font-semibold text-foreground text-sm transition-colors group-hover:text-[#6366f1]">
                              {item.label}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Column 3: Template Gallery */}
                <div className="flex flex-col">
                  <h4 className="mb-4 font-bold text-foreground/80 text-xs uppercase tracking-wider">
                    TEMPLATE GALLERY
                  </h4>
                  <div className="flex flex-1 flex-col justify-between rounded-xl bg-muted/40 p-6">
                    <div>
                      <div className="mb-4 flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex gap-2">
                            <div className="h-8 w-8 rounded bg-[#7C5CFF]/20" />
                            <div className="h-8 w-8 rounded bg-[#7C5CFF]/40" />
                            <div className="h-8 w-8 rounded bg-[#7C5CFF]/60" />
                          </div>
                          <div className="h-2 w-24 rounded-full bg-muted-foreground/20" />
                        </div>
                      </div>
                      <p className="text-foreground/80 text-sm leading-relaxed">
                        Start work faster with pre-made templates for every
                        task.
                      </p>
                    </div>
                    <Link
                      className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                      onClick={() => setActiveDropdown(null)}
                      to={"/templates" as any}
                    >
                      See all templates <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "mt-2 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-lg transition-all duration-200 lg:hidden",
            mobileMenuOpen
              ? "max-h-[800px] opacity-100"
              : "max-h-0 border-0 opacity-0"
          )}
        >
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) =>
              item.label === "Features" ? (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center justify-between rounded-md px-4 py-2.5 text-base text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
                    type="button"
                  >
                    {item.label}
                    <svg
                      className={cn(
                        "transition-transform duration-200",
                        mobileFeaturesOpen && "rotate-180"
                      )}
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      mobileFeaturesOpen ? "max-h-[1000px]" : "max-h-0"
                    )}
                  >
                    <div className="space-y-4 px-4 py-3">
                      {featuresCategories.map((category) => (
                        <div key={category.title}>
                          <h4 className="mb-2 font-semibold text-foreground/80 text-xs uppercase tracking-wider">
                            {category.title}
                          </h4>
                          <ul className="space-y-1.5">
                            {category.items.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  className="block rounded-md py-1.5 text-foreground/60 text-sm transition-colors hover:text-[#6366f1]"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileFeaturesOpen(false);
                                  }}
                                  to={subItem.href as any}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.label === "BPO Services" ? (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center justify-between rounded-md px-4 py-2.5 text-base text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileBpoOpen(!mobileBpoOpen)}
                    type="button"
                  >
                    {item.label}
                    <svg
                      className={cn(
                        "transition-transform duration-200",
                        mobileBpoOpen && "rotate-180"
                      )}
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      mobileBpoOpen ? "max-h-[600px]" : "max-h-0"
                    )}
                  >
                    <div className="space-y-4 px-4 py-3">
                      {bpoCategories.map((category) => (
                        <div key={category.title ?? category.items[0].label}>
                          {category.title && (
                            <h4
                              className={cn(
                                "mb-2 font-semibold text-xs uppercase tracking-wider",
                                category.titleColor ?? "text-[#6366f1]"
                              )}
                            >
                              {category.title}
                            </h4>
                          )}
                          <ul className="space-y-1.5">
                            {category.items.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  className="block rounded-md py-1.5 text-foreground/60 text-sm transition-colors hover:text-[#6366f1]"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileBpoOpen(false);
                                  }}
                                  to={subItem.href}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.label === "Solutions" ? (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center justify-between rounded-md px-4 py-2.5 text-base text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                    type="button"
                  >
                    {item.label}
                    <svg
                      className={cn(
                        "transition-transform duration-200",
                        mobileSolutionsOpen && "rotate-180"
                      )}
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      mobileSolutionsOpen ? "max-h-[800px]" : "max-h-0"
                    )}
                  >
                    <div className="space-y-4 px-4 py-3">
                      {solutionsCategories.map((category) => (
                        <div key={category.title}>
                          <h4 className="mb-2 font-semibold text-foreground/80 text-xs uppercase tracking-wider">
                            {category.title}
                          </h4>
                          <ul className="space-y-1.5">
                            {category.items.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  className="block rounded-md py-1.5 text-foreground/60 text-sm transition-colors hover:text-[#6366f1]"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileSolutionsOpen(false);
                                  }}
                                  to={subItem.href as any}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div>
                        <h4 className="mb-2 font-semibold text-foreground/80 text-xs uppercase tracking-wider">
                          TEMPLATE GALLERY
                        </h4>
                        <Link
                          className="block rounded-md py-1.5 text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileSolutionsOpen(false);
                          }}
                          to={"/templates" as any}
                        >
                          See all templates →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  className="flex items-center justify-between rounded-md px-4 py-2.5 text-base text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                  to={item.href as any}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </Link>
              )
            )}
            <div className="mt-2 flex flex-col gap-2.5 border-border border-t pt-4">
              <Button
                className="w-full rounded-full font-semibold text-sm uppercase tracking-wide"
                variant="outline"
              >
                Request a Demo
              </Button>
              <Button className="w-full rounded-full font-semibold text-sm uppercase tracking-wide">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
