import { linkOptions } from "@tanstack/react-router";
import { AdminRoleSchema } from "@work-holo/api/lib/schemas/auth";
import type { AdminRoleType } from "@work-holo/api/lib/types";
import { UAParser } from "ua-parser-js";
import type { OrgRolesType } from "@/lib/types";

export const generateSlug = (value: string) => {
  return (
    value
      .toLowerCase()
      // replace spaces and underscores with hyphens
      .replace(/[_\s]+/g, "-")
      // remove invalid characters (keep a-z, 0-9 and -)
      .replace(/[^a-z0-9-]/g, "")
      // collapse multiple hyphens
      .replace(/-+/g, "-")
      // trim leading/trailing hyphens
      .replace(/^-|-$/g, "")
  );
};

export const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const getBrowserInformation = (userAgent?: string | null) => {
  if (!userAgent) return "Unknown Device";

  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    if (!(result.browser.name || result.os.name)) {
      return "Unknown Device";
    }

    if (!result.browser.name) return result.os.name;
    if (!result.os.name) return result.browser.name;

    return `${result.browser.name}, ${result.os.name}`;
  } catch {
    return "Unknown Device";
  }
};

export const getOrgRouteByRole = (role: OrgRolesType, slug: string) => {
  if (role === "owner") {
    return linkOptions({ to: "/org/$slug/manage", params: { slug } });
  }
  if (role === "admin") {
    return linkOptions({ to: "/org/$slug/console", params: { slug } });
  }
  return linkOptions({ to: "/org/$slug/workspace", params: { slug } });
};

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return "0m";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-teal-700",
    "bg-violet-600",
    "bg-rose-600",
    "bg-blue-600",
    "bg-amber-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function validateAdminRole(
  role: string | null | undefined
): { isAdmin: true; role: AdminRoleType } | { isAdmin: false; role: null } {
  const result = AdminRoleSchema.safeParse(role);
  return result.success
    ? { isAdmin: true, role: result.data }
    : { isAdmin: false, role: null };
}
