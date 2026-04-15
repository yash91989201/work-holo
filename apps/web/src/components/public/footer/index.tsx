import { IconBrandX, IconChevronUp, IconWorld } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-muted pt-32 pb-10 text-foreground">
      <motion.div
        className="container relative z-10 mx-auto px-6 lg:px-12"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="mb-32 grid gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="font-medium text-foreground/60 text-xl">
              Raj Nagar, Dwarka, New Delhi- 110078, Delhi, India
            </p>
            <p className="font-medium text-foreground/60 text-xl">
              India – WorkHolo Operations
            </p>
          </div>
          <div className="space-y-4">
            <p className="font-medium text-foreground/60 text-xl">
              hr@workholo.com
            </p>
            <p className="font-medium text-foreground/60 text-xl">
              +91-XXXXXXXXXX
            </p>
          </div>
          <div className="flex justify-start gap-4 lg:justify-end">
            {[
              {
                Icon: IconBrandX,
                label: "X",
                href: "https://x.com",
              },
              {
                Icon: IconWorld,
                label: "Website",
                href: "https://workholo.com",
              },
            ].map(({ Icon, label, href }) => (
              <a
                aria-label={label}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm transition-all hover:bg-primary hover:text-primary-foreground"
                href={href}
                key={label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative">
          <h1 className="select-none text-center font-black font-display text-[22vw] text-foreground/5 uppercase leading-none tracking-tighter">
            WorkHolo
          </h1>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-foreground/5 border-t pt-10 font-medium text-foreground/40 text-sm md:flex-row">
          <p>© 2026 WorkHolo Agency. All rights reserved.</p>
          <div className="flex gap-10">
            <Link className="transition-colors hover:text-foreground" to="/">
              Privacy Policy
            </Link>
            <Link className="transition-colors hover:text-foreground" to="/">
              Terms of Service
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Scroll to Top */}
      <button
        aria-label="Scroll to top"
        className="group fixed right-10 bottom-10 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-2xl transition-all hover:bg-primary hover:text-primary-foreground"
        onClick={scrollToTop}
        type="button"
      >
        <IconChevronUp className="h-6 w-6 transition-transform group-hover:-translate-y-1" />
      </button>
    </footer>
  );
}
