import { type ClassValue, clsx } from "clsx";

const CUID2_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
export function generateId(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => CUID2_CHARS[b % 36]).join("");
}

import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTimestamp(date: Date | string): {
  relative: string;
  absolute: string;
  formatted: string;
} {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const isToday =
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();

  const formatted = isToday
    ? format(dateObj, "h:mm a")
    : format(dateObj, "h:mm a MMM d, yyyy");

  return {
    relative: formatDistanceToNow(dateObj, { addSuffix: true }),
    absolute: format(dateObj, "PPpp"),
    formatted,
  };
}

export function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
