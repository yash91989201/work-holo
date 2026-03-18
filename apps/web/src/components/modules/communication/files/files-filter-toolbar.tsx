import { IconSearch, IconX } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
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
import { useUserChannels } from "@/hooks/communications/use-user-channels";

const routeApi = getRouteApi(
  "/(authenticated)/org/$slug/workspace/communication/files/"
);

export function FilesFilterToolbar() {
  const searchParams = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const { channels } = useUserChannels();

  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const debouncedSearch = useDebounce(searchValue, 500);

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

  const handleChannelChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        channelId: value === "all" ? undefined : value,
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

  const handleReset = () => {
    setSearchValue("");
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        type: "all",
        channelId: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
      }),
    });
  };

  const sortValue = `${searchParams.sortBy}-${searchParams.sortOrder}`;

  const hasFilters =
    !!searchParams.search ||
    searchParams.type !== "all" ||
    !!searchParams.channelId ||
    searchParams.sortBy !== "createdAt" ||
    searchParams.sortOrder !== "desc";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupInput
            data-testid="files-search-input"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search files..."
            value={searchValue}
          />
        </InputGroup>

        <Select onValueChange={handleTypeChange} value={searchParams.type}>
          <SelectTrigger className="w-[140px]" data-testid="files-type-filter">
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

        <Select
          onValueChange={handleChannelChange}
          value={searchParams.channelId || "all"}
        >
          <SelectTrigger
            className="w-[160px]"
            data-testid="files-channel-filter"
          >
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleSortChange} value={sortValue}>
          <SelectTrigger className="w-[160px]" data-testid="files-sort-select">
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
    </div>
  );
}

export function FilesFilterToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Skeleton className="h-9 w-full max-w-sm rounded-4xl" />
        <Skeleton className="h-9 w-[140px] rounded-4xl" />
        <Skeleton className="h-9 w-[160px] rounded-4xl" />
        <Skeleton className="h-9 w-[160px] rounded-4xl" />
      </div>
    </div>
  );
}

FilesFilterToolbar.Fallback = FilesFilterToolbarSkeleton;
