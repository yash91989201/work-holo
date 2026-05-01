import {
  IconArrowUpRight,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const team = [
  {
    name: "Eade Marren",
    role: "Chief Executive",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Savannah Nqueen",
    role: "Operations Head",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Cameron William",
    role: "Marketing Lead",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Olivia Fox",
    role: "Business Director",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
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
  hover: {
    y: -6,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

const socialLinks = [
  { icon: IconBrandLinkedin, label: "LinkedIn", href: "#" },
  { icon: IconBrandX, label: "Twitter", href: "#" },
  { icon: IconBrandInstagram, label: "Instagram", href: "#" },
];

const socialTrayVariants = {
  closed: { opacity: 0, y: 12, scale: 0.96 },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 26,
      staggerChildren: 0.05,
    },
  },
};

const socialItemVariants = {
  closed: { opacity: 0, x: 14 },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 380, damping: 24 },
  },
};

const arrowButtonVariants = {
  closed: { rotate: 0, scale: 1 },
  open: {
    rotate: 45,
    scale: 1.05,
    transition: { type: "spring", stiffness: 380, damping: 18 },
  },
};

export function TeamSection() {
  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="team"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex-1">
            <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
              [ MEET OUR TEAM ]
            </p>
            <h2 className="font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Creative Minds Behind
              <br />
              our Team.
            </h2>
          </div>

          <div className="flex items-center gap-8 lg:pb-2">
            <p className="max-w-50 text-muted-foreground text-sm">
              Our teams are customized to meet your unique ideas.
            </p>
          </div>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: (typeof team)[number] }) {
  return (
    <motion.div
      className="group relative"
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 transition-all duration-300 hover:border-border/70">
        {/* Image */}
        <div className="relative aspect-3/4 overflow-hidden">
          <img
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={member.image}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />

          {/* Social hover tray */}
          <motion.div
            animate="closed"
            className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2"
            initial="closed"
            variants={socialTrayVariants}
            whileHover="open"
          >
            <motion.div
              className="flex flex-col items-end gap-2 rounded-2xl border border-border/60 bg-background/90 p-2 shadow-black/10 shadow-lg backdrop-blur-md"
              variants={socialTrayVariants}
            >
              {socialLinks.map((social) => (
                <motion.a
                  className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/70 px-3 py-2 text-foreground text-xs shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                  href={social.href}
                  key={social.label}
                  onClick={(event) => event.preventDefault()}
                  variants={socialItemVariants}
                >
                  <social.icon className="size-3.5" />
                  {social.label}
                </motion.a>
              ))}
            </motion.div>

            <motion.button
              aria-label="Open social links"
              className="flex size-10 items-center justify-center rounded-full bg-primary shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors hover:bg-primary/90"
              type="button"
              variants={arrowButtonVariants}
            >
              <IconArrowUpRight className="size-5 text-primary-foreground" />
            </motion.button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="mb-1 font-semibold text-base text-foreground">
            {member.name}
          </h3>
          <p className="text-muted-foreground text-sm">{member.role}</p>
        </div>
      </div>
    </motion.div>
  );
}
