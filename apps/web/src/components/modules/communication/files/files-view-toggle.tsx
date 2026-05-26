import { IconLayoutGrid, IconTable } from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@work-holo/ui/components/toggle-group";
import { cn } from "@/lib/utils";

type ViewType = "table" | "grid";

export function FilesViewToggle() {
  const navigate = useNavigate();
  const search = useSearch({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/files/",
  });

  const currentView = (search.view as ViewType) || "table";

  const handleViewChange = (value: string[]) => {
    const selected = value[0];
    if (!selected) return;
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        view: selected as ViewType,
      }),
    });
  };

  return (
    <ToggleGroup
      className="justify-end"
      onValueChange={handleViewChange}
      value={currentView ? [currentView] : []}
    >
      <ToggleGroupItem
        aria-label="Table view"
        className={cn(
          "gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        )}
        title="Table view"
        value="table"
      >
        <IconTable className="h-4 w-4" />
        <span>Table</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        aria-label="Grid view"
        className={cn(
          "gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        )}
        title="Grid view"
        value="grid"
      >
        <IconLayoutGrid className="h-4 w-4" />
        <span>Grid</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
