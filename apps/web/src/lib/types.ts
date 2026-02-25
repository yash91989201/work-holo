// AUTO-GENERATED FILE. DO NOT EDIT.
// Run `bun run generate:types` to refresh
import type { z } from "zod";
import type {
  AcceptInvitationFormSchema,
  LogInFormSchema,
  SignUpFormSchema,
} from "@/lib/schemas/auth/index";
import type { CreateChannelFormSchema } from "@/lib/schemas/communication/channel";
import type {
  InvitationFormSchema,
  UpdateMemberRoleSchema,
} from "@/lib/schemas/member/index";
import type {
  CreateOrgFormSchema,
  OrgRolesSchema,
} from "@/lib/schemas/org/index";
import type {
  ProfileEmailSchema,
  ProfileImageSchema,
  ProfileNameSchema,
  ProfileUsernameFormatSchema,
  ProfileUsernameSchema,
} from "@/lib/schemas/settings/profile";
import type { ChangePasswordFormSchema } from "@/lib/schemas/settings/security";
import type { CreateTeamFormSchema } from "@/lib/schemas/team/index";

export type AcceptInvitationFormType = z.infer<
  typeof AcceptInvitationFormSchema
>;
export type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;
export type CreateChannelFormType = z.infer<typeof CreateChannelFormSchema>;
export type CreateOrgFormType = z.infer<typeof CreateOrgFormSchema>;
export type CreateTeamFormType = z.infer<typeof CreateTeamFormSchema>;
export type InvitationFormType = z.infer<typeof InvitationFormSchema>;
export type LogInFormType = z.infer<typeof LogInFormSchema>;
export type OrgRolesType = z.infer<typeof OrgRolesSchema>;
export type ProfileEmailType = z.infer<typeof ProfileEmailSchema>;
export type ProfileImageType = z.infer<typeof ProfileImageSchema>;
export type ProfileNameType = z.infer<typeof ProfileNameSchema>;
export type ProfileUsernameFormatType = z.infer<
  typeof ProfileUsernameFormatSchema
>;
export type ProfileUsernameType = z.infer<typeof ProfileUsernameSchema>;
export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
export type UpdateMemberRoleType = z.infer<typeof UpdateMemberRoleSchema>;
