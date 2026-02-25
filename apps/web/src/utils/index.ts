import { linkOptions } from "@tanstack/react-router";
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

export const getNameInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
