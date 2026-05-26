import {
  IconBriefcase,
  IconCircleCheckFilled,
  IconClockHour4Filled,
  IconCoffee,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDuration } from "@/utils";
import { queryUtils } from "@/utils/orpc";

const formatDateTime = (value: Date | string | null | undefined) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const calculateWorkDuration = (
  checkIn: Date | string | null | undefined,
  checkOut: Date | string | null | undefined
) => {
  if (!checkIn) return 0;
  const start = new Date(checkIn);
  const end = checkOut ? new Date(checkOut) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
};

const StatCard = ({
  icon,
  label,
  value,
  accent = "bg-muted",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-border/30 bg-muted/20 p-4 transition-colors hover:bg-muted/30">
    <div className={`rounded-xl p-2.5 ${accent}`}>{icon}</div>
    <div className="min-w-0">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        {label}
      </p>
      <p className="font-bold text-xl tabular-nums">{value}</p>
    </div>
  </div>
);

export const MarkAttendance = () => {
  const { data: attendance, refetch } = useSuspenseQuery(
    queryUtils.attendance.records.getStatus.queryOptions({})
  );

  const { mutateAsync: punchIn, isPending: isPunchingIn } = useMutation(
    queryUtils.attendance.clock.punchIn.mutationOptions({
      onSuccess: async () => {
        toast.success("Checked in successfully!");
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

  const [showPunchOutDialog, setShowPunchOutDialog] = useState(false);

  const handlePunchOut = () => {
    setShowPunchOutDialog(true);
  };

  const confirmPunchOut = async () => {
    await punchOut({});
  };

  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // only rerender if checked in and not out
      if (attendance?.checkInTime && !attendance?.checkOutTime) {
        setCurrentTime(new Date());
      }
    }, 1000 * 60); // every minute

    return () => clearInterval(timer);
  }, [attendance]);

  const hasCheckedIn = !!attendance?.checkInTime;
  const hasCheckedOut = !!attendance?.checkOutTime;
  const isActionPending = isPunchingIn || isPunchingOut;

  if (!hasCheckedIn) {
    return (
      <Card className="w-full" variant="neumorphic">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <div className="rounded-2xl bg-linear-to-br from-violet-100 to-violet-50 p-5 dark:from-violet-950/60 dark:to-violet-900/30">
            <IconBriefcase className="h-12 w-12 text-violet-500" />
          </div>
          <div className="space-y-1.5 text-center">
            <h3 className="font-bold text-2xl tracking-tight">
              Ready to Start?
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm">
              Punch in to begin your workday and start tracking your time.
            </p>
          </div>
          <Button
            className="w-full bg-green-600 font-semibold text-white hover:bg-green-700"
            disabled={isActionPending}
            onClick={() => punchIn({})}
            size="lg"
          >
            {isPunchingIn ? (
              <Spinner className="mr-2" />
            ) : (
              <IconLogin className="mr-2 h-5 w-5" />
            )}
            <span>Punch In</span>
          </Button>
        </CardContent>
      </Card>
    );
  }
  if (hasCheckedIn && !hasCheckedOut) {
    const totalMinutes = calculateWorkDuration(attendance.checkInTime, null);
    const breakMinutes = attendance.breakDuration ?? 0;
    const workMinutes = totalMinutes - breakMinutes;

    return (
      <>
        <Card className="w-full" variant="neumorphic">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <CardTitle className="font-semibold text-base">
                Work Session in Progress
              </CardTitle>
            </div>
            <CardDescription>
              You are currently punched in and tracking time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-3">
              <StatCard
                accent="bg-blue-100 dark:bg-blue-950/50"
                icon={
                  <IconClockHour4Filled className="h-5 w-5 text-blue-500" />
                }
                label="Checked In"
                value={formatDateTime(attendance.checkInTime)}
              />
              <StatCard
                accent="bg-green-100 dark:bg-green-950/50"
                icon={<IconBriefcase className="h-5 w-5 text-green-500" />}
                label="Total Work Time"
                value={formatDuration(workMinutes)}
              />
              <StatCard
                accent="bg-orange-100 dark:bg-orange-950/50"
                icon={<IconCoffee className="h-5 w-5 text-orange-500" />}
                label="Break Time"
                value={formatDuration(breakMinutes)}
              />
            </div>
            <Button
              className="w-full bg-red-600 font-semibold text-white hover:bg-red-700"
              disabled={isActionPending}
              onClick={handlePunchOut}
              size="lg"
            >
              {isPunchingOut ? (
                <Spinner className="mr-2" />
              ) : (
                <IconLogout className="mr-2 h-5 w-5" />
              )}
              <span>Punch Out</span>
            </Button>
          </CardContent>
        </Card>

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

  // hasCheckedIn && hasCheckedOut
  const totalMinutes = calculateWorkDuration(
    attendance.checkInTime,
    attendance.checkOutTime
  );
  const breakMinutes = attendance.breakDuration ?? 0;
  const workMinutes = totalMinutes - breakMinutes;

  return (
    <Card className="w-full" variant="neumorphic">
      <CardHeader className="pb-2">
        <CardTitle>Day Complete!</CardTitle>
        <CardDescription>Here's a summary of your workday.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatCard
            accent="bg-blue-100 dark:bg-blue-950/50"
            icon={<IconClockHour4Filled className="h-5 w-5 text-blue-500" />}
            label="Checked In"
            value={formatDateTime(attendance.checkInTime)}
          />
          <StatCard
            accent="bg-red-100 dark:bg-red-950/50"
            icon={<IconLogout className="h-5 w-5 text-red-500" />}
            label="Checked Out"
            value={formatDateTime(attendance.checkOutTime)}
          />
          <StatCard
            accent="bg-green-100 dark:bg-green-950/50"
            icon={<IconBriefcase className="h-5 w-5 text-green-500" />}
            label="Total Work Time"
            value={formatDuration(workMinutes)}
          />
          <StatCard
            accent="bg-orange-100 dark:bg-orange-950/50"
            icon={<IconCoffee className="h-5 w-5 text-orange-500" />}
            label="Break Time"
            value={formatDuration(breakMinutes)}
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-green-200/60 bg-green-50/80 p-4 text-green-800 dark:border-green-800/40 dark:bg-green-950/40 dark:text-green-300">
          <IconCircleCheckFilled className="h-5 w-5 shrink-0" />
          <p className="font-medium text-sm">
            You've successfully punched out for the day. Great work!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const MarkAttendanceSkeleton = () => (
  <Card className="w-full" variant="neumorphic">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-1.5 h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Skeleton className="h-18 w-full rounded-xl" />
        <Skeleton className="h-18 w-full rounded-xl" />
        <Skeleton className="h-18 w-full rounded-xl" />
        <Skeleton className="h-18 w-full rounded-xl" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </CardContent>
  </Card>
);

MarkAttendance.Fallback = MarkAttendanceSkeleton;
