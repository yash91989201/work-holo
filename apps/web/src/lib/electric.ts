import { env } from "@/env";

export const ELECTRIC_SHAPE_BASE_URL = `${env.VITE_SERVER_URL}/api/electric/shapes`;

export const fetchClient = ((
  url: URL | RequestInfo,
  init: RequestInit | undefined
) =>
  fetch(url, {
    ...init,
    credentials: "include",
  })) as typeof fetch;
