import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import {
  IconArrowUpRight,
  IconBolt,
  IconClock,
  IconSettings,
  IconChevronDown,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@work-holo/ui/lib/utils";
import { CTAButton } from "@work-holo/ui/components/cta-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@work-holo/ui/components/navigation-menu";
import { Image } from "@/components/shared/image";

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
    };

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
            href: "/",
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
    href: "/",
    dropdownItems: [
      { label: "Mobile Apps", href: "/" },
      { label: "Web Development", href: "/" },
      { label: "Cloud Migration", href: "/" },
    ],
  },
  {
    label: "Company",
    href: "/",
    dropdownItems: [
      { label: "About Us", href: "/" },
      { label: "Careers", href: "/" },
    ],
  },
  {
    label: "Contact",
    href: "/",
    dropdownItems: [
      { label: "Get in Touch", href: "/" },
      { label: "Support", href: "/" },
    ],
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextIsScrolled = latest > 20;
    setIsScrolled((current) =>
      current === nextIsScrolled ? current : nextIsScrolled
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
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        isScrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Bar */}
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 text-[15px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconBolt className="size-4.5 text-primary" fill="currentColor" />
              <span className="hidden sm:inline">
                Fast & Reliable IT Solution Services.
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Join Now
                <IconArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 text-muted-foreground">
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
            : "mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8"
        )}
        layout
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.nav
          className={cn(
            "relative flex items-center justify-between transition-all duration-500",
            isScrolled
              ? "min-h-20 px-5 sm:px-7 lg:px-8 bg-card/90 backdrop-blur-md"
              : "min-h-24 px-5 sm:px-7 lg:px-8 bg-muted/50 rounded-[1.75rem] border border-border/30"
          )}
          layout
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-16 h-12">
              <Image
                src="/logo.webp"
                alt="Work Holo"
                width={64}
                height={48}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground tracking-tight">
              Workholo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu align="center">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger
                      className={cn(
                        "text-base font-semibold",
                        item.active
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {"groups" in item && item.groups ? (
                        <div className="grid grid-cols-3 gap-6 p-5 w-[640px]">
                          {item.groups.map((group) => (
                            <div key={group.title} className="flex flex-col gap-3">
                              <h4 className="text-sm font-semibold text-foreground">
                                {group.title}
                              </h4>
                              <div className="flex flex-col gap-0.5">
                                {group.items.map((dropItem) => (
                                  <NavigationMenuLink
                                    key={dropItem.label}
                                    className="flex flex-col items-start gap-0.5 rounded-xl p-2.5 hover:bg-muted"
                                    render={
                                      <Link to={dropItem.href} hash={dropItem.hash}>
                                        <span className="text-sm font-medium text-foreground">
                                          {dropItem.label}
                                        </span>
                                        {dropItem.description && (
                                          <span className="text-xs text-muted-foreground leading-relaxed">
                                            {dropItem.description}
                                          </span>
                                        )}
                                      </Link>
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid gap-1 p-2 w-50">
                          {item.dropdownItems?.map((dropItem) => (
                            <NavigationMenuLink
                              key={dropItem.label}
                              render={
                                <Link to={dropItem.href}>
                                  {dropItem.label}
                                </Link>
                              }
                            />
                          ))}
                        </div>
                      )}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <CTAButton className="hidden sm:inline-flex">
              Get Started
            </CTAButton>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex size-11 items-center justify-center rounded-full bg-background text-foreground border border-border/50"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "block w-4 h-0.5 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "rotate-45 translate-y-1.5"
                  )}
                />
                <span
                  className={cn(
                    "block w-4 h-0.5 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "block w-4 h-0.5 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "-rotate-45 -translate-y-1.5"
                  )}
                />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 mt-3 overflow-hidden rounded-[1.75rem] border border-border/30 bg-card/95 shadow-[0_18px_50px_rgba(17,17,17,0.16)] backdrop-blur-md sm:mx-6 lg:hidden"
      >
        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain px-4 py-4 space-y-2 scroll-smooth">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: mobileMenuOpen ? 1 : 0,
                x: mobileMenuOpen ? 0 : -20,
              }}
              transition={{
                duration: 0.3,
                delay: mobileMenuOpen ? index * 0.05 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {"groups" in item && item.groups ? (
                <div className="rounded-2xl border border-border/40 bg-background/60">
                  <div className="flex items-stretch">
                    <Link
                      to={item.href}
                      hash={item.hash}
                      className={cn(
                        "flex flex-1 items-center justify-between rounded-l-2xl px-4 py-3.5 text-base font-medium transition-colors",
                        item.active
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="flex size-12 items-center justify-center rounded-r-2xl border-l border-border/40 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      onClick={() =>
                        setOpenMobileItem((current) =>
                          current === item.label ? null : item.label
                        )
                      }
                      aria-label={`Toggle ${item.label} links`}
                      aria-expanded={openMobileItem === item.label}
                    >
                      <IconChevronDown
                        className={cn(
                          "size-4 transition-transform duration-300",
                          openMobileItem === item.label && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                  {openMobileItem === item.label && (
                    <div className="border-t border-border/40 p-2">
                      <div className="space-y-4">
                        {item.groups.map((group) => (
                          <div key={group.title} className="space-y-1.5">
                            <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {group.title}
                            </h4>
                            <div className="space-y-1">
                              {group.items.map((dropItem) => (
                                <Link
                                  key={dropItem.label}
                                  to={dropItem.href}
                                  hash={dropItem.hash}
                                  className="flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <span className="text-sm font-medium text-foreground">
                                    {dropItem.label}
                                  </span>
                                  {dropItem.description && (
                                    <span className="text-xs text-muted-foreground leading-relaxed">
                                      {dropItem.description}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.dropdownItems ? (
                <div className="rounded-2xl border border-border/40 bg-background/60">
                  <div className="flex items-stretch">
                    <Link
                      to={item.href}
                      className={cn(
                        "flex flex-1 items-center justify-between rounded-l-2xl px-4 py-3.5 text-base font-medium transition-colors",
                        item.active
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="flex size-12 items-center justify-center rounded-r-2xl border-l border-border/40 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      onClick={() =>
                        setOpenMobileItem((current) =>
                          current === item.label ? null : item.label
                        )
                      }
                      aria-label={`Toggle ${item.label} links`}
                      aria-expanded={openMobileItem === item.label}
                    >
                      <IconChevronDown
                        className={cn(
                          "size-4 transition-transform duration-300",
                          openMobileItem === item.label && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                  {openMobileItem === item.label && (
                    <div className="border-t border-border/40 p-2">
                      <div className="space-y-1">
                        {item.dropdownItems.map((dropItem) => (
                          <Link
                            key={dropItem.label}
                            to={dropItem.href}
                            className="flex rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {dropItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  hash={item.hash}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors",
                    item.active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  <IconChevronDown className="size-4 opacity-0" />
                </Link>
              )}
            </motion.div>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <CTAButton className="w-full">
              Get Started
            </CTAButton>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
