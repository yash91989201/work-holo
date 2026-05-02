import { IconCheck, IconChevronRight, IconPhone } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@work-holo/ui/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { getServiceList } from "./service-data";
import type { ServicePageData } from "./service-data";
import { ServiceGalleryImage, ServiceImage } from "./service-image";

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

interface ServiceDetailPageProps {
  data: ServicePageData;
}

function ServiceSidebar({ currentSlug }: { currentSlug: string }) {
  const services = getServiceList(currentSlug);

  return (
    <div className="space-y-6">
      {/* More Services */}
      <motion.div
        className="overflow-hidden rounded-2xl border border-border/20 bg-card/30"
        initial={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="border-border/10 border-b px-4 py-4 sm:px-6">
          <h3 className="font-semibold text-foreground">More services</h3>
        </div>
        <div className="p-2">
          {services.map((service) => (
            <Item
              className={cn(
                service.isActive &&
                  "border-primary/20 bg-primary/5 text-primary"
              )}
              key={service.slug}
              render={<Link to={service.href} />}
              variant={service.isActive ? "outline" : "default"}
            >
              <ItemContent>
                <ItemTitle>{service.title}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <IconChevronRight
                  className={cn(
                    "size-4 transition-transform group-hover/item:translate-x-1",
                    service.isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </ItemActions>
            </Item>
          ))}
        </div>
      </motion.div>

      {/* CTA Card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground sm:p-6"
        initial={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="relative z-10">
          <p className="mb-1 text-primary-foreground/70 text-sm">
            IT Solutions
          </p>
          <h3 className="mb-4 font-bold font-heading text-xl sm:text-2xl">
            Innovative
          </h3>
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
        <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -top-10 -left-10 size-32 rounded-full bg-primary-foreground/5" />
      </motion.div>
    </div>
  );
}

export function ServiceDetailPage({ data }: ServiceDetailPageProps) {
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
      {/* Hero Image */}
      <section className="relative">
        <motion.div
          className="relative w-full overflow-hidden"
          initial={{ opacity: 0, scale: 1.05 }}
          style={{ aspectRatio: "21/9" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <ServiceImage
            aspectRatio="21/9"
            className="h-full w-full"
            title={data.title}
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        </motion.div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Main Content */}
            <div className="order-1 lg:col-span-8">
              {/* Title & Description */}
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

              {/* Features */}
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

              {/* Gallery Images */}
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
                    <ServiceGalleryImage
                      className="aspect-4/3 w-full"
                      index={index}
                      title={data.title}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Customer Services */}
              <motion.div
                className="mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="mb-2 font-bold font-heading text-foreground text-xl sm:text-2xl lg:text-3xl">
                  Our Range of Customer Services
                </h2>
                <p className="mb-6 text-muted-foreground text-sm sm:text-base lg:mb-8">
                  We are committed to delivering top-notch customer services
                  tailored to your business needs. Our comprehensive range of IT
                  solutions ensures seamless operations, enhanced security, and
                  optimized performance.
                </p>

                <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                  {data.customerServices.map((service, index) => (
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card/30 p-4 transition-colors hover:border-primary/20 hover:bg-card/50 sm:p-5"
                      initial={{ opacity: 0, y: 20 }}
                      key={service.title}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-4 sm:size-10">
                        <span className="font-bold text-base sm:text-lg">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground text-sm">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {service.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* FAQ with shadcn Accordion */}
              <motion.div
                className="mb-10 lg:mb-12"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.25 }}
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
            </div>

            {/* Sidebar */}
            <div className="order-2 lg:order-2 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <ServiceSidebar currentSlug={data.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
