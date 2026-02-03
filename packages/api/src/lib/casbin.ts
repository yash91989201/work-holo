import { db } from "@work-holo/db";
import { casbinRule } from "@work-holo/db/schema/casbin";
import { type Enforcer, newEnforcer, newModelFromString } from "casbin";
import DrizzleAdapter from "drizzle-adapter";

const modelDefinition = `
# RBAC Model for Communication Module
# Request: subject (role), object (resource), action
[request_definition]
r = sub, obj, act

# Policy: role, resource, action
[policy_definition]
p = sub, obj, act

# Role hierarchy for inheritance
[role_definition]
g = _, _

# Policy effect - allow if any policy matches
[policy_effect]
e = some(where (p.eft == allow))

# Matchers - check if role has permission on resource for action
[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
`;

let enforcerPromise: Promise<Enforcer> | null = null;

export function getCasbinEnforcer(): Promise<Enforcer> {
  if (!enforcerPromise) {
    enforcerPromise = (async () => {
      const adapter = await DrizzleAdapter.newAdapter({
        db,
        table: casbinRule,
      });
      const model = newModelFromString(modelDefinition);
      const enforcer = await newEnforcer(model, adapter);
      await enforcer.loadPolicy();
      return enforcer;
    })();
  }

  return enforcerPromise;
}
