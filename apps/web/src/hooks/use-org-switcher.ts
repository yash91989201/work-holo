import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { getOrgRouteByRole } from "@/utils";
import { queryClient } from "@/utils/orpc";

export const useOrgSwitcher = () => {
  const navigate = useNavigate();
  const { mutate: switchOrganization, isPending: isSwitching } = useMutation({
    mutationFn: async ({
      organizationId,
      organizationSlug,
    }: {
      organizationId: string;
      organizationSlug: string;
    }) => {
      const { error } = await authClient.organization.setActive({
        organizationId,
        organizationSlug,
      });
      if (error !== null) {
        throw new Error(`Failed to switch organization: ${error}`);
      }

      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.invalidation.allOrganizations(),
      });
      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.user.activeMemberRole(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["active-organization"],
      });

      const newRole = await authClient.organization.getActiveMemberRole();

      return { role: newRole.data?.role ?? "member", organizationSlug };
    },
    onSuccess: ({ role, organizationSlug }) => {
      const route = getOrgRouteByRole(role, organizationSlug);
      navigate(route);
    },
    onError: (err) => {
      console.error("Error switching organization:", err);
    },
  });

  const createOrganization = () => {
    navigate({ to: "/org/new" });
  };
  return { isSwitching, switchOrganization, createOrganization };
};
