import { useSuspenseQuery } from "@tanstack/react-query";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { useListOrgTeams } from "./use-list-org-teams";
import { useSession } from "./use-session";

export function useMyTeams(role: string | undefined) {
  const { teams, refetchTeams, isRefetching } = useListOrgTeams();
  const session = useSession();
  const isOwnerOrAdmin = role === "owner" || role === "admin";
  const activeOrganizationId = session?.session.activeOrganizationId;

  const { data: myTeams } = useSuspenseQuery({
    queryKey: [
      ...getAuthQueryKey.organization.myTeamMemberships(),
      role,
      activeOrganizationId,
    ],
    queryFn: async () => {
      if (isOwnerOrAdmin || !role) {
        return null;
      }

      const { data, error } = await authClient.organization.listUserTeams();
      if (error !== null) {
        return [];
      }

      return data;
    },
  });

  if (isOwnerOrAdmin || !role) {
    return { teams, refetchTeams, isRefetching };
  }

  const myTeamIds = new Set((myTeams ?? []).map((team) => team.id));

  return {
    teams: teams.filter((team) => myTeamIds.has(team.id)),
    refetchTeams,
    isRefetching,
  };
}
