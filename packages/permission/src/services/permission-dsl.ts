import { Attendance } from "../lib/dsl/attendance";
import { Channel } from "../lib/dsl/channel";
import { Org } from "../lib/dsl/org";
import { Team } from "../lib/dsl/team";

/**
 * Provides scoped DSL accessors for building permission descriptors.
 */
export class PermissionDSL {
  private readonly orgId: string;

  /**
   * Creates a DSL wrapper for one organization context.
   */
  constructor(orgId: string) {
    this.orgId = orgId;
  }

  /**
   * Returns organization-scoped permission builders.
   */
  get org() {
    return Org(this.orgId);
  }

  /**
   * Returns team-scoped permission builders.
   */
  team(teamId: string) {
    return Team(teamId);
  }

  /**
   * Returns channel permission builders, optionally team scoped.
   */
  channel() {
    return Channel();
  }

  /**
   * Returns attendance permission builders, optionally team scoped.
   */
  attendance() {
    return Attendance();
  }
}
