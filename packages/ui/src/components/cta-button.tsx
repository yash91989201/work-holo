import { IconArrowUpRight } from "@tabler/icons-react";
import { type HTMLMotionProps, motion } from "motion/react";
import type * as React from "react";
import { cn } from "../lib/utils";

interface CTAButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

function CTAButton({
  className,
  children,
  icon,
  href,
  type,
  ...props
}: CTAButtonProps) {
  const baseClass = cn(
    "group relative inline-flex items-center overflow-hidden rounded-full bg-primary px-2 py-2 font-medium text-black text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    className
  );

  const inner = (
    <>
      {/* Expanding background circle — starts behind the icon at the right edge */}
      <motion.div
        className="absolute top-1/2 right-1 z-0 h-8 -translate-y-1/2 rounded-full bg-black"
        style={{ originX: 1 }}
        variants={{
          initial: { width: 32, x: 0 },
          hover: {
            width: "calc(100% - 8px)",
            x: 0,
            transition: { duration: 0.4, ease: "easeInOut" },
          },
        }}
      />

      {/* Text — centered with right padding so it never overlaps the icon */}
      <motion.span
        className="relative z-10 w-full px-4 pr-12 text-center"
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

      {/* Icon container — absolutely positioned at the right edge */}
      <motion.div className="absolute top-1/2 right-1 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white">
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
    </>
  );

  if (href) {
    return (
      <motion.a
        className={baseClass}
        data-slot="cta-button"
        href={href}
        initial="initial"
        variants={{ initial: {}, hover: {} }}
        whileHover="hover"
        {...(props as React.ComponentPropsWithoutRef<typeof motion.a>)}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={baseClass}
      data-slot="cta-button"
      initial="initial"
      type={type ?? "button"}
      variants={{ initial: {}, hover: {} }}
      whileHover="hover"
      {...props}
    >
      {inner}
    </motion.button>
  );
}

export { CTAButton };
