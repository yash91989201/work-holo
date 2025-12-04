import { useSuspenseQuery } from "@tanstack/react-query";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";

export const useSessionList = () => {
  const { data: sessions } = useSuspenseQuery({
    queryKey: getAuthQueryKey.session.list(),
    queryFn: async () => {
      const { data, error } = await authClient.listSessions();
      if (error !== null) {
        throw new Error(error.message || "Failed to fetch sessions");
      }

      return data;
    },
  });

  return sessions;
};
