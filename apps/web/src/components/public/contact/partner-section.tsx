import type { TablerIcon } from "@tabler/icons-react";
import {
  IconBolt,
  IconHeartHandshake,
  IconSearch,
  IconStack,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

interface PartnerCardProps {
  description: string;
  icon: TablerIcon;
  title: string;
}

const PartnerCard = ({ icon: Icon, title, description }: PartnerCardProps) => (
  <motion.div
    className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50"
    whileHover={{ y: -5 }}
  >
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
      <Icon
        className="text-primary transition-colors group-hover:text-primary-foreground"
        size={24}
      />
    </div>
    <h3 className="mb-4 font-bold text-xl">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const partners = [
  {
    icon: IconUsers,
    title: "Dedicated Enterprise Teams",
    description:
      "Cross-functional teams with solution architects, developers, DevOps engineers, and QA specialists.",
  },
  {
    icon: IconSearch,
    title: "Transparent Engagement",
    description:
      "Clear communication, milestone-based delivery, and full project visibility at every stage.",
  },
  {
    icon: IconWorld,
    title: "Scalable Global Delivery",
    description:
      "Offices across India and the USA serving enterprises in APAC, Middle East, Europe, and North America.",
  },
  {
    icon: IconStack,
    title: "Solution Architecture Expertise",
    description:
      "From system design to cloud deployment — we architect solutions built for scale and performance.",
  },
  {
    icon: IconHeartHandshake,
    title: "Long-term Technology Partnerships",
    description:
      "We don't just deliver projects — we build lasting relationships that drive continuous innovation.",
  },
  {
    icon: IconBolt,
    title: "Legacy Modernization",
    description:
      "Migrate and modernize legacy systems to cloud-native architectures with zero downtime.",
  },
];

export function PartnerSection() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto mb-20 max-w-[1440px] px-6 text-center md:px-12">
        <h2 className="mb-6 font-extrabold text-4xl tracking-tight md:text-5xl">
          Why Partner with <span className="text-primary">WorkHolo Labs</span>?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          We don't just write code — we engineer solutions that scale with your
          business.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 md:grid-cols-2 md:px-12 lg:grid-cols-3">
        {partners.map((partner) => (
          <PartnerCard
            description={partner.description}
            icon={partner.icon}
            key={partner.title}
            title={partner.title}
          />
        ))}
      </div>
    </section>
  );
}
