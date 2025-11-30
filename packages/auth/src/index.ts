import { expo } from "@better-auth/expo";
import { env } from "@work-holo/auth/env";
import { db } from "@work-holo/db";
import * as authSchema from "@work-holo/db/schema/auth";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    camelCase: true,
  }),
  trustedOrigins: [...env.CORS_ORIGIN, "work-holo://"],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    expo(),
    organization({
      teams: {
        enabled: true,
      },
      // sendInvitationEmail(data) {
      //   const invitationLink = `${env.WEB_URL}/accept-invitation/${data.id}?email=${data.email}`;
      //
      //   await sendOrgInvitationEmail({
      //     email: data.email,
      //     invitationLink,
      //     invitedBy: data.inviter.user.name,
      //     role: data.role,
      //     orgName: data.organization.name,
      //   });
      // },
    }),
  ],
});
