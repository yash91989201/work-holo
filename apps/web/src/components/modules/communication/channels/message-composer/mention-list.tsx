import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface MentionListProps {
  command: (item: { id: string; label: string }) => void;
  items: Array<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }>;
  loading: boolean;
}

export interface MentionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const { items, command, loading } = props;
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

    if (loading) {
      return (
        <ItemGroup className="min-w-70 rounded-lg border border-border bg-popover shadow-md">
          <Item className="cursor-not-allowed opacity-60" size="sm">
            <ItemContent>
              <ItemDescription>Searching users...</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      );
    }

    if (!loading && items.length === 0) {
      return (
        <ItemGroup className="min-w-70 rounded-lg border border-border bg-popover shadow-md">
          <Item className="cursor-not-allowed opacity-60" size="sm">
            <ItemContent>
              <ItemDescription>User not found</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
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
                <AvatarFallback className="font-bold text-foreground text-xs">
                  {item.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ItemMedia>

            <ItemContent>
              <ItemTitle className="text-foreground">{item.name}</ItemTitle>
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
