import { cn } from "@work-holo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const cardVariants = cva(
  "group/card relative flex flex-col gap-6 overflow-hidden py-6 text-sm transition-shadow duration-300 ease-out has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4",
  {
    variants: {
      variant: {
        default:
          "rounded-4xl bg-card text-card-foreground shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl",
        neumorphic: [
          "rounded-2xl bg-background text-card-foreground",
          "shadow-[8px_8px_16px_rgba(163,163,163,0.6),-8px_-8px_16px_rgba(255,255,255,1),0_0_20px_rgba(139,92,246,0.12)] hover:shadow-[10px_10px_20px_rgba(163,163,163,0.7),-10px_-10px_20px_rgba(255,255,255,1),0_0_32px_rgba(139,92,246,0.2)]",
          "dark:shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05),0_0_20px_rgba(168,130,255,0.15)] dark:hover:shadow-[10px_10px_20px_rgba(0,0,0,0.7),-10px_-10px_20px_rgba(255,255,255,0.08),0_0_32px_rgba(168,130,255,0.25)]",
          "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        ],
      },
      size: {
        default: "",
        sm: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      className={cn(cardVariants({ variant, size, className }))}
      data-size={size}
      data-slot="card"
      data-variant={variant}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-heading font-medium text-base", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center rounded-b-4xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className
      )}
      data-slot="card-footer"
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
