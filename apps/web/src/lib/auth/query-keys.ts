/**
 * Centralized query key builder for auth client operations
 * Provides type-safe and consistent query keys for React Query
 */

export const getAuthQueryKey = {
  // ─────────────────────────────────────────────
  // ORGANIZATION QUERY KEYS
  // ─────────────────────────────────────────────
  organization: {
    // List all organizations for current user
    list: () => ["auth", "organization", "list"] as const,

    // Get specific organization by ID
    byId: (organizationId: string) =>
      ["auth", "organization", "byId", organizationId] as const,

    // List invitations for an organization
    invitations: (organizationId: string) =>
      ["auth", "organization", "invitations", organizationId] as const,

    // List **members** of an organization
    members: (organizationId: string) =>
      ["auth", "organization", "members", organizationId] as const,

    // List **teams** of an organization (NEW)
    teams: (organizationId: string) =>
      ["auth", "organization", "teams", organizationId] as const,

    myTeamMemberships: () =>
      ["auth", "organization", "my-team-memberships"] as const,

    // Get organization roles
    roles: () => ["auth", "organization", "roles"] as const,

    // Get current user's role in active org
    userRole: () => ["auth", "organization", "userRole"] as const,

    // Get currently active organization
    active: () => ["auth", "organization", "active"] as const,
  },

  // ─────────────────────────────────────────────
  // USER QUERY KEYS
  // ─────────────────────────────────────────────
  user: {
    // Current user session user
    session: () => ["auth", "user", "session"] as const,

    // active org member role for user
    activeMemberRole: () => ["auth", "user", "active-member-role"] as const,

    // User profile (self)
    profile: () => ["auth", "user", "profile"] as const,

    // User by ID
    byId: (userId: string) => ["auth", "user", "byId", userId] as const,

    // User organizations
    organizations: (userId: string) =>
      ["auth", "user", "organizations", userId] as const,
  },

  // ─────────────────────────────────────────────
  // SESSION QUERY KEYS
  // ─────────────────────────────────────────────
  session: {
    // Current session
    current: () => ["auth", "session", "current"] as const,

    // List sessions for current user
    list: () => ["auth", "session", "list"] as const,

    // Specific session by its token
    byToken: (token: string) => ["auth", "session", "byToken", token] as const,
  },

  // ─────────────────────────────────────────────
  // INVITATION QUERY KEYS
  // ─────────────────────────────────────────────
  invitation: {
    // Get invitation by token
    byToken: (token: string) =>
      ["auth", "invitation", "byToken", token] as const,

    // User's received invitations
    list: () => ["auth", "invitation", "list"] as const,
  },

  // ─────────────────────────────────────────────
  // ADMIN QUERY KEYS
  // ─────────────────────────────────────────────
  admin: {
    // All users (admin)
    users: () => ["auth", "admin", "users"] as const,

    // All organizations (admin)
    organizations: () => ["auth", "admin", "organizations"] as const,

    // System statistics
    stats: () => ["auth", "admin", "stats"] as const,
  },

  // ─────────────────────────────────────────────
  // INVALIDATION HELPERS
  // ─────────────────────────────────────────────
  invalidation: {
    // Invalidate all auth queries
    all: () => ["auth"] as const,

    // Invalidate all organization queries
    allOrganizations: () => ["auth", "organization"] as const,

    // Invalidate specific organization and all its children
    organization: (organizationId: string) =>
      ["auth", "organization", organizationId] as const,

    // Invalidate all user queries
    allUsers: () => ["auth", "user"] as const,

    // Invalidate all session queries
    allSessions: () => ["auth", "session"] as const,

    // Invalidate current session + session list
    sessionData: () => ["auth", "session"] as const,

    // Invalidate only session list
    sessionList: () => ["auth", "session", "list"] as const,
  },
} as const;

// Helper: Check if a query key belongs to auth
export const isAuthQueryKey = (queryKey: unknown[]): boolean =>
  Array.isArray(queryKey) && queryKey[0] === "auth";

// Helper: All keys related to a specific organization
export const getOrganizationQueryKeys = (organizationId: string) => ({
  invitations: getAuthQueryKey.organization.invitations(organizationId),
  members: getAuthQueryKey.organization.members(organizationId),
  teams: getAuthQueryKey.organization.teams(organizationId),
  roles: getAuthQueryKey.organization.roles(),
  details: getAuthQueryKey.organization.byId(organizationId),
});
