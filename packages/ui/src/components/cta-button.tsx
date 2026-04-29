import { IconArrowUpRight } from "@tabler/icons-react";
import { type HTMLMotionProps, motion } from "motion/react";
import type * as React from "react";
import { cn } from "../lib/utils";

interface CTAButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function CTAButton({ className, children, icon, ...props }: CTAButtonProps) {
  return (
    <motion.button
      className={cn(
        "group relative inline-flex items-center justify-between gap-4 overflow-hidden rounded-full bg-primary px-2 py-2 pr-2 font-medium text-black text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      data-slot="cta-button"
      initial="initial"
      variants={{ initial: {}, hover: {} }}
      whileHover="hover"
      {...props}
    >
      {/* Expanding background circle */}
      <motion.div
        className="absolute top-1/2 right-2 z-0 h-8 -translate-y-1/2 rounded-full bg-black"
        style={{ originX: 1 }}
        variants={{
          initial: { width: 32, x: 0 },
          hover: {
            width: "calc(100% - 16px)",
            x: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      />

      {/* Text */}
      <motion.span
        className="relative z-10 px-4"
        variants={{
          initial: { color: "#000000" },
          hover: {
            color: "#ffffff",
            transition: { duration: 0.3, ease: "easeOut" },
          },
        }}
      >
        {children}
      </motion.span>

      {/* Icon container */}
      <motion.div
        className="relative z-10 flex size-8 items-center justify-center rounded-full bg-black text-white"
      >
        <motion.div
          variants={{
            initial: { x: 0, y: 0, rotate: 0 },
            hover: {
              x: 2,
              y: -2,
              rotate: 0,
              transition: { duration: 0.3, ease: "easeOut" },
            },
          }}
        >
          {icon ?? <IconArrowUpRight className="size-4" />}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

export { CTAButton };
