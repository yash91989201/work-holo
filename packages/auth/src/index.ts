import { expo } from "@better-auth/expo";
import { passkey } from "@better-auth/passkey";
import { createDb } from "@work-holo/db";
import * as authSchema from "@work-holo/db/schema/auth";
import { assignOrgUserRole } from "@work-holo/permission";
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

export function createAuth(db = createDb()) {
  return betterAuth({
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
      admin({
        defaultRole: "user",
        adminRole: ["admin", "super_admin", "support"],
      }),
      twoFactor(),
      username(),
      phoneNumber(),
      passkey(),
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
          defaultTeam: {
            enabled: false,
          },
        },
        organizationHooks: {
          afterCreateOrganization: async ({ organization: org, member }) => {
            await assignOrgUserRole(db, member.userId, org.id, member.role);
          },
          afterAddMember: async ({ member, organization: org }) => {
            await assignOrgUserRole(db, member.userId, org.id, member.role);
          },
          afterAcceptInvitation: async ({ member, organization: org }) => {
            await assignOrgUserRole(db, member.userId, org.id, member.role);
          },
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
}

export const auth = createAuth();
