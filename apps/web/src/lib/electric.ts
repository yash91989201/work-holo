import { env } from "@work-holo/env/web";

export const ELECTRIC_SHAPE_BASE_URL = `${env.VITE_SERVER_URL}/electric/shapes`;

export const fetchClient = ((
  url: URL | RequestInfo,
  init: RequestInit | undefined
) =>
  fetch(url, {
    ...init,
    credentials: "include",
  })) as typeof fetch;
