import type { PermissionInput } from "@work-holo/permission/client";
import {
  evaluateExpression,
  resolvePermission,
} from "@work-holo/permission/client";
import { use } from "react";
import { PermissionContext, type PermissionRecord } from "./provider";

/**
 * Returns the complete permission map from context.
 *
 * @example
 * ```tsx
 * const permissions = usePermissions();
 * const canCreate = permissions["channel.create"];
 * ```
 */
export function usePermissions(): PermissionRecord {
  return use(PermissionContext);
}

/**
 * Evaluates a permission input and returns whether it is allowed.
 * Accepts a string key or a selector callback with combinators.
 *
 * @param input - Permission key or selector callback.
 *
 * @example
 * ```tsx
 * // DSL accessor
 * const canCreate = useCan(p => p.channel.create);
 *
 * // With combinators
 * const canManage = useCan((p, { and }) =>
 *   and(p.channel.update, p.channel.delete)
 * );
 * ```
 */
export function useCan(input: PermissionInput): boolean {
  const permissions = use(PermissionContext);
  return evaluateExpression(resolvePermission(input), permissions);
}
