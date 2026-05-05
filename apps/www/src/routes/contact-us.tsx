import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ContactCard } from "@/components/shared/contact-card";
import { ContactImage } from "@/components/shared/contact-image";

export const Route = createFileRoute("/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative">
        <motion.div
          className="relative w-full overflow-hidden"
          initial={{ opacity: 0, scale: 1.05 }}
          style={{ aspectRatio: "21/9" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <ContactImage
            aspectRatio="21/9"
            className="h-full w-full"
            title="Contact Us"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="relative py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 font-mono font-semibold text-[11px] text-primary uppercase tracking-[0.25em]">
              [ Get In Touch ]
            </span>
            <h1 className="mb-4 font-bold font-heading text-2xl text-foreground sm:text-3xl lg:text-4xl xl:text-5xl">
              Contact Us
            </h1>
            <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-base">
              Have a project in mind or need expert guidance? Reach out and
              let&apos;s build something great together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Card Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactCard />
        </div>
      </section>
    </div>
  );
}