import { motion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { CTAButton } from "@work-holo/ui/components/cta-button";

const team = [
  {
    name: "Eade Marren",
    role: "Chief Executive",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Savannah Nqueen",
    role: "Operations Head",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Cameron William",
    role: "Marketing Lead",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Olivia Fox",
    role: "Business Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TeamSection() {
  return (
    <section className="relative bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div className="flex-1">
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
              [ MEET OUR TEAM ]
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight">
              Creative Minds Behind
              <br />
              our Team.
            </h2>
          </div>

          <div className="flex items-center gap-8 lg:pb-2">
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Our teams are customized to meet your unique ideas.
            </p>
            <CTAButton icon={<IconArrowUpRight className="size-4" />}>
              More Member
            </CTAButton>
          </div>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TeamCard({
  member,
}: {
  member: (typeof team)[number];
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="relative bg-card/50 border border-border/40 hover:border-border/70 rounded-2xl overflow-hidden transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

          {/* Arrow Button */}
          <div className="absolute bottom-4 right-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary cursor-pointer hover:bg-primary/90 transition-colors">
              <IconArrowUpRight className="size-5 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">
            {member.name}
          </h3>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </div>
    </motion.div>
  );
}
