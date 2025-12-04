import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";

interface UpdateProfileParams {
  name?: string;
  username?: string;
  email?: string;
  image?: string | undefined | null;
  displayUsername?: string;
}

export function useProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileParams) => {
      const result = await authClient.updateUser(data);

      if (result.error) {
        throw new Error(result.error.message || "Failed to update profile");
      }

      return result.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.session.current(),
      });
      queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.user.profile(),
      });

      // Show success toast based on what was updated
      if (variables.name) {
        toast.success("Name updated successfully");
      }
      if (variables.username) {
        toast.success("Username updated successfully");
      }
      if (variables.email) {
        toast.success(
          "Email updated successfully. Please verify your new email."
        );
      }
      if (variables.image) {
        toast.success("Profile image updated successfully");
      }
    },
    onError: (error: Error) => {
      // Handle specific error cases
      if (error.message.includes("network")) {
        toast.error("Network error. Please check your connection.");
        return;
      }

      if (
        error.message.includes("unauthorized") ||
        error.message.includes("401")
      ) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      if (error.message.includes("validation")) {
        toast.error("Please check your input and try again.");
        return;
      }

      // Generic fallback
      toast.error(error.message || "Failed to update profile");
    },
  });
}
