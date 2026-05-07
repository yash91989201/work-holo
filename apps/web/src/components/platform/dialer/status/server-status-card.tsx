import {
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconPhone,
  IconServer,
  IconUsers,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { Separator } from "@work-holo/ui/components/separator";
import { queryUtils } from "@/utils/orpc";

function StatusBadge({
  online,
  onLabel,
  offLabel,
}: {
  online: boolean;
  onLabel: string;
  offLabel: string;
}) {
  if (online) {
    return (
      <Badge className="gap-1" variant="default">
        <IconCircleCheck className="size-3" />
        {onLabel}
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 text-muted-foreground" variant="outline">
      <IconAlertCircle className="size-3" />
      {offLabel}
    </Badge>
  );
}

export function ServerStatusCard() {
  const { data: status } = useSuspenseQuery(
    queryUtils.admin.dialer.getServerStatus.queryOptions({ input: undefined })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl">FreeSWITCH Server Status</h2>
        <p className="text-muted-foreground text-sm">
          Infrastructure overview for the dialer system.
        </p>
      </div>

      {/* Server Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <IconServer className="size-4" />
            VPS / FreeSWITCH
          </CardTitle>
          <CardDescription>Hetzner VPS — FreeSWITCH instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">IP Address</span>
            <span className="font-medium font-mono">{status.vpsIp}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">VPS Reachable</span>
            <StatusBadge
              offLabel="Unreachable"
              onLabel="Online"
              online={status.vpsReachable}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ESL Connection</span>
            <StatusBadge
              offLabel="Not Connected"
              onLabel="Connected"
              online={status.eslStatus === "connected"}
            />
          </div>
          {status.eslStatus !== "connected" && (
            <p className="rounded-md bg-muted p-3 text-muted-foreground text-xs">
              Live status monitoring (gateway registration, active calls,
              registered agents) will be available after the SIP Worker is
              integrated in Phase 2.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IconPhone className="size-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-2xl">{status.trunkCount}</p>
                <p className="text-muted-foreground text-sm">SIP Trunks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IconPhone className="size-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-2xl">{status.didCount}</p>
                <p className="text-muted-foreground text-sm">DID Numbers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IconUsers className="size-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-2xl">{status.extensionCount}</p>
                <p className="text-muted-foreground text-sm">
                  Agent Extensions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IconClock className="size-8 text-amber-500" />
              <div>
                <p className="font-bold text-2xl">
                  {status.pendingDeployments}
                </p>
                <p className="text-muted-foreground text-sm">Pending Deploys</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 2 note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <IconAlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Phase 2 — Live Monitoring</p>
              <p className="text-muted-foreground text-sm">
                Once the SIP Worker is deployed and connected via ESL, this page
                will show real-time data: gateway registration state, active
                calls, registered softphones, and call events.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
