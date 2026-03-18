import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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
  return (
    <section className="p-6">
      <h1>Files</h1>
    </section>
  );
}
