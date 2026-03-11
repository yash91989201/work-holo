import type * as React from "react";
import { cn } from "@/lib/utils";

type SectionVariant = "white" | "purple" | "gray";

interface SectionWrapperProps extends React.ComponentProps<"section"> {
  variant?: SectionVariant;
}

const variantStyles: Record<SectionVariant, string> = {
  white: "bg-background text-foreground",
  purple: "bg-[#7C5CFF] text-white dark:bg-[#6B4CE6]",
  gray: "bg-muted/40 text-foreground",
};

export function SectionWrapper({
  variant = "white",
  className,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      className={cn(
        "w-full py-20 sm:py-24 lg:py-28",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
