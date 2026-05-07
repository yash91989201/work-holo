import {
  IconDots,
  IconPhoneCall,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
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
import { toast } from "sonner";
import { queryUtils } from "@/utils/orpc";
import { DidAssignDialog } from "./did-assign-dialog";
import { DidFormDialog } from "./did-form-dialog";

function statusBadge(status: string) {
  if (status === "available")
    return <Badge variant="secondary">Available</Badge>;
  if (status === "assigned") return <Badge variant="default">Assigned</Badge>;
  if (status === "retired") return <Badge variant="outline">Retired</Badge>;
  if (status === "blocked") return <Badge variant="destructive">Blocked</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export function DidsTable() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search
  );

  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [createOpen, setCreateOpen] = useState(false);
  const [assignDidId, setAssignDidId] = useState<string | null>(null);

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      const url = new URL(window.location.href);
      if (value) url.searchParams.set("search", value);
      else url.searchParams.delete("search");
      router.history.push(url.pathname + url.search);
    },
    { wait: 300 }
  );

  const { data: dids, refetch } = useSuspenseQuery(
    queryUtils.admin.dialer.listDids.queryOptions({
      input: {
        search: query || undefined,
      },
    })
  );

  const retireMutation = useMutation(
    queryUtils.admin.dialer.retireDid.mutationOptions({
      onSuccess: () => {
        toast.success("DID retired");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const unassignMutation = useMutation(
    queryUtils.admin.dialer.unassignDid.mutationOptions({
      onSuccess: () => {
        toast.success("DID unassigned");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconSearch className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedNavigate(e.target.value);
              }}
              placeholder="Search DIDs..."
              value={query}
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    debouncedNavigate("");
                  }}
                  size="icon-xs"
                >
                  <IconX className="size-3" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <IconPlus className="size-4" />
          Add DID
        </Button>
      </div>

      {dids.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPhoneCall className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No DIDs in inventory</EmptyTitle>
            <EmptyDescription>
              Add phone numbers to start assigning them to organizations.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Friendly Name</TableHead>
              <TableHead>Trunk</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {dids.map((did) => (
              <TableRow key={did.id}>
                <TableCell className="font-medium font-mono">
                  {did.number}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {did.friendlyName ?? "—"}
                </TableCell>
                <TableCell>{did.sipTrunkName ?? "—"}</TableCell>
                <TableCell>{did.organizationName ?? "—"}</TableCell>
                <TableCell>{statusBadge(did.status)}</TableCell>
                <TableCell>
                  {did.isActive ? (
                    <Badge variant="default">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-label="Actions"
                        size="icon-xs"
                        variant="ghost"
                      >
                        <IconDots className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {did.status === "available" && (
                        <DropdownMenuItem
                          onClick={() => setAssignDidId(did.id)}
                        >
                          Assign to Org
                        </DropdownMenuItem>
                      )}
                      {did.status === "assigned" && (
                        <DropdownMenuItem
                          disabled={unassignMutation.isPending}
                          onClick={() =>
                            unassignMutation.mutate({ didId: did.id })
                          }
                        >
                          Unassign
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        disabled={retireMutation.isPending}
                        onClick={() => retireMutation.mutate({ didId: did.id })}
                      >
                        Retire
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DidFormDialog
        onOpenChange={setCreateOpen}
        onSuccess={() => refetch()}
        open={createOpen}
      />

      {assignDidId && (
        <DidAssignDialog
          didId={assignDidId}
          onOpenChange={(open) => {
            if (!open) setAssignDidId(null);
          }}
          onSuccess={() => {
            setAssignDidId(null);
            refetch();
          }}
          open={true}
        />
      )}
    </div>
  );
}

DidsTable.Fallback = function DidsTableFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
