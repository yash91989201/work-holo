import { useState } from "react";
import { motion } from "motion/react";
import {
  IconBell,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconClock,
  IconArrowUp,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@work-holo/ui/lib/utils";

const services = [
  "Manage IT Service",
  "Cloud Computing",
  "Cyber Security",
  "Software Develop",
  "Change Manage",
  "IT Consulting",
];

const resources = [
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Recognitions", href: "#" },
  { label: "Careers", href: "#", badge: "NEW" },
  { label: "News", href: "#" },
  { label: "Feedback", href: "#" },
];

const socialLinks = [
  { icon: IconBrandFacebook, href: "#", label: "Facebook" },
  { icon: IconBrandInstagram, href: "#", label: "Instagram" },
  { icon: IconBrandLinkedin, href: "#", label: "LinkedIn" },
  { icon: IconBrandX, href: "#", label: "X" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden bg-background px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      {/* Background wave pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-auto opacity-[0.04]"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 400C200 300 400 500 720 400C1040 300 1240 500 1540 400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 450C200 350 400 550 720 450C1040 350 1240 550 1540 450"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-100 500C200 400 400 600 720 500C1040 400 1240 600 1540 500"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* Newsletter CTA Banner */}
      <div className="relative mx-auto max-w-7xl pb-6 sm:pb-8 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-primary p-8 shadow-[0_28px_70px_rgba(168,85,247,0.28)] sm:p-10 lg:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Heading */}
            <div className="relative shrink-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-[1.1] tracking-tight">
                Don't Miss Out
                <br />
                the Future!
              </h2>
            </div>

            {/* Subscribe Form */}
            <div className="relative flex-1 max-w-xl lg:max-w-md xl:max-w-lg">
              <div className="flex items-center rounded-full border border-white/20 bg-background/95 p-1.5 pl-5 shadow-[0_14px_40px_rgba(17,17,17,0.18)] sm:pl-6">
                <input
                  type="email"
                  placeholder="Enter email here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                />
                <SubscribeButton />
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm font-medium text-primary-foreground">
                  Follow us:
                </span>
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex size-8 items-center justify-center rounded-full bg-background text-primary hover:bg-muted transition-colors border border-border"
                      aria-label={social.label}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-4"
            >
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">WH</span>
                </div>
                <span className="text-xl font-semibold text-foreground tracking-tight">
                  Work Holo
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Every great solution start understand the time into learn about.
              </p>

              {/* App Store Badges */}
              <div className="mt-6 flex flex-col gap-3">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-background border border-border px-4 py-2.5 w-fit hover:bg-muted/50 transition-colors"
                >
                  <svg
                    className="size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"
                      fill="#EA4335"
                    />
                    <path
                      d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"
                      fill="#4285F4"
                    />
                    <path
                      d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"
                      fill="#34A853"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] leading-none text-muted-foreground uppercase tracking-wide">
                      Get it on
                    </span>
                    <span className="text-sm font-semibold text-foreground leading-tight">
                      Google Play
                    </span>
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-background border border-border px-4 py-2.5 w-fit hover:bg-muted/50 transition-colors"
                >
                  <svg
                    className="size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.7-3.06 1.58-.67.78-1.26 2.02-1.1 3.22 1.17.09 2.36-.68 3.09-1.69"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] leading-none text-muted-foreground uppercase tracking-wide">
                      Download on the
                    </span>
                    <span className="text-sm font-semibold text-foreground leading-tight">
                      App Store
                    </span>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Services Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 lg:col-start-6"
            >
              <h3 className="text-base font-semibold text-foreground mb-5">
                Services
              </h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <Link
                      to="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <h3 className="text-base font-semibold text-foreground mb-5">
                Resources
              </h3>
              <ul className="space-y-3">
                {resources.map((resource) => (
                  <li key={resource.label} className="flex items-center gap-2">
                    <Link
                      to={resource.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {resource.label}
                    </Link>
                    {resource.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-wide">
                        {resource.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <h3 className="text-base font-semibold text-foreground mb-5">
                Contact Info
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  993 Renner Burg, West Rond,
                  <br />
                  MT 94251-030
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">P:</span>{" "}
                    <a
                      href="tel:+10095447818"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +1 (009) 544-7818
                    </a>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">E:</span>{" "}
                    <a
                      href="mailto:support@workholo.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      support@workholo.com
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconClock className="size-4 text-primary" />
                  <span>Mon-Fri 09am-06pm</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground/60">
              Work Holo © {new Date().getFullYear()}. All right reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground/60">
              <Link
                to="#"
                className="hover:text-primary transition-colors"
              >
                Privacy & Policy
              </Link>
              <span className="text-border">·</span>
              <Link
                to="#"
                className="hover:text-primary transition-colors"
              >
                Terms & Condition
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-1"
        aria-label="Scroll to top"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
          <IconArrowUp className="size-5" />
        </div>
        <span
          className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase"
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-2 rounded-full bg-muted hover:bg-primary px-4 sm:px-5 py-2.5 transition-colors duration-300 overflow-hidden shrink-0 border border-border"
    >
      {/* Text Container */}
      <div className="relative h-5 overflow-hidden">
        {/* Default text - slides up on hover */}
        <motion.span
          animate={{ y: isHovered ? "-100%" : "0%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="block text-sm font-semibold text-foreground whitespace-nowrap"
        >
          Subscribe Now
        </motion.span>
        {/* Hover text - slides up from below */}
        <motion.span
          animate={{ y: isHovered ? "-100%" : "0%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="block text-sm font-semibold text-primary-foreground whitespace-nowrap"
        >
          Subscribe Now
        </motion.span>
      </div>

      {/* Bell Icon */}
      <div className="flex size-7 items-center justify-center rounded-full bg-primary group-hover:bg-background transition-colors duration-300 shrink-0">
        <IconBell className="size-3.5 text-primary-foreground group-hover:text-foreground transition-colors duration-300" />
      </div>
    </motion.button>
  );
}
