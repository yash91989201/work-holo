import { orgMemberProcedure } from "../../index";

/**
 * Router for permission-related operations.
 *
 * Provides endpoints for frontend permission hydration:
 * - get: Returns complete permission map for current user in current org
 *
 * The permission map contains all 64 permissions with their boolean status,
 * allowing the frontend to conditionally render UI without making individual
 * permission checks.
 */
export const permissionRouter = {
  get: orgMemberProcedure.handler(async ({ context }) => {
    const permissionMap = await context.permission.getPermissionMap();
    return permissionMap;
  }),
};
