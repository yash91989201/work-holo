import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import {
  IconBolt,
  IconArrowUpRight,
  IconClock,
  IconSettings,
  IconSearch,
  IconLayoutGrid,
  IconChevronDown,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@work-holo/ui/lib/utils";
import { CTAButton } from "@work-holo/ui/components/cta-button";

const navLinks = [
  { label: "Home", href: "/", active: true, hasDropdown: true },
  { label: "Pages", href: "#", hasDropdown: true },
  { label: "Services", href: "#", hasDropdown: true },
  { label: "Projects", href: "#", hasDropdown: true },
  { label: "Blog", href: "#", hasDropdown: true },
  { label: "Contact", href: "#", hasDropdown: false },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <div className="flex size-11 items-center justify-center rounded-full bg-primary">
              <span className="text-base font-bold text-primary-foreground">WH</span>
            </div>
            <span className="text-2xl font-semibold text-foreground tracking-tight">
              Work Holo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                href={link.href}
                label={link.label}
                active={link.active}
                hasDropdown={link.hasDropdown}
              />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex size-11 items-center justify-center rounded-full bg-background text-foreground hover:bg-muted transition-colors border border-border/50"
              aria-label="Search"
            >
              <IconSearch className="size-4.5" />
            </motion.button>

            <CTAButton className="hidden sm:inline-flex" icon={<IconArrowUpRight className="size-4" />}>
              Get Started
            </CTAButton>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex size-11 items-center justify-center rounded-full bg-background text-foreground hover:bg-muted transition-colors border border-border/50"
              aria-label="Menu"
            >
              <IconLayoutGrid className="size-4.5" />
            </motion.button>

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
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
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
              <Link
                to={link.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                  link.active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
                {link.hasDropdown && <IconChevronDown className="size-4" />}
              </Link>
            </motion.div>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <CTAButton
              className="w-full"
              icon={<IconArrowUpRight className="size-4" />}
            >
              Get Started
            </CTAButton>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

function NavItem({
  href,
  label,
  active,
  hasDropdown,
}: {
  href: string;
  label: string;
  active?: boolean;
  hasDropdown: boolean;
}) {
  return (
    <motion.div whileHover="hover" initial="rest" animate="rest">
      <Link
        to={href}
        className={cn(
          "group relative flex items-center gap-1 px-5 py-2.5 text-[15px] font-medium rounded-xl transition-colors",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span>{label}</span>
        {hasDropdown && (
          <motion.span
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: 180 },
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <IconChevronDown className="size-4 opacity-60" />
          </motion.span>
        )}
        {active && (
          <motion.span
            layoutId="activeNav"
            className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}
