import {
  IconArrowUpRight,
  IconBolt,
  IconChevronDown,
  IconClock,
  IconSettings,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { CTAButton } from "@work-holo/ui/components/cta-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@work-holo/ui/components/navigation-menu";
import { cn } from "@work-holo/ui/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
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
  item: NavItem
): item is Extract<NavItem, { dropdownItems?: never; groups?: never }> {
  return !("groups" in item || "dropdownItems" in item);
}

function hasGroups(
  item: NavItem
): item is Extract<NavItem, { groups: NavGroup[] }> {
  return "groups" in item;
}

function hasDropdownItems(
  item: NavItem
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
    href: "/contact-us",
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
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50",
        isScrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
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
            : "mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8"
        )}
        layout
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.nav
          className={cn(
            "relative flex items-center justify-between transition-all duration-500",
            isScrolled
              ? "min-h-20 bg-card/90 px-5 backdrop-blur-md sm:px-7 lg:px-8"
              : "min-h-24 rounded-[1.75rem] border border-border/30 bg-muted/50 px-5 sm:px-7 lg:px-8"
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
                    menuContent = (
                      <div className="grid w-160 grid-cols-3 gap-6 p-5">
                        {item.groups.map((group) => (
                          <div
                            className="flex flex-col gap-3"
                            key={group.title}
                          >
                            <h4 className="font-semibold text-foreground text-sm">
                              {group.title}
                            </h4>
                            <div className="flex flex-col gap-0.5">
                              {group.items.map((dropItem) => (
                                <MenuLink
                                  className="flex flex-col items-start gap-0.5 rounded-xl p-2.5 hover:bg-muted"
                                  hash={dropItem.hash}
                                  key={dropItem.label}
                                  to={dropItem.href}
                                >
                                  <span className="font-medium text-foreground text-sm">
                                    {dropItem.label}
                                  </span>
                                  {dropItem.description && (
                                    <span className="text-muted-foreground text-xs leading-relaxed">
                                      {dropItem.description}
                                    </span>
                                  )}
                                </MenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else if (hasDropdownItems(item)) {
                    menuContent = (
                      <div className="grid w-50 gap-1 p-2">
                        {item.dropdownItems.map((dropItem) => (
                          <MenuLink key={dropItem.label} to={dropItem.href}>
                            {dropItem.label}
                          </MenuLink>
                        ))}
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
                              : "text-muted-foreground hover:text-foreground"
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
                            : "text-muted-foreground hover:text-foreground"
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
                    mobileMenuOpen && "translate-y-1.5 rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-4 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-4 bg-foreground transition-all duration-300",
                    mobileMenuOpen && "-translate-y-1.5 -rotate-45"
                  )}
                />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        animate={{
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        className="mx-4 mt-3 overflow-hidden rounded-[1.75rem] border border-border/30 bg-card/95 shadow-[0_18px_50px_rgba(17,17,17,0.16)] backdrop-blur-md sm:mx-6 lg:hidden"
        initial={false}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-h-[calc(100dvh-10rem)] space-y-2 overflow-y-auto overscroll-contain scroll-smooth px-4 py-4">
          {navItems.map((item, index) => {
            let mobileContent: ReactNode = null;

            if (hasGroups(item)) {
              mobileContent = (
                <div className="rounded-2xl border border-border/40 bg-background/60">
                  <div className="flex items-stretch">
                    <Link
                      className={cn(
                        "flex flex-1 items-center justify-between rounded-l-2xl px-4 py-3.5 font-medium text-base transition-colors",
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                      hash={item.hash}
                      onClick={() => setMobileMenuOpen(false)}
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                    <button
                      aria-expanded={openMobileItem === item.label}
                      aria-label={`Toggle ${item.label} links`}
                      className="flex size-12 items-center justify-center rounded-r-2xl border-border/40 border-l text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      onClick={() =>
                        setOpenMobileItem((current) =>
                          current === item.label ? null : item.label
                        )
                      }
                      type="button"
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
                    <div className="border-border/40 border-t p-2">
                      <div className="space-y-4">
                        {item.groups.map((group) => (
                          <div className="space-y-1.5" key={group.title}>
                            <h4 className="px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                              {group.title}
                            </h4>
                            <div className="space-y-1">
                              {group.items.map((dropItem) => (
                                <Link
                                  className="flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                                  hash={dropItem.hash}
                                  key={dropItem.label}
                                  onClick={() => setMobileMenuOpen(false)}
                                  to={dropItem.href}
                                >
                                  <span className="font-medium text-foreground text-sm">
                                    {dropItem.label}
                                  </span>
                                  {dropItem.description && (
                                    <span className="text-muted-foreground text-xs leading-relaxed">
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
              );
            } else if (hasDropdownItems(item)) {
              mobileContent = (
                <Link
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3.5 font-medium text-base transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                  to={item.href}
                >
                  {item.label}
                </Link>
              );
            } else if (isSimpleLink(item)) {
              mobileContent = (
                <Link
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3.5 font-medium text-base transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  hash={item.hash}
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                  to={item.href}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <motion.div
                animate={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  x: mobileMenuOpen ? 0 : -20,
                }}
                initial={{ opacity: 0, x: -20 }}
                key={item.label}
                transition={{
                  duration: 0.3,
                  delay: mobileMenuOpen ? index * 0.05 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {mobileContent}
              </motion.div>
            );
          })}
          <div className="flex flex-col gap-2 pt-3">
            <CTAButton className="w-full" href="#contact" to="/contact-us">
              Get in touch
            </CTAButton>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
