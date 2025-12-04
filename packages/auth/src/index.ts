import { expo } from "@better-auth/expo";
import { db } from "@work-holo/db";
import * as authSchema from "@work-holo/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  emailOTP,
  haveIBeenPwned,
  lastLoginMethod,
  magicLink,
  multiSession,
  organization,
  phoneNumber,
  twoFactor,
  username,
} from "better-auth/plugins";
import { env } from "./env";

export const auth = betterAuth({
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
    admin(),
    twoFactor(),
    username(),
    phoneNumber(),
    magicLink({
      sendMagicLink: () => {
        // TODO: Send email to user
      },
    }),
    emailOTP({
      async sendVerificationOTP() {
        // TODO: Send email to user
      },
    }),
    haveIBeenPwned(),
    lastLoginMethod(),
    multiSession(),
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
