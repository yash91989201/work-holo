import { z } from "zod";

export const CustomRolePermissionSchema = z.object({
  key: z.string(),
  resource: z.string(),
  subResource: z.string(),
  action: z.string(),
  description: z.string().nullable().optional(),
  bitIndex: z.number(),
});

export const CustomRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().nullable().optional(),
  scope: z.literal("team"),
  permissionKeys: z.array(z.string()),
  permissionCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
});

export const ListCustomRolesInput = z.object({}).default({});

export const ListCustomRolesOutput = z.object({
  roles: z.array(CustomRoleSchema),
  availablePermissions: z.array(CustomRolePermissionSchema),
});

export const CreateCustomRoleInput = z.object({
  displayName: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  permissionKeys: z.array(z.string()).min(1),
});

export const UpdateCustomRoleInput = z.object({
  roleTemplateId: z.string(),
  displayName: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  permissionKeys: z.array(z.string()).min(1),
});

export const DeleteCustomRoleInput = z.object({
  roleTemplateId: z.string(),
});

export const GetMemberRoleAssignmentsInput = z.object({
  userId: z.string(),
});

export const MemberCustomRoleAssignmentSchema = z.object({
  id: z.string(),
  roleTemplateId: z.string(),
  roleDisplayName: z.string(),
  roleDescription: z.string().nullable().optional(),
  teamId: z.string(),
  teamName: z.string(),
  assignedAt: z.date(),
});

export const AssignableCustomRoleSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  description: z.string().nullable().optional(),
});

export const AssignableTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const GetMemberRoleAssignmentsOutput = z.object({
  assignments: z.array(MemberCustomRoleAssignmentSchema),
  availableRoles: z.array(AssignableCustomRoleSchema),
  availableTeams: z.array(AssignableTeamSchema),
});

export const AssignCustomRoleInput = z.object({
  userId: z.string(),
  roleTemplateId: z.string(),
  teamId: z.string(),
});

export const RevokeCustomRoleInput = z.object({
  userId: z.string(),
  roleTemplateId: z.string(),
  teamId: z.string(),
});

export const CustomRoleMutationOutput = z.object({
  success: z.literal(true),
  roleTemplateId: z.string().optional(),
});
