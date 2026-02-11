import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryUtils } from "@/utils/orpc";

export function useWorkBlocks() {
  const { mutateAsync: startBlock, isPending: isStarting } = useMutation(
    queryUtils.attendance.workBlock.start.mutationOptions({
      onSuccess: () => {
        toast.success("Work session started");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const { mutateAsync: endBlock, isPending: isEnding } = useMutation(
    queryUtils.attendance.workBlock.end.mutationOptions({
      onSuccess: () => {
        toast.success("Work session ended");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return {
    startBlock,
    endBlock,
    isStarting,
    isEnding,
    isLoading: isStarting || isEnding,
  };
}
