import { IconPhoneIncoming, IconPhoneOutgoing } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@work-holo/ui/components/badge";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { Suspense } from "react";
import { queryUtils } from "@/utils/orpc";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function statusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "answered") return "default";
  if (status === "missed" || status === "no_answer") return "secondary";
  return "destructive";
}

function OrgCallsTableInner() {
  const { data } = useSuspenseQuery(
    queryUtils.org.callLogs.list.queryOptions({
      input: { limit: 50, offset: 0 },
    })
  );

  const { data: stats } = useSuspenseQuery(
    queryUtils.org.callLogs.stats.queryOptions({})
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Calls", value: stats.total },
          { label: "Answered", value: stats.answered },
          { label: "Inbound", value: stats.inbound },
          { label: "Outbound", value: stats.outbound },
        ].map((s) => (
          <div
            className="rounded-lg border bg-card p-4 text-center"
            key={s.label}
          >
            <p className="font-bold text-2xl">{s.value}</p>
            <p className="text-muted-foreground text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {data.rows.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground text-sm">
          No calls recorded yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Direction</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Started At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.direction === "inbound" ? (
                    <IconPhoneIncoming className="size-4 text-blue-600" />
                  ) : (
                    <IconPhoneOutgoing className="size-4 text-green-600" />
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {row.fromNumber}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {row.toNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{row.agentName ?? "—"}</p>
                    {row.extension && (
                      <p className="font-mono text-muted-foreground text-xs">
                        ext {row.extension}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-xs capitalize"
                    variant={statusVariant(row.status)}
                  >
                    {row.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDuration(row.durationSeconds)}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(row.startedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export function OrgCallsTable() {
  return (
    <Suspense
      fallback={
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton className="h-20 w-full" key={i} />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <OrgCallsTableInner />
    </Suspense>
  );
}
