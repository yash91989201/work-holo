/**
 * Custom Casbin matcher functions for colon-delimited object strings.
 *
 * The built-in `keyMatch2` uses `/` as a delimiter (URL-style paths).
 * Our permission objects use `:` as a delimiter (e.g. `channel:member`),
 * and request objects may include a trailing resource ID segment
 * (e.g. `channel:ch_abc123` or `channel:member:ch_abc123`).
 *
 * `keyMatchColon` handles this by matching when:
 *   1. The request object exactly equals the policy object, OR
 *   2. The request object equals the policy object with exactly one
 *      additional `:segment` appended (the resource ID), OR
 *   3. The request object has a `team:<id>:` scope prefix while the policy
 *      object is org-level (not team-scoped): strip the `team:<id>:` prefix
 *      from the request and retry matching. This lets org-level role grants
 *      apply to team-scoped resources.
 */

const AUTH_RESOURCES = new Set(["org", "team", "channel", "attendance"]);

function isTeamScopedPolicyObject(policyObj: string): boolean {
  const segments = policyObj.split(":");
  const scopeId = segments[1];
  const scopedResource = segments[2];

  return (
    segments.length >= 3 &&
    segments[0] === "team" &&
    typeof scopeId === "string" &&
    scopeId.length > 0 &&
    typeof scopedResource === "string" &&
    AUTH_RESOURCES.has(scopedResource)
  );
}

/**
 * Matches colon-delimited permission object strings.
 *
 * @example
 * keyMatchColon("channel", "channel")                                  // true  — exact match
 * keyMatchColon("channel:ch_abc123", "channel")                        // true  — policy + resourceId
 * keyMatchColon("channel:member", "channel:member")                    // true  — exact match
 * keyMatchColon("channel:member:ch_abc123", "channel:member")          // true  — policy + resourceId
 * keyMatchColon("team:t1:channel", "team:t1:channel")                  // true  — exact match
 * keyMatchColon("team:t1:channel:ch_abc", "team:t1:channel")           // true  — policy + resourceId
 * keyMatchColon("team:t1:team:member", "team:member")                  // true  — org-level team cascade
 * keyMatchColon("team:t1:channel:member:ch_abc", "channel:member")     // true  — org-level cascade
 * keyMatchColon("team:t1:channel:ch_abc", "channel")                   // true  — org-level cascade
 * keyMatchColon("channel:a:b", "channel")                              // false — two extra segments
 * keyMatchColon("team:t2:channel:member:c", "team:t1:channel:member")  // false — different team
 */
export function keyMatchColon(requestObj: string, policyObj: string): boolean {
  if (requestObj === policyObj) {
    return true;
  }

  const prefix = `${policyObj}:`;
  if (requestObj.startsWith(prefix)) {
    // Only allow exactly one additional segment (the resourceId).
    // If the remainder contains another `:`, it's a different structure.
    const remainder = requestObj.slice(prefix.length);
    if (remainder.length > 0 && !remainder.includes(":")) {
      return true;
    }
  }

  if (requestObj.startsWith("team:") && !isTeamScopedPolicyObject(policyObj)) {
    const afterTeamPrefix = requestObj.slice("team:".length);
    const teamIdEnd = afterTeamPrefix.indexOf(":");
    if (teamIdEnd > 0) {
      const strippedRequest = afterTeamPrefix.slice(teamIdEnd + 1);
      return keyMatchColon(strippedRequest, policyObj);
    }
  }

  return false;
}

/**
 * Casbin adapter function for keyMatchColon. Converts arguments to strings and delegates to keyMatchColon.
 */
export function keyMatchColonFunc(...args: unknown[]): boolean {
  const key1 = String(args[0]);
  const key2 = String(args[1]);
  return keyMatchColon(key1, key2);
}
