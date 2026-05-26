import {
  IconCheck,
  IconClockHour4Filled,
  IconLogout,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@work-holo/ui/components/sidebar";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSetManualStatus } from "@/hooks/use-presence";
import { queryClient, queryUtils } from "@/utils/orpc";

export function QuickActionGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Suspense fallback={<MarkAttendanceButton.Fallback />}>
              <MarkAttendanceButton />
            </Suspense>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Suspense fallback={<WorkBlockToggle.Fallback />}>
              <WorkBlockToggle />
            </Suspense>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const WorkBlockToggle = () => {
  const { state } = useSidebar();
  const { data: attendance, refetch: refetchAttendance } = useSuspenseQuery(
    queryUtils.attendance.records.getStatus.queryOptions({})
  );

  const { data: activeBlock, refetch: refetchBlock } = useQuery(
    queryUtils.attendance.workBlock.getActive.queryOptions({
      input: {
        attendanceId: attendance?.id ?? "",
      },
      enabled: !!attendance?.id,
    })
  );

  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    if (!activeBlock?.startedAt) {
      setElapsed("00:00:00");
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(activeBlock.startedAt).getTime();
      const now = Date.now();
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBlock]);

  const { mutateAsync: startBlock, isPending: isStarting } = useMutation(
    queryUtils.attendance.workBlock.start.mutationOptions({
      onSuccess: async () => {
        toast.success("Work session started");
        await Promise.all([refetchAttendance(), refetchBlock()]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const { mutateAsync: setManualStatus } = useSetManualStatus();

  const { mutateAsync: endBlock, isPending: isEnding } = useMutation(
    queryUtils.attendance.workBlock.end.mutationOptions({
      onSuccess: async () => {
        toast.success("Work session paused");
        // Set status to away when pausing work
        await setManualStatus({
          status: "away",
        });
        await Promise.all([refetchAttendance(), refetchBlock()]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const hasCheckedIn = !!attendance?.checkInTime;
  const hasCheckedOut = !!attendance?.checkOutTime;
  const canToggle = hasCheckedIn && !hasCheckedOut;
  const isPending = isStarting || isEnding;
  const isWorking = !!activeBlock;

  if (!canToggle) {
    return null;
  }

  const handleToggle = async () => {
    if (!attendance?.id) return;

    if (isWorking) {
      await endBlock({
        attendanceId: attendance.id,
        endReason: "manual",
      });
    } else {
      await startBlock({ attendanceId: attendance.id });
    }
  };

  const tooltipContent = isWorking ? `Working (${elapsed})` : "Start Work";

  return (
    <SidebarMenuButton
      className={
        isWorking
          ? "border-amber-700 bg-amber-500 font-medium text-white hover:bg-amber-600 hover:text-white [&>svg:first-child]:border-white/30! [&>svg:first-child]:bg-white! [&>svg:first-child]:text-amber-500!"
          : "border-amber-600/50 bg-amber-500/15 font-medium text-amber-600 hover:bg-amber-500/25 hover:text-amber-600 [&>svg:first-child]:border-amber-300! [&>svg:first-child]:bg-white! [&>svg:first-child]:text-amber-500!"
      }
      disabled={isPending}
      onClick={handleToggle}
      tooltip={state === "collapsed" ? tooltipContent : undefined}
    >
      {isWorking ? (
        <IconPlayerPause className="animate-pulse" />
      ) : (
        <IconPlayerPlay />
      )}
      <span>{isWorking ? "Pause Work" : "Start Work"}</span>
      {isWorking && state === "expanded" && (
        <span className="ml-auto font-mono text-muted-foreground text-xs">
          {elapsed}
        </span>
      )}
    </SidebarMenuButton>
  );
};

WorkBlockToggle.Fallback = () => (
  <SidebarMenuButton disabled>
    <Skeleton className="h-4 w-4 rounded-sm" />
    <Skeleton className="h-4 w-20" />
  </SidebarMenuButton>
);

const MarkAttendanceButton = () => {
  const { data: attendance, refetch } = useSuspenseQuery(
    queryUtils.attendance.records.getStatus.queryOptions({})
  );

  const [showPunchOutDialog, setShowPunchOutDialog] = useState(false);

  const { mutateAsync: punchIn, isPending: isPunchingIn } = useMutation(
    queryUtils.attendance.clock.punchIn.mutationOptions({
      onSuccess: async () => {
        toast.success("Checked in successfully!");

        queryClient.refetchQueries(
          queryUtils.attendance.workBlock.list.queryOptions({
            input: {
              attendanceId: attendance?.id ?? "",
            },
          })
        );
        await refetch();
      },
    })
  );

  const { mutateAsync: punchOut, isPending: isPunchingOut } = useMutation(
    queryUtils.attendance.clock.punchOut.mutationOptions({
      onSuccess: async () => {
        toast.success("Checked out successfully!");
        setShowPunchOutDialog(false);
        await refetch();
      },
      onError: (error) => {
        toast.error(error.message);
        setShowPunchOutDialog(false);
      },
    })
  );

  const hasCheckedIn = !!attendance?.checkInTime;
  const hasCheckedOut = !!attendance?.checkOutTime;
  const isActionPending = isPunchingIn || isPunchingOut;

  const handlePunchOut = () => {
    setShowPunchOutDialog(true);
  };

  const confirmPunchOut = async () => {
    await punchOut({});
  };

  if (!hasCheckedIn) {
    return (
      <SidebarMenuButton
        className="border-green-700 bg-green-600 font-medium text-white hover:bg-green-700 hover:text-white active:bg-green-700 active:text-white [&>svg:first-child]:border-white/30! [&>svg:first-child]:bg-white! [&>svg:first-child]:text-green-600!"
        disabled={isActionPending}
        onClick={() => punchIn({})}
        tooltip="Punch In"
      >
        {isPunchingIn ? (
          <>
            <Spinner className="mr-2" />
            <span>Punching In…</span>
          </>
        ) : (
          <>
            <IconClockHour4Filled />
            <span>Punch In</span>
          </>
        )}
      </SidebarMenuButton>
    );
  }

  if (hasCheckedIn && !hasCheckedOut) {
    return (
      <>
        <SidebarMenuButton
          className="border-red-700 bg-red-600 font-medium text-white hover:bg-red-700 hover:text-white active:bg-red-700 active:text-white [&>svg:first-child]:border-white/30! [&>svg:first-child]:bg-white! [&>svg:first-child]:text-red-600!"
          disabled={isActionPending}
          onClick={handlePunchOut}
          tooltip="Punch Out"
        >
          {isPunchingOut ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
              <span>Punching Out…</span>
            </>
          ) : (
            <>
              <IconLogout />
              <span>Punch Out</span>
            </>
          )}
        </SidebarMenuButton>

        <Dialog onOpenChange={setShowPunchOutDialog} open={showPunchOutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Punch Out</DialogTitle>
              <DialogDescription>
                Confirm punch out? This action cannot be undone, preventing
                further check-ins today. Unfinished work sessions will be
                automatically paused.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={isPunchingOut}
                onClick={() => setShowPunchOutDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={isPunchingOut}
                onClick={confirmPunchOut}
                variant="destructive"
              >
                {isPunchingOut ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Punching Out...
                  </>
                ) : (
                  "Confirm Punch Out"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <SidebarMenuButton
      className="min-w-8 bg-gray-600 text-primary-foreground duration-200 ease-linear hover:bg-gray-700 hover:text-primary-foreground"
      disabled
      tooltip="Attendance Complete"
    >
      <IconCheck />
      <span>Attendance Complete</span>
    </SidebarMenuButton>
  );
};

MarkAttendanceButton.Fallback = () => (
  <SidebarMenuButton disabled>
    <Skeleton className="h-4 w-4 rounded-sm" />
    <Skeleton className="h-4 w-24" />
  </SidebarMenuButton>
);
