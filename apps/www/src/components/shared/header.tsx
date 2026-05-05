import { Link } from "@tanstack/react-router";
import { CTAButton } from "@work-holo/ui/components/cta-button";
import { cn } from "@work-holo/ui/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { Image } from "@/components/shared/image";

import {
  IconArrowUpRight,
  IconBolt,
  IconChevronDown,
  IconClock,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@work-holo/ui/components/navigation-menu";

type DropdownItem = {
  label: string;
  href: string;
  hash?: string;
  description?: string;
};

type NavGroup = {
  title: string;
  items: DropdownItem[];
};

type TabDropdownProps = {
  groups: NavGroup[];
};

function TabDropdown({ groups }: TabDropdownProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[32rem] max-h-[50vh] rounded-[1.5rem] border border-white/10 bg-background/80 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.35)] backdrop-blur-2xl overflow-hidden flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-44 flex flex-col relative border-r border-white/5 p-2 bg-white/5 shrink-0">
        {groups.map((group, idx) => (
          <button
            key={group.title}
            className={cn(
              "text-left px-4 py-3 text-[13px] font-medium tracking-wide transition-all duration-300 z-10 rounded-xl",
              activeTab === idx
                ? "text-foreground bg-white/10"
                : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/5"
            )}
            onClick={() => setActiveTab(idx)}
            onMouseEnter={() => setActiveTab(idx)}
          >
            {group.title}
          </button>
        ))}
      </div>
      <div
        className="flex-1 p-3 overflow-y-auto overscroll-contain"
        onWheel={(e) => {
          if (!isHovered) return;
          e.stopPropagation();
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-1"
          >
            {groups[activeTab]?.items.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
              >
                <MenuLink
                  className="flex flex-col gap-1 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/5 group/item"
                  to={item.href}
                  hash={item.hash}
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <span className="text-[14px] font-medium text-foreground/90 group-hover/item:text-primary transition-colors">
                      {item.label}
                    </span>
                    <IconArrowUpRight className="size-3.5 text-muted-foreground/40 group-hover/item:text-primary/60 transition-colors" />
                  </div>
                  {item.description && (
                    <span className="w-full text-left text-[12px] text-muted-foreground/60 group-hover/item:text-muted-foreground/80 transition-colors">
                      {item.description}
                    </span>
                  )}
                </MenuLink>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type MenuLinkProps = {
  children: ReactNode;
  className?: string;
  hash?: string;
  to: string;
};

type NavItem =
  | {
      label: string;
      href: string;
      hash?: string;
      active?: boolean;
      dropdownItems: DropdownItem[];
      groups?: never;
    }
  | {
      label: string;
      href: string;
      hash?: string;
      active?: boolean;
      dropdownItems?: never;
      groups: NavGroup[];
    }
  | {
      label: string;
      href: string;
      hash?: string;
      active?: boolean;
      dropdownItems?: never;
      groups?: never;
    };

function isSimpleLink(
  item: NavItem,
): item is Extract<NavItem, { dropdownItems?: never; groups?: never }> {
  return !("groups" in item || "dropdownItems" in item);
}

function hasGroups(
  item: NavItem,
): item is Extract<NavItem, { groups: NavGroup[] }> {
  return "groups" in item;
}

function hasDropdownItems(
  item: NavItem,
): item is Extract<NavItem, { dropdownItems: DropdownItem[] }> {
  return "dropdownItems" in item;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    hash: "hero",
    active: true,
    groups: [
      {
        title: "Overview",
        items: [
          {
            label: "Why Choose Us",
            href: "/",
            hash: "why-choose-us",
            description: "What makes us different",
          },
          {
            label: "About",
            href: "/",
            hash: "about",
            description: "Company background",
          },
        ],
      },
      {
        title: "Solutions",
        items: [
          {
            label: "Services",
            href: "/",
            hash: "services",
            description: "What we build",
          },
          {
            label: "Technologies",
            href: "/",
            hash: "technologies",
            description: "Tools and platforms",
          },
          {
            label: "Process",
            href: "/",
            hash: "process",
            description: "How we work",
          },
          {
            label: "Projects",
            href: "/projects",
            hash: "projects",
            description: "Selected work",
          },
        ],
      },
      {
        title: "Company",
        items: [
          {
            label: "Testimonials",
            href: "/",
            hash: "testimonials",
            description: "Client feedback",
          },
          {
            label: "Team",
            href: "/",
            hash: "team",
            description: "People behind the work",
          },
          {
            label: "Insights",
            href: "/",
            hash: "insights",
            description: "Articles and updates",
          },
          {
            label: "Contact",
            href: "/",
            hash: "contact",
            description: "Start a conversation",
          },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    groups: [
      {
        title: "AI Delivery",
        items: [
          {
            label: "Agentic AI",
            href: "/services/agentic-ai",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "AI Agents",
            href: "/services/ai-agents",
            description: "AI agents for product teams",
          },
        ],
      },
      {
        title: "AI First Engineering",
        items: [
          {
            label: "MVP",
            href: "/services/mvp",
            description: "Launch fast, scale with confidence",
          },
          {
            label: "Web App Development",
            href: "/services/web-app-development",
            description: "High-performance, scalable web apps",
          },
          {
            label: "Mobile App Development",
            href: "/services/mobile-app-development",
            description: "Seamless iOS & Android experiences",
          },
          {
            label: "QA & Test Automation",
            href: "/services/qa-test-automation",
            description: "Faster releases, zero-bug quality",
          },
          {
            label: "UX/UI Design",
            href: "/services/ux-ui-design",
            description: "User-first design that drives adoption",
          },
          {
            label: "Data Engineering",
            href: "/services/data-engineering",
            description: "AI-ready data foundations for growth",
          },
        ],
      },
      {
        title: "Cloud",
        items: [
          {
            label: "AWS",
            href: "/services/aws",
            description: "Optimize cost, security & scalability",
          },
          {
            label: "Cloud Engineering & Devops",
            href: "/services/cloud-engineering-devops",
            description: "Automated pipelines, reliable deployments",
          },
        ],
      },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    groups: [
      {
        title: "AI & Automation",
        items: [
          { label: "AI Support Bot", href: "/projects/ai-support-bot" },
          { label: "ML Pipeline", href: "/projects/ml-pipeline" },
          { label: "Chatbot Platform", href: "/projects/chatbot-platform" },
        ],
      },
      {
        title: "Web Development",
        items: [
          { label: "Finflow Dashboard", href: "/projects/finflow-dashboard" },
          { label: "E-commerce Suite", href: "/projects/ecommerce" },
          { label: "SaaS Platform", href: "/projects/saas-platform" },
        ],
      },
      {
        title: "Cloud & DevOps",
        items: [
          { label: "Cloud Sync Platform", href: "/projects/cloud-sync-platform" },
          { label: "CI/CD Pipeline", href: "/projects/cicd-pipeline" },
          { label: "Infrastructure", href: "/projects/infrastructure" },
        ],
      },
    ],
  },
  {
    label: "Our BPO Services",
    href: "/our-bpo-services",
    groups: [
      {
        title: "Solution",
        items: [
          {
            label: "Outbound Services",
            href: "/our-bpo-services/solution/outbound-services",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Customer Retention",
            href: "/our-bpo-services/solution/customer-retention",
            description: "AI agents for product teams",
          },
          {
            label: "Outbound Sales",
            href: "/our-bpo-services/solution/outbound-sales",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Lead Generation",
            href: "/our-bpo-services/solution/lead-generation",
            description: "AI agents for product teams",
          },
          {
            label: "Inbound Services",
            href: "/our-bpo-services/solution/inbound-services",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Customer-Service",
            href: "/our-bpo-services/solution/customer-service",
            description: "AI agents for product teams",
          },
          {
            label: "Technical Support",
            href: "/our-bpo-services/solution/technical-support",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Payment Processing",
            href: "/our-bpo-services/solution/payment-processing",
            description: "AI agents for product teams",
          },
          {
            label: "Account and Collections",
            href: "/our-bpo-services/solution/accounting-and-collections",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Inbound Sales",
            href: "/our-bpo-services/solution/inbound-sales",
            description: "AI agents for product teams",
          },
          {
            label: "Facility and Procurement",
            href: "/our-bpo-services/solution/facility-and-procurement",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Direct Response Marketing",
            href: "/our-bpo-services/solution/direct-response-marketing",
            description: "AI agents for product teams",
          },
          {
            label: "Back Office Processing",
            href: "/our-bpo-services/solution/back-office-processing",
            description: "Autonomous AI for smarter workflows",
          },
          {
            label: "Claims Processing",
            href: "/our-bpo-services/solution/claims-processing",
            description: "AI agents for product teams",
          },
        ],
      },
      {
        title: "Industries",
        items: [
          {
            label: "Insurance",
            href: "/our-bpo-services/industries/insurance",
            description: "Launch fast, scale with confidence",
          },
          {
            label: "Healthcare",
            href: "/our-bpo-services/industries/healthcare",
            description: "High-performance, scalable web apps",
          },
          {
            label: "Financial",
            href: "/our-bpo-services/industries/financial",
            description: "Seamless iOS & Android experiences",
          },
          {
            label: "Logistics and Supply Chain",
            href: "/our-bpo-services/industries/logistics-supply-chain",
            description: "Faster releases, zero-bug quality",
          },
          {
            label: "Retail",
            href: "/our-bpo-services/industries/retail",
            description: "User-first design that drives adoption",
          },
          {
            label: "Telecommunication",
            href: "/our-bpo-services/industries/telecommunications",
            description: "AI-ready data foundations for growth",
          },
          {
            label: "Entertainment",
            href: "/our-bpo-services/industries/entertainment",
            description: "Faster releases, zero-bug quality",
          },
          {
            label: "Real Estate",
            href: "/our-bpo-services/industries/real-estate",
            description: "User-first design that drives adoption",
          },
          {
            label: "Technology",
            href: "/our-bpo-services/industries/technology",
            description: "AI-ready data foundations for growth",
          },
        ],
      },
    ],
  },
  {
    label: "Company",
    dropdownItems: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
];

function MenuLink({ children, className, hash, to }: MenuLinkProps) {
  return (
    <NavigationMenuLink
      className={className}
      render={<Link {...(hash ? { hash } : {})} to={to} />}
    >
      {children}
    </NavigationMenuLink>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextIsScrolled = latest > 20;
    setIsScrolled((current) =>
      current === nextIsScrolled ? current : nextIsScrolled,
    );
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setOpenMobileItem(null);
    }
  }, [mobileMenuOpen]);

  return (
    <motion.header
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50",
        isScrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent",
      )}
      initial={{ y: -100 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Bar */}
      <motion.div
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
        }}
        className="overflow-hidden"
        initial={false}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 text-[15px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconBolt className="size-4.5 text-primary" fill="currentColor" />
              <span className="hidden sm:inline">
                Fast & Reliable IT Solutions.
              </span>
              <Link
                className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
                to="/"
              >
                Join Now
                <IconArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="hidden items-center gap-4 text-muted-foreground md:flex">
              <div className="flex items-center gap-1.5">
                <IconClock className="size-4.5 text-primary" />
                <span>9 am to 6 pm [mon-sat]</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1.5">
                <IconSettings className="size-4.5 text-primary" />
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.div
        className={cn(
          "w-full",
          isScrolled
            ? "max-w-none px-0 pt-0"
            : "mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8",
        )}
        layout
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.nav
          className={cn(
            "relative flex items-center justify-between transition-all duration-500",
            isScrolled
              ? "min-h-20 bg-card/90 px-5 backdrop-blur-md sm:px-7 lg:px-8"
              : "min-h-24 rounded-[1.75rem] border border-border/30 bg-muted/50 px-5 sm:px-7 lg:px-8",
          )}
          layout
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <Link className="flex shrink-0 items-center gap-3" to="/">
            <div className="relative h-12 w-16">
              <Image
                alt="Work Holo"
                className="object-contain"
                height={48}
                src="/logo.webp"
                unoptimized
                width={64}
              />
            </div>
            <span className="font-bold font-heading text-2xl text-foreground tracking-tight">
              Workholo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">
            <NavigationMenu align="center">
              <NavigationMenuList>
                {navItems.map((item) => {
                  let menuContent: ReactNode = null;

                  if (hasGroups(item)) {
                    menuContent = <TabDropdown groups={item.groups} />;
                  } else if (hasDropdownItems(item)) {
                    const hasMany = item.dropdownItems.length > 4;
                    menuContent = (
                      <div className={cn(
                        "rounded-[1.5rem] border border-white/10 bg-background/80 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.35)] backdrop-blur-2xl overflow-hidden",
                        hasMany ? "w-72" : "w-52"
                      )}>
                        <div className="p-2">
                          {item.dropdownItems.map((dropItem) => (
                            <MenuLink
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-foreground/90 transition-all duration-200 hover:bg-white/5 group/item"
                              key={dropItem.label}
                              to={dropItem.href}
                            >
                              <span className="group-hover/item:text-primary transition-colors">
                                {dropItem.label}
                              </span>
                              <IconArrowUpRight className="size-3.5 text-muted-foreground/40 group-hover/item:text-primary/60 transition-colors" />
                            </MenuLink>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (isSimpleLink(item)) {
                    return (
                      <NavigationMenuItem key={item.label}>
                        <MenuLink
                          className={cn(
                            "font-semibold text-base",
                            item.active
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          hash={item.hash}
                          to={item.href}
                        >
                          {item.label}
                        </MenuLink>
                      </NavigationMenuItem>
                    );
                  }

                  return (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuTrigger
                        className={cn(
                          "font-semibold text-base",
                          item.active
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        {menuContent}
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <CTAButton className="hidden sm:inline-flex" href="#contact">
              Get in touch
            </CTAButton>

            {/* Mobile Menu Button */}
            <motion.button
              aria-label="Toggle menu"
              className="flex size-11 items-center justify-center rounded-full border border-border/50 bg-background text-foreground lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "block h-0.5 w-4 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-4 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-4 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-3xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <Link
                className="flex shrink-0 items-center gap-3"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative h-10 w-14">
                  <Image
                    alt="Work Holo"
                    className="object-contain"
                    height={40}
                    src="/logo.webp"
                    unoptimized
                    width={56}
                  />
                </div>
                <span className="font-bold font-heading text-xl text-foreground">
                  Workholo
                </span>
              </Link>
              <motion.button
                aria-label="Close menu"
                className="flex size-10 items-center justify-center rounded-full bg-white/5 text-foreground transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconX className="size-5" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-8">
              {navItems.map((item, index) => {
                let mobileContent: ReactNode = null;

                if (hasGroups(item)) {
                  const hasManyGroups = item.groups.length > 1;
                  mobileContent = (
                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                      <div className="flex items-stretch">
                        <Link
                          className={cn(
                            "flex flex-1 items-center px-4 py-4 text-base font-medium transition-colors",
                            item.active
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          hash={item.hash}
                          onClick={() => setMobileMenuOpen(false)}
                          to={item.href}
                        >
                          {item.label}
                        </Link>
                        {hasManyGroups && (
                          <button
                            aria-expanded={openMobileItem === item.label}
                            aria-label={`Toggle ${item.label} links`}
                            className="flex size-14 items-center justify-center border-l border-white/5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                            onClick={() =>
                              setOpenMobileItem((current) =>
                                current === item.label ? null : item.label,
                              )
                            }
                            type="button"
                          >
                            <motion.div
                              animate={{ rotate: openMobileItem === item.label ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <IconChevronDown className="size-5" />
                            </motion.div>
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {openMobileItem === item.label && hasManyGroups && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden bg-black/20"
                          >
                            <div className="p-4 space-y-6">
                              {item.groups.map((group) => (
                                <div key={group.title}>
                                  <h4 className="mb-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground/60">
                                    {group.title}
                                  </h4>
                                  <div className="space-y-2">
                                    {group.items.map((dropItem, dropIdx) => (
                                      <motion.div
                                        key={dropItem.label}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: dropIdx * 0.04,
                                          duration: 0.3,
                                          ease: [0.22, 1, 0.36, 1],
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <Link
                                          className="flex flex-col rounded-xl px-3 py-3 transition-all hover:bg-white/10"
                                          hash={dropItem.hash}
                                          onClick={() => setMobileMenuOpen(false)}
                                          to={dropItem.href}
                                        >
                                          <span className="text-sm font-medium text-foreground">
                                            {dropItem.label}
                                          </span>
                                          {dropItem.description && (
                                            <span className="mt-1 text-xs text-muted-foreground/60 line-clamp-2">
                                              {dropItem.description}
                                            </span>
                                          )}
                                        </Link>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                } else if (hasDropdownItems(item)) {
                  mobileContent = (
                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                      <div className="flex items-stretch">
                        <Link
                          className={cn(
                            "flex flex-1 items-center px-4 py-4 text-base font-medium transition-colors",
                            item.active
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          key={item.label}
                          onClick={() => setMobileMenuOpen(false)}
                          to={item.href}
                        >
                          {item.label}
                        </Link>
                        <button
                          aria-expanded={openMobileItem === item.label}
                          aria-label={`Toggle ${item.label} links`}
                          className="flex size-14 items-center justify-center border-l border-white/5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                          onClick={() =>
                            setOpenMobileItem((current) =>
                              current === item.label ? null : item.label,
                            )
                          }
                          type="button"
                        >
                          <motion.div
                            animate={{ rotate: openMobileItem === item.label ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <IconChevronDown className="size-5" />
                          </motion.div>
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {openMobileItem === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden bg-black/20"
                          >
                            <div className="p-3 space-y-1">
                              {item.dropdownItems.map((dropItem, dropIdx) => (
                                <motion.div
                                  key={dropItem.label}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: dropIdx * 0.04,
                                    duration: 0.3,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Link
                                    className="flex rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                    to={dropItem.href}
                                  >
                                    {dropItem.label}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                } else if (isSimpleLink(item)) {
                  mobileContent = (
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        className={cn(
                          "flex items-center rounded-2xl px-4 py-4 text-base font-medium transition-all",
                          item.active
                            ? "bg-white/10 text-primary shadow-sm"
                            : "bg-white/[0.02] border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                        )}
                        hash={item.hash}
                        key={item.label}
                        onClick={() => setMobileMenuOpen(false)}
                        to={item.href}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    key={item.label}
                    className="mb-3"
                  >
                    {mobileContent}
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.08 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-white/5 px-6 py-6 bg-background/50"
            >
              <CTAButton className="w-full" href="#contact" to="/contact-us">
                Get in touch
              </CTAButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
