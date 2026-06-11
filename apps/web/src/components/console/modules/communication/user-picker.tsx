import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@work-holo/ui/components/badge";
import { Checkbox } from "@work-holo/ui/components/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { queryUtils } from "@/utils/orpc";

type UserPickerProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function UserPicker({ selectedIds, onChange }: UserPickerProps) {
  const {
    data: { members },
  } = useSuspenseQuery(
    queryUtils.org.member.list.queryOptions({
      input: { page: 1, perPage: 100 },
    })
  );

  return (
    <div className="space-y-2 pt-2">
      <ScrollArea className="h-64">
        <div className="p-1">
          {members.length > 0 ? (
            <ItemGroup>
              {members.map((member) => (
                <Item
                  className="cursor-pointer"
                  key={member.userId}
                  onClick={() => {
                    if (selectedIds.includes(member.userId))
                      onChange(
                        selectedIds.filter((id) => id !== member.userId)
                      );
                    else onChange([...selectedIds, member.userId]);
                  }}
                  size="sm"
                  variant="default"
                >
                  <Checkbox
                    checked={selectedIds.includes(member.userId)}
                    id={`user-${member.userId}`}
                    onCheckedChange={(checked) => {
                      if (checked) onChange([...selectedIds, member.userId]);
                      else
                        onChange(
                          selectedIds.filter((id) => id !== member.userId)
                        );
                    }}
                  />
                  <ItemMedia variant="image">
                    <div className="flex h-full w-full items-center justify-center bg-muted font-medium text-xs">
                      {member.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-sm">
                      {member.user.name}
                    </ItemTitle>
                    <ItemDescription className="text-xs">
                      {member.user.email}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge className="text-xs capitalize" variant="outline">
                      {member.role}
                    </Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <p className="py-4 text-center text-muted-foreground text-sm">
              No users found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
