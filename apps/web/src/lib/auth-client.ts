import { passkeyClient } from "@better-auth/passkey/client";
import { env } from "@work-holo/env/web";
import {
  adminClient,
  emailOTPClient,
  jwtClient,
  lastLoginMethodClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  phoneNumberClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [
    passkeyClient(),
    twoFactorClient(),
    usernameClient(),
    phoneNumberClient(),
    magicLinkClient(),
    emailOTPClient(),
    lastLoginMethodClient(),
    multiSessionClient(),
    jwtClient(),
    adminClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});
