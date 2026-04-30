import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@work-holo/ui/lib/utils"

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
)

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-6 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-base font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-4xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
