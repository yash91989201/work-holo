import {
  IconBriefcase,
  IconCircleCheckFilled,
  IconClockHour4Filled,
  IconCoffee,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
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

const formatDuration = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
    <div className="rounded-full bg-muted p-2">{icon}</div>
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
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
      <Card className="w-full rounded-3xl border border-white bg-background shadow-[-4px_-4px_12px_rgba(255,255,255,0.8),4px_4px_12px_rgba(0,0,0,0.04)]">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-12">
          <div className="rounded-xl bg-muted p-4">
            <IconBriefcase className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <div className="space-y-1 text-center">
            <h3 className="font-semibold text-xl">Ready to Start?</h3>
            <p className="text-muted-foreground text-sm">
              Punch in to begin your workday.
            </p>
          </div>
          <Button
            className="mt-2 rounded-lg bg-green-600 px-8 hover:bg-green-700"
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Work Session in Progress</CardTitle>
            <CardDescription>You are currently punched in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={<IconClockHour4Filled className="text-blue-500" />}
                label="Checked In"
                value={formatDateTime(attendance.checkInTime)}
              />
              <StatCard
                icon={<IconBriefcase className="text-green-500" />}
                label="Total Work Time"
                value={formatDuration(workMinutes)}
              />
              <StatCard
                icon={<IconCoffee className="text-orange-500" />}
                label="Break Time"
                value={formatDuration(breakMinutes)}
              />
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700"
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Day Complete!</CardTitle>
        <CardDescription>Here's a summary of your workday.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatCard
            icon={<IconClockHour4Filled className="text-blue-500" />}
            label="Checked In"
            value={formatDateTime(attendance.checkInTime)}
          />
          <StatCard
            icon={<IconLogout className="text-red-500" />}
            label="Checked Out"
            value={formatDateTime(attendance.checkOutTime)}
          />
          <StatCard
            icon={<IconBriefcase className="text-green-500" />}
            label="Total Work Time"
            value={formatDuration(workMinutes)}
          />
          <StatCard
            icon={<IconCoffee className="text-orange-500" />}
            label="Break Time"
            value={formatDuration(breakMinutes)}
          />
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-300">
          <IconCircleCheckFilled className="h-6 w-6" />
          <p className="font-medium">
            You have successfully punched out for the day. Great work!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const MarkAttendanceSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </CardContent>
  </Card>
);
