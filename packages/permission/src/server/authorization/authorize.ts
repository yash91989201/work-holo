import { checkBit } from "../../core/bitset";
import type {
  AuthorizationRequest,
  AuthorizationResult,
} from "../../core/types";
import { getCachedDecision, setCachedDecision } from "../cache/decisionCache";
import { getOrCompileBitset } from "../compilers/bitsetCompiler";
import { getCasbinEnforcer } from "./enforcer";

export async function authorize(
  request: AuthorizationRequest
): Promise<AuthorizationResult> {
  const start = performance.now();
  const { userId, orgId, permission } = request;

  const cached = await getCachedDecision(
    userId,
    orgId,
    permission.permissionKey
  );
  if (cached) {
    return {
      allowed: cached.allowed,
      decidedBy: "cache",
      durationMs: performance.now() - start,
      permissionKey: permission.permissionKey,
    };
  }

  const bitsetData = await getOrCompileBitset(userId, orgId);
  const bitsetAllowed = checkBit(bitsetData.bitset, permission.bitIndex);

  if (!bitsetAllowed) {
    await setCachedDecision(userId, orgId, permission.permissionKey, false);
    return {
      allowed: false,
      decidedBy: "bitset",
      durationMs: performance.now() - start,
      permissionKey: permission.permissionKey,
    };
  }

  const enforcer = await getCasbinEnforcer();
  const domain = `org:${orgId}`;
  const attrs = permission.attrs ?? {};

  const allowed = await enforcer.enforce(
    userId,
    domain,
    { name: permission.obj, ownerId: attrs.ownerId ?? "" },
    permission.act
  );

  await setCachedDecision(userId, orgId, permission.permissionKey, allowed);

  return {
    allowed,
    decidedBy: "casbin",
    durationMs: performance.now() - start,
    permissionKey: permission.permissionKey,
  };
}

export function authorizeWithOwnerBypass(
  request: AuthorizationRequest,
  ownerId: string
): AuthorizationResult | Promise<AuthorizationResult> {
  if (request.userId === ownerId) {
    return {
      allowed: true,
      decidedBy: "owner",
      durationMs: 0,
      permissionKey: request.permission.permissionKey,
    };
  }

  return authorize(request);
}
