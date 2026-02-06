import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

export const usePermissions = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["auth", "permissions"],
    queryFn: async () => {
      const result = await api.auth.permissions.check();
      return result;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return data;
};

export const useUserRole = () => {
  const { role } = usePermissions();
  return role;
};

export const useUserPermissions = () => {
  const { permissions } = usePermissions();
  return permissions;
};
