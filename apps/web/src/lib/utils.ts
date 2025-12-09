import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTimestamp(date: Date | string): {
  relative: string;
  absolute: string;
} {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return {
    relative: formatDistanceToNow(dateObj, { addSuffix: true }),
    absolute: format(dateObj, "PPpp"),
  };
}
