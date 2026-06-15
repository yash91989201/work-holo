import { useSuspenseQuery } from "@tanstack/react-query";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";

export function useMyTeams() {
  const { data: myTeams, isRefetching } = useSuspenseQuery({
    queryKey: getAuthQueryKey.organization.myTeamMemberships(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.listUserTeams();

      if (error !== null) {
        return [];
      }
      return data;
    },
  });

  return {
    teams: myTeams ?? [],
    isRefetching,
  };
}
