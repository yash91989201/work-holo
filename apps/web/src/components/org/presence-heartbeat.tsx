import { useSuspenseQuery } from "@tanstack/react-query";
import { usePresenceHeartbeat } from "@/hooks/use-presence";
import { queryUtils } from "@/utils/orpc";

export function PresenceHeartbeat() {
  const { data: attendance } = useSuspenseQuery(
    queryUtils.attendance.records.getStatus.queryOptions({})
  );

  const hasCheckedIn = Boolean(attendance?.checkInTime);
  const hasCheckedOut = Boolean(attendance?.checkOutTime);
  const isWorking = hasCheckedIn && !hasCheckedOut;

  usePresenceHeartbeat({
    enabled: isWorking,
    punchedIn: isWorking,
    onBreak: false,
  });

  return null;
}
