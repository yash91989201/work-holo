import { useSuspenseQuery } from "@tanstack/react-query";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { useListOrgTeams } from "./use-list-org-teams";
import { useSession } from "./use-session";

export function useMyTeams(role: string | undefined) {
  const { teams, refetchTeams, isRefetching } = useListOrgTeams();
  const session = useSession();
  const isOwnerOrAdmin = role === "owner" || role === "admin";

  const { data: myTeamMemberships } = useSuspenseQuery({
    queryKey: [...getAuthQueryKey.organization.myTeamMemberships(), role],
    queryFn: async () => {
      if (isOwnerOrAdmin || !role) {
        return null;
      }
      const { data, error } = await authClient.organization.listTeamMembers();
      if (error !== null) {
        return [];
      }
      return data;
    },
  });

  if (isOwnerOrAdmin || !role) {
    return { teams, refetchTeams, isRefetching };
  }

  const userId = session?.user?.id;
  const myTeamIds = new Set(
    (myTeamMemberships ?? [])
      .filter((tm) => tm.userId === userId)
      .map((tm) => tm.teamId)
  );

  return {
    teams: teams.filter((t) => myTeamIds.has(t.id)),
    refetchTeams,
    isRefetching,
  };
}
