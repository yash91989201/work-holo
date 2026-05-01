import {
  IconDots,
  IconPhone,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryUtils } from "@/utils/orpc";
import { TrunkFormDialog } from "./trunk-form-dialog";

function deploymentBadge(status: string) {
  if (status === "deployed") return <Badge variant="default">Deployed</Badge>;
  if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
  return <Badge variant="outline">Undeployed</Badge>;
}

function providerLabel(provider: string) {
  const map: Record<string, string> = {
    cloudbharat: "CloudBharat",
    telnyx: "Telnyx",
    twilio: "Twilio",
    custom: "Custom",
  };
  return map[provider] ?? provider;
}

export function TrunksTable() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search
  );
  const initialSearch = searchParams.get("search") ?? "";

  const [query, setQuery] = useState(initialSearch);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTrunk, setEditTrunk] = useState<{
    id: string;
    name: string;
    provider: "cloudbharat" | "telnyx" | "twilio" | "custom";
    username: string;
    proxy: string;
    fromDomain?: string;
    fromUser?: string;
    register: boolean;
    expireSeconds: number;
    pingInterval: number;
    transport: "udp" | "tcp" | "tls";
    isActive: boolean;
  } | null>(null);

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      const url = new URL(window.location.href);
      if (value) url.searchParams.set("search", value);
      else url.searchParams.delete("search");
      router.history.push(url.pathname + url.search);
    },
    { wait: 300 }
  );

  const { data: trunks, refetch } = useSuspenseQuery(
    queryUtils.admin.dialer.listTrunks.queryOptions({
      input: { search: query || undefined },
    })
  );

  const deleteMutation = useMutation(
    queryUtils.admin.dialer.deleteTrunk.mutationOptions({
      onSuccess: () => {
        toast.success("Trunk deleted");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    debouncedNavigate(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconSearch className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search trunks..."
              value={query}
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Clear search"
                  onClick={() => handleQueryChange("")}
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
          Add Trunk
        </Button>
      </div>

      {trunks.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPhone className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No SIP trunks</EmptyTitle>
            <EmptyDescription>
              Add a SIP trunk to connect to a phone provider.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Proxy</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Transport</TableHead>
              <TableHead>DIDs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {trunks.map((trunk) => (
              <TableRow key={trunk.id}>
                <TableCell className="font-medium">{trunk.name}</TableCell>
                <TableCell>{providerLabel(trunk.provider)}</TableCell>
                <TableCell className="font-mono text-sm">
                  {trunk.proxy}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {trunk.username}
                </TableCell>
                <TableCell className="uppercase">{trunk.transport}</TableCell>
                <TableCell>{trunk.didCount}</TableCell>
                <TableCell>{deploymentBadge(trunk.deploymentStatus)}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() =>
                          setEditTrunk({
                            id: trunk.id,
                            name: trunk.name,
                            provider: trunk.provider as
                              | "cloudbharat"
                              | "telnyx"
                              | "twilio"
                              | "custom",
                            username: trunk.username,
                            proxy: trunk.proxy,
                            fromDomain: undefined,
                            fromUser: undefined,
                            register: trunk.register,
                            expireSeconds: trunk.expireSeconds ?? 60,
                            pingInterval: trunk.pingInterval ?? 25,
                            transport: trunk.transport as "udp" | "tcp" | "tls",
                            isActive: trunk.isActive,
                          })
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() =>
                          deleteMutation.mutate({ trunkId: trunk.id })
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TrunkFormDialog
        onOpenChange={setCreateOpen}
        onSuccess={() => refetch()}
        open={createOpen}
      />

      {editTrunk && (
        <TrunkFormDialog
          defaultValues={editTrunk}
          onOpenChange={(open) => {
            if (!open) setEditTrunk(null);
          }}
          onSuccess={() => {
            setEditTrunk(null);
            refetch();
          }}
          open={true}
          trunkId={editTrunk.id}
        />
      )}
    </div>
  );
}

TrunksTable.Fallback = function TrunksTableFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
