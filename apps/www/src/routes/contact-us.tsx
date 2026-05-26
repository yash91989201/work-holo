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
          className="relative h-[300px] w-full overflow-hidden sm:h-[360px] lg:h-[460px]"
          initial={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {/* Background image */}
          <ContactImage
            aspectRatio="16/9"
            className="absolute inset-0 h-full w-full object-cover object-center"
            title="Contact Us"
          />

          {/* Blur + dark overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          {/* Bottom fade into page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

          {/* Content ON TOP of image */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:justify-center sm:pt-20 sm:pb-0 lg:pt-0">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 16 }}
              >
                <span className="mb-3 inline-flex items-center gap-2 font-mono font-semibold text-[11px] text-primary uppercase tracking-[0.25em]">
                  [ Get In Touch ]
                </span>
                <h1 className="mb-4 font-bold font-heading text-2xl text-white sm:text-3xl lg:text-4xl xl:text-5xl">
                  Contact Us
                </h1>
                <p className="max-w-2xl text-sm text-white/70 leading-relaxed sm:text-base">
                  Have a project in mind or need expert guidance? Reach out and
                  let&apos;s build something great together.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Card Section */}
      <section className="relative py-6 sm:py-10 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactCard />
        </div>
      </section>
    </div>
  );
}
