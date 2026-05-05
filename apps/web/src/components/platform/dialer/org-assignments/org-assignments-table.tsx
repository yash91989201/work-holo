import {
  IconBuilding,
  IconPhone,
  IconPhoneIncoming,
  IconPhoneOutgoing,
  IconSettings,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { useState } from "react";
import { queryUtils } from "@/utils/orpc";
import { OrgSettingsDialog } from "./org-settings-dialog";

type OrgRow = {
  id: string;
  name: string;
  slug: string;
  settingsId: string | null;
  isEnabled: boolean | null;
  canMakeOutboundCalls: boolean | null;
  canReceiveInboundCalls: boolean | null;
  maxConcurrentCalls: number | null;
  recordAllCalls: boolean | null;
  defaultOutboundTrunkId: string | null;
  didCount: number;
};

export function OrgAssignmentsTable() {
  const [configOrg, setConfigOrg] = useState<OrgRow | null>(null);

  const { data: orgs, refetch } = useSuspenseQuery(
    queryUtils.admin.dialer.listOrgAssignments.queryOptions({})
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Configure which organizations have access to the dialer and assign DID
          numbers.
        </p>
      </div>

      {orgs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconBuilding className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No organizations</EmptyTitle>
            <EmptyDescription>
              Organizations will appear here once created.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>DIDs Assigned</TableHead>
              <TableHead>Dialer</TableHead>
              <TableHead>Outbound</TableHead>
              <TableHead>Inbound</TableHead>
              <TableHead>Max Calls</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.map((org) => (
              <TableRow key={org.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-muted-foreground text-xs">{org.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <IconPhone className="size-3.5 text-muted-foreground" />
                    <span>{org.didCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {org.isEnabled ? (
                    <Badge variant="default">Enabled</Badge>
                  ) : (
                    <Badge variant="outline">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {org.canMakeOutboundCalls ? (
                    <IconPhoneOutgoing className="size-4 text-green-600" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {org.canReceiveInboundCalls ? (
                    <IconPhoneIncoming className="size-4 text-blue-600" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{org.maxConcurrentCalls ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setConfigOrg(org)}
                      size="xs"
                      variant="outline"
                    >
                      <IconSettings className="size-3.5" />
                      Configure
                    </Button>
                    <Button asChild size="xs" variant="ghost">
                      <Link
                        search={{ organizationId: org.id }}
                        to="/platform/dashboard/dialer/dids"
                      >
                        DIDs
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {configOrg && (
        <OrgSettingsDialog
          defaultValues={{
            isEnabled: configOrg.isEnabled,
            canMakeOutboundCalls: configOrg.canMakeOutboundCalls,
            canReceiveInboundCalls: configOrg.canReceiveInboundCalls,
            maxConcurrentCalls: configOrg.maxConcurrentCalls,
            recordAllCalls: configOrg.recordAllCalls,
            defaultOutboundTrunkId: configOrg.defaultOutboundTrunkId,
          }}
          onOpenChange={(open) => {
            if (!open) setConfigOrg(null);
          }}
          onSuccess={() => {
            setConfigOrg(null);
            refetch();
          }}
          open={true}
          organizationId={configOrg.id}
          organizationName={configOrg.name}
        />
      )}
    </div>
  );
}

OrgAssignmentsTable.Fallback = function OrgAssignmentsTableFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-96" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
