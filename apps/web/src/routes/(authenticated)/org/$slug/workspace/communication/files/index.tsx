import {
  IconArchive,
  IconFile,
  IconFileText,
  IconGridDots,
  IconHash,
  IconList,
  IconMessageCircle,
  IconMusic,
  IconPhoto,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { format } from "date-fns";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/files/"
)({
  staticData: { crumb: "Files" },
  component: FilesPage,
});

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function getFileIcon(type: string | null) {
  switch (type) {
    case "image":
      return <IconPhoto className="h-8 w-8 text-blue-500" />;
    case "video":
      return <IconVideo className="h-8 w-8 text-purple-500" />;
    case "audio":
      return <IconMusic className="h-8 w-8 text-yellow-500" />;
    case "document":
      return <IconFileText className="h-8 w-8 text-green-500" />;
    case "archive":
      return <IconArchive className="h-8 w-8 text-orange-500" />;
    default:
      return <IconFile className="h-8 w-8 text-gray-500" />;
  }
}

function FilesList({
  searchQuery,
  source,
  type,
  viewMode,
}: {
  searchQuery: string;
  source: "all" | "channel" | "dm";
  type: string;
  viewMode: "grid" | "list";
}) {
  const [page, setPage] = useState(0);
  const limit = 20;
  const offset = page * limit;

  const queryOptions = searchQuery
    ? queryUtils.communication.attachment.search.queryOptions({
        query: searchQuery,
        limit,
        offset,
        source,
        type:
          type === "all"
            ? undefined
            : (type as "image" | "document" | "video" | "audio" | "archive"),
      })
    : queryUtils.communication.attachment.list.queryOptions({
        limit,
        offset,
        source,
        type:
          type === "all"
            ? undefined
            : (type as "image" | "document" | "video" | "audio" | "archive"),
      });

  const { data } = useSuspenseQuery(queryOptions);

  if (data.attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <IconFile className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg">No files found</h3>
        <p className="mt-1 text-muted-foreground">
          {searchQuery
            ? "Try adjusting your search or filters"
            : "Files shared in channels and direct messages will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "flex flex-col space-y-3"
        }
      >
        {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: UI rendering logic */}
        {data.attachments.map((file) => (
          <Card className="overflow-hidden" key={file.id}>
            {viewMode === "grid" ? (
              <>
                <div className="group relative flex aspect-video items-center justify-center bg-muted">
                  {file.type === "image" && file.url ? (
                    <img
                      alt={file.originalName}
                      className="h-full w-full object-cover"
                      height={300}
                      src={file.url}
                      width={400}
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      className="flex items-center gap-1 shadow-sm"
                      variant={
                        file.source === "channel" ? "default" : "secondary"
                      }
                    >
                      {file.source === "channel" ? (
                        <IconHash className="h-3 w-3" />
                      ) : (
                        <IconMessageCircle className="h-3 w-3" />
                      )}
                      {file.source === "channel" ? "Channel" : "DM"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div
                    className="mb-1 truncate font-medium"
                    title={file.originalName}
                  >
                    {file.originalName}
                  </div>
                  <div className="mb-3 flex items-center justify-between text-muted-foreground text-xs">
                    <span>{formatBytes(file.fileSize)}</span>
                    <span>
                      {format(new Date(file.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs">
                    {file.source === "channel" ? (
                      <IconHash className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <IconMessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="truncate">{file.sourceContext.name}</span>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {file.type === "image" && file.url ? (
                    <img
                      alt={file.originalName}
                      className="h-full w-full object-cover"
                      height={300}
                      src={file.url}
                      width={400}
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="truncate font-medium"
                      title={file.originalName}
                    >
                      {file.originalName}
                    </span>
                    <Badge
                      className="flex h-5 items-center gap-1 px-1.5 text-[10px]"
                      variant={
                        file.source === "channel" ? "default" : "secondary"
                      }
                    >
                      {file.source === "channel" ? "Channel" : "DM"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span>{formatBytes(file.fileSize)}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(file.createdAt), "MMM d, yyyy")}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {file.source === "channel" ? (
                        <IconHash className="h-3 w-3" />
                      ) : (
                        <IconMessageCircle className="h-3 w-3" />
                      )}
                      <span className="max-w-[150px] truncate">
                        {file.sourceContext.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button asChild size="sm" variant="ghost">
                    <a
                      download
                      href={file.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-muted-foreground text-sm">
          Showing {data.attachments.length} files
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!data.hasMore}
            onClick={() => setPage((p) => p + 1)}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [source, setSource] = useState<"all" | "channel" | "dm">("all");
  const [type, setType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Browse and search all files shared in your workspace.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <div className="relative max-w-md flex-1">
            <IconSearch className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              value={search}
            />
          </div>

          <Select onValueChange={setType} value={type}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="archive">Archives</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
          <Tabs
            className="w-[240px]"
            onValueChange={(v) => setSource(v as "all" | "channel" | "dm")}
            value={source}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="channel">Channels</TabsTrigger>
              <TabsTrigger value="dm">DMs</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center rounded-md border">
            <Button
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={() => setViewMode("grid")}
              size="icon"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
            >
              <IconGridDots className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
              size="icon"
              variant={viewMode === "list" ? "secondary" : "ghost"}
            >
              <IconList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
          </div>
        }
      >
        <FilesList
          searchQuery={debouncedSearch}
          source={source}
          type={type}
          viewMode={viewMode}
        />
      </Suspense>
    </div>
  );
}
