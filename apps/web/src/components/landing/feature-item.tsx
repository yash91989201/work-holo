import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface FeatureItemProps {
  /** Whether this item is the "active/expanded" one */
  active?: boolean;
  className?: string;
  description?: string;
  linkHref?: string;
  linkText?: string;
  title: string;
}

export function FeatureItem({
  title,
  description,
  linkText,
  linkHref,
  active = false,
  className,
}: FeatureItemProps) {
  return (
    <div
      className={cn(
        "border-l-[3px] py-4 pl-5 transition-all",
        active
          ? "border-[#7C5CFF]"
          : "border-transparent hover:border-muted-foreground/30",
        className
      )}
    >
      <h3
        className={cn(
          "font-semibold text-2xl",
          active ? "text-[#7C5CFF]" : "text-foreground"
        )}
      >
        {title}
      </h3>
      {active && description && (
        <p className="mt-2.5 text-[#7C5CFF] text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {active && linkText && linkHref && (
        <Link
          className="mt-3 inline-flex items-center gap-1.5 text-[#7C5CFF] text-base hover:underline"
          to={linkHref}
        >
          {linkText} →
        </Link>
      )}
    </div>
  );
}

interface FeatureListItemProps {
  subtitle?: string;
  title: string;
}

/**
 * Simple horizontal-divider separated feature list item
 * (used inside cards like the AI features card)
 */
export function FeatureListItem({ title, subtitle }: FeatureListItemProps) {
  return (
    <div className="border-border/50 border-b py-5 last:border-b-0">
      <p className="text-base">
        <span className="font-semibold">{title}:</span>{" "}
        {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
      </p>
    </div>
  );
}
