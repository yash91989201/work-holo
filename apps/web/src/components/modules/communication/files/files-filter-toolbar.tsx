import { IconSearch, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useIsFetching } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { queryUtils } from "@/utils/orpc";
import { FilesViewToggle } from "./files-view-toggle";

export function FilesFilterToolbar() {
  const searchParams = useSearch({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/files/",
  });
  const navigate = useNavigate({
    from: "/org/$slug/workspace/communication/channels/files/",
  });

  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [debouncedSearch] = useDebouncedValue(searchValue, { wait: 500 });
  const filesListQueryInput = {
    page: searchParams.page ?? 1,
    perPage: searchParams.perPage ?? 20,
    search: searchParams.search,
    onlyMine: searchParams.onlyMine,
    type: searchParams.type !== "all" ? searchParams.type : undefined,
    channelId: searchParams.channelId,
    sortBy:
      (searchParams.sortBy as "name" | "size" | "createdAt" | "type") ??
      "createdAt",
    sortOrder: searchParams.sortOrder ?? "desc",
  };
  const isFilesListFetching =
    useIsFetching({
      queryKey: queryUtils.communication.attachment.list.queryKey({
        input: filesListQueryInput,
      }),
    }) > 0;

  useEffect(() => {
    const urlSearch = searchParams.search || "";
    if (urlSearch !== searchValue) {
      setSearchValue(urlSearch);
    }
  }, [searchParams.search]);

  useEffect(() => {
    if (debouncedSearch !== (searchParams.search || "")) {
      navigate({
        search: (prev) => ({
          ...prev,
          search: debouncedSearch || undefined,
          page: 1,
        }),
      });
    }
  }, [debouncedSearch, navigate, searchParams.search]);

  const handleTypeChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: value as
          | "all"
          | "image"
          | "document"
          | "video"
          | "audio"
          | "archive",
        page: 1,
      }),
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [
      "name" | "size" | "createdAt" | "type",
      "asc" | "desc",
    ];
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy,
        sortOrder,
        page: 1,
      }),
    });
  };

  const handleSenderChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        onlyMine: value === "mine",
        page: 1,
      }),
    });
  };

  const handleReset = () => {
    setSearchValue("");
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        onlyMine: false,
        type: "all",
        channelId: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
      }),
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        page: 1,
      }),
    });
  };

  const sortValue = `${searchParams.sortBy}-${searchParams.sortOrder}`;

  const hasFilters =
    !!searchParams.search ||
    searchParams.onlyMine ||
    searchParams.type !== "all" ||
    !!searchParams.channelId ||
    searchParams.sortBy !== "createdAt" ||
    searchParams.sortOrder !== "desc";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <InputGroup className="max-w-sm">
          <InputGroupAddon align="inline-start">
            {isFilesListFetching ? (
              <Spinner className="size-4" />
            ) : (
              <IconSearch />
            )}
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by file name, sender, or channel..."
            value={searchValue}
          />
          <InputGroupAddon align="inline-end" className="py-0">
            <InputGroupButton
              aria-label="Clear search"
              disabled={!searchValue}
              onClick={handleClearSearch}
              size="icon-xs"
              variant="ghost"
            >
              <IconX className="size-3.5" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Select onValueChange={handleTypeChange} value={searchParams.type}>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="archive">Archive</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleSortChange} value={sortValue}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
            <SelectItem value="createdAt-asc">Oldest</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="size-desc">Largest</SelectItem>
            <SelectItem value="size-asc">Smallest</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={handleSenderChange}
          value={searchParams.onlyMine ? "mine" : "all"}
        >
          <SelectTrigger className="w-38">
            <SelectValue placeholder="Sender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Senders</SelectItem>
            <SelectItem value="mine">Sent by me</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            className="h-9 px-2 lg:px-3"
            onClick={handleReset}
            size="sm"
            variant="ghost"
          >
            Reset
            <IconX className="ml-2 size-4" />
          </Button>
        )}
      </div>

      <div>
        <FilesViewToggle />
      </div>
    </div>
  );
}

export function FilesFilterToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Skeleton className="h-9 w-full max-w-sm rounded-4xl" />
        <Skeleton className="h-9 w-35 rounded-4xl" />
        <Skeleton className="h-9 w-40 rounded-4xl" />
        <Skeleton className="h-9 w-38 rounded-4xl" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

FilesFilterToolbar.Fallback = FilesFilterToolbarSkeleton;
