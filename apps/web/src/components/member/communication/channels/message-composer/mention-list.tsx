import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

export interface MentionListProps {
  items: Array<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }>;
  command: (item: { id: string; label: string }) => void;
}

export interface MentionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const { items, command } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) {
          command({
            id: item.id,
            label: item.name || item.email,
          });
        }
      },
      [items, command]
    );

    const upHandler = useCallback(
      () => setSelectedIndex((i) => (i + items.length - 1) % items.length),
      [items.length]
    );

    const downHandler = useCallback(
      () => setSelectedIndex((i) => (i + 1) % items.length),
      [items.length]
    );

    useEffect(() => {
      if (items.length === 0) return;
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }
        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="rounded-lg border border-border bg-popover p-2 shadow-md">
          <div className="px-2 py-1.5 text-muted-foreground text-sm">
            Loading users...
          </div>
        </div>
      );
    }

    return (
      <ItemGroup className="min-w-70 rounded-lg border border-border bg-popover shadow-md">
        {items.map((item, index) => (
          <Item
            className={cn(
              "cursor-pointer transition-colors",
              index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
            )}
            key={item.id}
            onClick={() => selectItem(index)}
            size="sm"
          >
            <ItemMedia variant="image">
              <Avatar className="h-8 w-8">
                <AvatarImage alt={item.name} src={item.image ?? undefined} />
                <AvatarFallback className="font-bold text-xs">
                  {item.name?.[0]?.toUpperCase() ||
                    item.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ItemMedia>

            <ItemContent>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemDescription className="line-clamp-1">
                {item.email}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    );
  }
);

MentionList.displayName = "MentionList";
