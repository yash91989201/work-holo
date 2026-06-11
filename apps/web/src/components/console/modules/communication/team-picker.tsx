import { useSuspenseQuery } from "@tanstack/react-query";
import { Checkbox } from "@work-holo/ui/components/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { queryUtils } from "@/utils/orpc";

type TeamPickerProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function TeamPicker({ selectedIds, onChange }: TeamPickerProps) {
  const {
    data: { teams },
  } = useSuspenseQuery(queryUtils.team.manage.list.queryOptions({}));

  return (
    <div className="space-y-2 pt-2">
      <ScrollArea className="h-64">
        <div className="p-1">
          {teams.length > 0 ? (
            <ItemGroup>
              {teams.map((team) => (
                <Item
                  className="cursor-pointer"
                  key={team.id}
                  onClick={() => {
                    if (selectedIds.includes(team.id))
                      onChange(selectedIds.filter((id) => id !== team.id));
                    else onChange([...selectedIds, team.id]);
                  }}
                  size="sm"
                  variant="default"
                >
                  <Checkbox
                    checked={selectedIds.includes(team.id)}
                    id={`team-${team.id}`}
                    onCheckedChange={(checked) => {
                      if (checked) onChange([...selectedIds, team.id]);
                      else onChange(selectedIds.filter((id) => id !== team.id));
                    }}
                  />
                  <ItemContent>
                    <ItemTitle>{team.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-muted-foreground text-xs">
                      {team.teamMembers.length} members
                    </span>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <p className="py-4 text-center text-muted-foreground text-sm">
              No teams found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
