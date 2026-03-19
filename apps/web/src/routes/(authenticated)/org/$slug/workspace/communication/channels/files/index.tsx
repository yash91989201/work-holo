import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { FilesFilterToolbar } from "@/components/modules/communication/files/files-filter-toolbar";
import { FilesGrid } from "@/components/modules/communication/files/files-grid";
import { FilesTable } from "@/components/modules/communication/files/files-table";

const FilesSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  perPage: z.number().int().positive().catch(20),
  search: z.string().optional().catch(undefined),
  onlyMine: z.boolean().catch(false),
  type: z
    .enum(["all", "image", "document", "video", "audio", "archive"])
    .catch("all"),
  channelId: z.string().optional().catch(undefined),
  sortBy: z.enum(["name", "size", "createdAt", "type"]).catch("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).catch("desc"),
  view: z.enum(["table", "grid"]).catch("table"),
});

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/channels/files/"
)({
  validateSearch: FilesSearchSchema,
  staticData: { crumb: "Files" },
  component: RouteComponent,
});

function RouteComponent() {
  const { view } = Route.useSearch();

  return (
    <section className="space-y-6 p-6">
      <FilesFilterToolbar />
      {view === "grid" ? (
        <Suspense fallback={<FilesGrid.Fallback />}>
          <FilesGrid />
        </Suspense>
      ) : (
        <Suspense fallback={<FilesTable.Fallback />}>
          <FilesTable />
        </Suspense>
      )}
    </section>
  );
}
