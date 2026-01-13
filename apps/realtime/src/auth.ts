import { env } from "@work-holo/env/realtime";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(new URL(env.AUTH_JWKS_URL));

export async function verifyAuthToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, JWKS);

  if (!payload.sub) {
    throw new Error("Missing user ID in token");
  }

  return payload.sub;
}
