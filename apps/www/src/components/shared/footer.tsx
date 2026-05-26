import {
  IconArrowUp,
  IconBell,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconClock,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Image } from "@/components/shared/image";

const services = [
  { label: "Agentic AI", href: "/services/agentic-ai" },
  { label: "AI Agents", href: "/services/ai-agents" },
  { label: "MVP", href: "/services/mvp" },
  { label: "Web App Development", href: "/services/web-app-development" },
  { label: "Mobile App Development", href: "/services/mobile-app-development" },
  { label: "QA & Test Automation", href: "/services/qa-test-automation" },
  { label: "UX/UI Design", href: "/services/ux-ui-design" },
  { label: "Data Engineering", href: "/services/data-engineering" },
  { label: "AWS", href: "/services/aws" },
  {
    label: "Cloud Engineering & Devops",
    href: "/services/cloud-engineering-devops",
  },
];

const resources = [
  { label: "About Us", href: "/about-us" },
  { label: "Careers", href: "/career" },
  { label: "Projects", href: "/projects" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/" },
];

const socialLinks = [
  {
    icon: IconBrandFacebook,
    href: "https://www.facebook.com/people/Work-Holo/61575462641337/",
    label: "Facebook",
  },
  {
    icon: IconBrandInstagram,
    href: "https://www.instagram.com/workholo.dev/",
    label: "Instagram",
  },
  {
    icon: IconBrandLinkedin,
    href: "https://www.linkedin.com/company/workholo/posts/?feedView=all",
    label: "LinkedIn",
  },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent =
        scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setShowScrollTop(scrollPercent > 0.25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-background px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      {/* Background wave pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-1/2 h-auto w-[140%] -translate-x-1/2 opacity-[0.04]"
          fill="none"
          viewBox="0 0 1440 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 400C200 300 400 500 720 400C1040 300 1240 500 1540 400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M-100 450C200 350 400 550 720 450C1040 350 1240 550 1540 450"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M-100 500C200 400 400 600 720 500C1040 400 1240 600 1540 500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Newsletter CTA Banner */}
      <div className="relative mx-auto max-w-7xl pb-6 sm:pb-8 lg:pb-10">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-primary p-8 shadow-[0_28px_70px_rgba(168,85,247,0.28)] sm:p-10 lg:p-12"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Heading */}
            <div className="relative shrink-0">
              <h2 className="font-bold text-3xl text-primary-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                Don't Miss Out
                <br />
                the Future!
              </h2>
            </div>

            {/* Subscribe Form */}
            <div className="relative max-w-xl flex-1 lg:max-w-md xl:max-w-lg">
              <div className="flex items-center rounded-full border border-white/20 bg-background/95 p-1.5 pl-5 shadow-[0_14px_40px_rgba(17,17,17,0.18)] sm:pl-6">
                <input
                  className="min-w-0 flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email here..."
                  type="email"
                  value={email}
                />
                <SubscribeButton />
              </div>

              {/* Social Links */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-medium text-primary-foreground text-sm">
                  Follow us:
                </span>
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      aria-label={social.label}
                      className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:bg-muted"
                      href={social.href}
                      key={social.label}
                      rel="noopener noreferrer"
                      target="_blank"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="size-3.5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="relative rounded-[2rem] border border-border/50 bg-card px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand Column */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link className="flex shrink-0 items-center gap-1.5" to="/">
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
                <span
                  className="font-bold text-foreground text-lg uppercase tracking-tight"
                  style={{ fontFamily: "'Michroma', sans-serif" }}
                >
                  WORKHOLO
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-muted-foreground text-sm leading-relaxed">
                Every great solution start understand the time into learn about.
              </p>
            </motion.div>

            {/* Services Column */}
            <motion.div
              className="lg:col-span-2 lg:col-start-6"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="mb-5 font-semibold text-base text-foreground">
                Services
              </h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.label}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors duration-200 hover:text-primary"
                      to={service.href}
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources Column */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="mb-5 font-semibold text-base text-foreground">
                Resources
              </h3>
              <ul className="space-y-3">
                {resources.map((resource) => (
                  <li className="flex items-center gap-2" key={resource.label}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors duration-200 hover:text-primary"
                      {...(resource.hash ? { hash: resource.hash } : {})}
                      to={resource.href}
                    >
                      {resource.label}
                    </Link>
                    {resource.badge && (
                      <span className="inline-flex items-center rounded bg-primary px-1.5 py-0.5 font-bold text-[10px] text-primary-foreground uppercase tracking-wide">
                        {resource.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info Column */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="mb-5 font-semibold text-base text-foreground">
                Contact Info
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Raj Nagar, Dwarka,
                  <br />
                  New Delhi- 1100XX, Delhi, India
                </p>
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-center gap-2 text-sm">
                    <IconPhone className="size-4 shrink-0 text-primary" />

                    <a
                      className="text-muted-foreground transition-colors hover:text-primary"
                      href="tel:++91-9780970564"
                    >
                      +97809 70564
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm">
                    <IconMail className="size-4 shrink-0 text-primary" />

                    <a
                      className="text-muted-foreground transition-colors hover:text-primary"
                      href="mailto:hr@workholo.com"
                    >
                      hr@workholo.com
                      <br />
                      sales@workholo.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <IconClock className="size-4 text-primary" />
                  <span>Mon-Sat 10am- 07pm</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-border/50 border-t pt-6 sm:flex-row">
            <p className="text-muted-foreground/60 text-sm">
              Work Holo © {new Date().getFullYear()}. All right reserved.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground/60 text-sm">
              <Link className="transition-colors hover:text-primary" to="/">
                Privacy & Policy
              </Link>
              <span className="text-border">·</span>
              <Link className="transition-colors hover:text-primary" to="/">
                Terms & Condition
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        animate={{
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? "auto" : "none",
        }}
        aria-label="Scroll to top"
        className="fixed right-8 bottom-8 z-40 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30">
          <IconArrowUp className="size-5" />
        </div>
        <span
          className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll Top
        </span>
      </motion.button>
    </footer>
  );
}

/* Subscribe Button with text-swap animation */
function SubscribeButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-border bg-muted px-4 py-2.5 transition-colors duration-300 hover:bg-primary sm:px-5"
      onHoverEnd={() => setIsHovered(false)}
      onHoverStart={() => setIsHovered(true)}
      whileTap={{ scale: 0.97 }}
    >
      {/* Text Container */}
      <div className="relative h-5 overflow-hidden">
        {/* Default text - slides up on hover */}
        <motion.span
          animate={{ y: isHovered ? "-100%" : "0%" }}
          className="block whitespace-nowrap font-semibold text-foreground text-sm"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Subscribe Now
        </motion.span>
        {/* Hover text - slides up from below */}
        <motion.span
          animate={{ y: isHovered ? "-100%" : "0%" }}
          className="block whitespace-nowrap font-semibold text-primary-foreground text-sm"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Subscribe Now
        </motion.span>
      </div>

      {/* Bell Icon */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary transition-colors duration-300 group-hover:bg-background">
        <IconBell className="size-3.5 text-primary-foreground transition-colors duration-300 group-hover:text-foreground" />
      </div>
    </motion.button>
  );
}
