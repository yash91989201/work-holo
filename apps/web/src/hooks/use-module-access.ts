import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, queryUtils } from "@/utils/orpc";

export function useCheckModuleAccess(module: string) {
  return useQuery(
    queryUtils.org.moduleConfig.checkModuleAccess.queryOptions({
      input: { module },
      staleTime: 5 * 60 * 1000,
    })
  );
}

export function useModuleConfig(module: string) {
  return useQuery(
    queryUtils.org.moduleConfig.getModuleConfig.queryOptions({
      input: { module },
    })
  );
}

export function useUpdateModuleConfig() {
  return useMutation(
    queryUtils.org.moduleConfig.updateModuleConfig.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryUtils.org.moduleConfig.key(),
        });
      },
    })
  );
}
