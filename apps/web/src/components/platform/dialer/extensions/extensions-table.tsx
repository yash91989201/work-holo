import {
  IconDots,
  IconPlus,
  IconSearch,
  IconUsers,
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
import { ExtensionFormDialog } from "./extension-form-dialog";

function deploymentBadge(status: string) {
  if (status === "deployed") return <Badge variant="default">Deployed</Badge>;
  if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
  return <Badge variant="outline">Undeployed</Badge>;
}

export function ExtensionsTable() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search
  );

  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [createOpen, setCreateOpen] = useState(false);
  const [editExt, setEditExt] = useState<{
    id: string;
    extension: string;
    callerIdName: string;
    callerIdNumber: string;
    organizationId?: string;
    userId?: string;
    context: string;
    tollAllow: string;
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

  const { data: extensions, refetch } = useSuspenseQuery(
    queryUtils.admin.dialer.listExtensions.queryOptions({
      input: { search: query || undefined },
    })
  );

  const deleteMutation = useMutation(
    queryUtils.admin.dialer.deleteExtension.mutationOptions({
      onSuccess: () => {
        toast.success("Extension deleted");
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
              placeholder="Search extensions..."
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
          Add Extension
        </Button>
      </div>

      {extensions.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUsers className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No agent extensions</EmptyTitle>
            <EmptyDescription>
              Create SIP extensions for agents to register and make calls.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Extension</TableHead>
              <TableHead>Caller ID Name</TableHead>
              <TableHead>Caller ID Number</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Linked User</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Deployment</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensions.map((ext) => (
              <TableRow key={ext.id}>
                <TableCell className="font-medium font-mono">
                  {ext.extension}
                </TableCell>
                <TableCell>{ext.callerIdName}</TableCell>
                <TableCell className="font-mono text-sm">
                  {ext.callerIdNumber}
                </TableCell>
                <TableCell>{ext.organizationName ?? "—"}</TableCell>
                <TableCell>{ext.userName ?? "—"}</TableCell>
                <TableCell>
                  {ext.isActive ? (
                    <Badge variant="default">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>{deploymentBadge(ext.deploymentStatus)}</TableCell>
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
                          setEditExt({
                            id: ext.id,
                            extension: ext.extension,
                            callerIdName: ext.callerIdName,
                            callerIdNumber: ext.callerIdNumber,
                            organizationId: ext.organizationId ?? undefined,
                            userId: ext.userId ?? undefined,
                            context: ext.context,
                            tollAllow: "domestic,international,local",
                            isActive: ext.isActive,
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
                          deleteMutation.mutate({ extensionId: ext.id })
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

      <ExtensionFormDialog
        onOpenChange={setCreateOpen}
        onSuccess={() => refetch()}
        open={createOpen}
      />

      {editExt && (
        <ExtensionFormDialog
          defaultValues={editExt}
          extensionId={editExt.id}
          onOpenChange={(open) => {
            if (!open) setEditExt(null);
          }}
          onSuccess={() => {
            setEditExt(null);
            refetch();
          }}
          open={true}
        />
      )}
    </div>
  );
}

ExtensionsTable.Fallback = function ExtensionsTableFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
