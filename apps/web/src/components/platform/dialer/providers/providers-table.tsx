import {
  IconBuildingSkyscraper,
  IconDots,
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
import { ProviderFormDialog } from "./provider-form-dialog";

type Provider = {
  id: string;
  name: string;
  slug: string;
  host: string;
  port: number;
  transport: string;
  requiresRegistration: boolean;
  isActive: boolean;
};

export function ProvidersTable() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search
  );
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [createOpen, setCreateOpen] = useState(false);
  const [editProvider, setEditProvider] = useState<Provider | null>(null);

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      const url = new URL(window.location.href);
      if (value) url.searchParams.set("search", value);
      else url.searchParams.delete("search");
      router.history.push(url.pathname + url.search);
    },
    { wait: 300 }
  );

  const { data: providers, refetch } = useSuspenseQuery(
    queryUtils.admin.dialer.listProviders.queryOptions({
      input: { search: query || undefined },
    })
  );

  const deleteMutation = useMutation(
    queryUtils.admin.dialer.deleteProvider.mutationOptions({
      onSuccess: () => {
        toast.success("Provider deleted");
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
              placeholder="Search providers..."
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
          Add Provider
        </Button>
      </div>

      {providers.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconBuildingSkyscraper className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No SIP providers</EmptyTitle>
            <EmptyDescription>
              Add a SIP provider like Frejun or CloudBharat to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Transport</TableHead>
              <TableHead>Trunks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground text-sm">
                  {provider.slug}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {provider.host}
                </TableCell>
                <TableCell>{provider.port}</TableCell>
                <TableCell className="uppercase">
                  {provider.transport}
                </TableCell>
                <TableCell>{provider.trunkCount}</TableCell>
                <TableCell>
                  {provider.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
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
                      <DropdownMenuItem
                        onClick={() => setEditProvider(provider)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() =>
                          deleteMutation.mutate({ providerId: provider.id })
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

      <ProviderFormDialog
        onOpenChange={setCreateOpen}
        onSuccess={() => refetch()}
        open={createOpen}
      />

      {editProvider && (
        <ProviderFormDialog
          defaultValues={editProvider}
          onOpenChange={(open) => {
            if (!open) setEditProvider(null);
          }}
          onSuccess={() => {
            setEditProvider(null);
            refetch();
          }}
          open={true}
          providerId={editProvider.id}
        />
      )}
    </div>
  );
}

ProvidersTable.Fallback = function ProvidersTableFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
