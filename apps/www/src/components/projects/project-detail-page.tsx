import {
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconDeviceMobile,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@work-holo/ui/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { getProjectList } from "./project-data";
import type { ProjectPageData } from "./project-data";
import { ProjectGalleryImage, ProjectImage } from "./project-image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@work-holo/ui/components/accordion";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@work-holo/ui/components/item";

interface ProjectDetailPageProps {
  data: ProjectPageData;
}

function ProjectSidebar({ currentSlug }: { currentSlug: string }) {
  const projects = getProjectList(currentSlug);

  return (
    <div className="space-y-6">
      <motion.div
        className="overflow-hidden rounded-2xl border border-border/20 bg-card/30"
        initial={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="border-border/10 border-b px-4 py-4 sm:px-6">
          <h3 className="font-semibold text-foreground">More projects</h3>
        </div>
        <div className="p-2">
          {projects.map((project) => (
            <Item
              className={cn(
                project.isActive &&
                  "border-primary/20 bg-primary/5 text-primary"
              )}
              key={project.slug}
              render={<Link to={project.href} />}
              variant={project.isActive ? "outline" : "default"}
            >
              <ItemContent>
                <ItemTitle>{project.title}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <IconChevronRight
                  className={cn(
                    "size-4 transition-transform group-hover/item:translate-x-1",
                    project.isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </ItemActions>
            </Item>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground sm:p-6"
        initial={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="relative z-10">
          <p className="mb-1 text-primary-foreground/70 text-sm">
            Start Your Project
          </p>
          <h3 className="mb-4 font-bold font-heading text-xl sm:text-2xl">
            Let&apos;s Build Together
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <IconUser className="size-5" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-xs">Client</p>
                <p className="font-semibold text-sm">{currentSlug ? getProjectList().find(p => p.slug === currentSlug)?.description.split('.')[0] : "Talk to us"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <IconPhone className="size-5" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-xs">
                  Call us anytime
                </p>
                <p className="font-semibold text-sm">+1 (520) 890 56 4</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -top-10 -left-10 size-32 rounded-full bg-primary-foreground/5" />
      </motion.div>
    </div>
  );
}

export function ProjectDetailPage({ data }: ProjectDetailPageProps) {
  const [openFAQ, setOpenFAQ] = useState<string[]>(["item-0"]);

  const featuresLeft = data.features.slice(
    0,
    Math.ceil(data.features.length / 2)
  );
  const featuresRight = data.features.slice(
    Math.ceil(data.features.length / 2)
  );

  return (
    <div className="relative overflow-hidden bg-background">
      <motion.div
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0, scale: 1.05 }}
        style={{ aspectRatio: "21/9" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <ProjectImage
          aspectRatio="21/9"
          className="h-full w-full"
          title={data.title}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </motion.div>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            <div className="order-1 lg:col-span-8">
              <motion.div
                className="mb-6 flex flex-wrap items-center gap-4 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
                  {data.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
                  <IconClock className="size-3.5" />
                  {data.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
                  <IconUser className="size-3.5" />
                  {data.client}
                </span>
              </motion.div>

              <motion.div
                className="mb-8 sm:mb-10"
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h1 className="mb-4 font-bold font-heading text-2xl text-foreground sm:text-3xl lg:text-4xl xl:text-5xl">
                  {data.title}: {data.subtitle}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {data.description}
                </p>
              </motion.div>

              <motion.div
                className="mb-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-12"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <ul className="space-y-3">
                  {featuresLeft.map((feature) => (
                    <li
                      className="flex items-center gap-3 text-sm"
                      key={feature}
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <IconCheck className="size-3 text-primary" />
                      </span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {featuresRight.map((feature) => (
                    <li
                      className="flex items-center gap-3 text-sm"
                      key={feature}
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <IconCheck className="size-3 text-primary" />
                      </span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="mb-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {data.galleryImages.map((_, index) => (
                  <motion.div
                    className="overflow-hidden rounded-2xl"
                    key={index}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <ProjectGalleryImage
                      className="aspect-4/3 w-full"
                      index={index}
                      title={data.title}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {data.metrics.map((metric, index) => (
                    <motion.div
                      className="rounded-2xl border border-border/20 bg-card/30 p-4 text-center sm:p-5"
                      initial={{ opacity: 0, y: 20 }}
                      key={metric.label}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <div className="mb-1 font-bold font-heading text-2xl text-primary sm:text-3xl">
                        {metric.value}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="mb-2 font-bold font-heading text-foreground text-xl sm:text-2xl lg:text-3xl">
                  Project Overview
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {data.overview}
                </p>
              </motion.div>

              <motion.div
                className="mb-12 grid gap-6 lg:grid-cols-2 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-2xl border border-border/20 bg-card/30 p-5 sm:p-6">
                  <h3 className="mb-3 font-semibold text-foreground text-lg">
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {data.challenge}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/20 bg-card/30 p-5 sm:p-6">
                  <h3 className="mb-3 font-semibold text-foreground text-lg">
                    Our Solution
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {data.solution}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="mb-6 font-bold font-heading text-foreground text-xl sm:text-2xl lg:text-3xl">
                  Key Results
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {data.results.map((result, index) => (
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card/30 p-4 transition-colors hover:border-primary/20 hover:bg-card/50 sm:p-5"
                      initial={{ opacity: 0, y: 20 }}
                      key={result.title}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary sm:mb-3 sm:size-9">
                        <span className="font-bold text-xs sm:text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h4 className="mb-2 font-semibold text-foreground text-sm">
                        {result.title}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {result.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="mb-6 font-bold font-heading text-foreground text-xl sm:text-2xl lg:text-3xl">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.techStack.map((tech) => (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/20 bg-card/30 px-3 py-1.5 font-medium text-foreground text-xs"
                      key={tech}
                    >
                      <IconCheck className="size-3 text-primary" />
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mb-10 lg:mb-12"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="mb-6 font-bold font-heading text-foreground text-xl sm:text-2xl lg:text-3xl">
                  Frequently asked questions
                </h2>

                <Accordion
                  className="border-border/20"
                  onValueChange={(value) => setOpenFAQ(value)}
                  value={openFAQ}
                >
                  {data.faqs.map((faq, index) => (
                    <AccordionItem
                      className="border-border/10"
                      key={index}
                      value={`item-${index}`}
                    >
                      <AccordionTrigger className="px-4 py-4 font-medium text-sm sm:px-6 sm:py-5">
                        <span className="pr-4 text-left">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 sm:px-6">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-border/20 bg-card/30 p-5 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h3 className="mb-4 font-bold font-heading text-foreground text-xl sm:text-2xl">
                  Interested in a similar project?
                </h3>
                <p className="mb-6 text-muted-foreground text-sm leading-relaxed sm:mb-8">
                  We&apos;d love to discuss how we can help bring your vision to
                  life. Our team has extensive experience across AI, web, mobile,
                  and cloud technologies.
                </p>
                <Link
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                  to="/contact-us"
                >
                  Get in touch
                  <IconArrowUpRight className="size-4" />
                </Link>
              </motion.div>
            </div>

            <div className="order-2 lg:order-2 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <ProjectSidebar currentSlug={data.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}