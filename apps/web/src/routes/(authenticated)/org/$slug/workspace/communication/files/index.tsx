import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { FilesFilterToolbar } from "@/components/modules/communication/files/files-filter-toolbar";
import { FilesGrid } from "@/components/modules/communication/files/files-grid";
import { FilesTable } from "@/components/modules/communication/files/files-table";
import { FilesViewToggle } from "@/components/modules/communication/files/files-view-toggle";

const FilesSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  perPage: z.number().int().positive().catch(20),
  search: z.string().optional().catch(undefined),
  type: z
    .enum(["all", "image", "document", "video", "audio", "archive"])
    .catch("all"),
  channelId: z.string().optional().catch(undefined),
  sortBy: z.enum(["name", "size", "createdAt", "type"]).catch("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).catch("desc"),
  view: z.enum(["table", "grid"]).catch("table"),
});

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/files/"
)({
  validateSearch: FilesSearchSchema,
  staticData: { crumb: "Files" },
  component: RouteComponent,
});

function RouteComponent() {
  const { view } = Route.useSearch();

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Files</h1>
          <p className="text-muted-foreground">
            Browse all files shared in your channels
          </p>
        </div>
        <div data-testid="files-view-toggle">
          <FilesViewToggle />
        </div>
      </div>
      <FilesFilterToolbar />
      <Suspense
        fallback={
          view === "grid" ? <FilesGrid.Fallback /> : <FilesTable.Fallback />
        }
      >
        {view === "grid" ? <FilesGrid /> : <FilesTable />}
      </Suspense>
    </section>
  );
}
