import { Bell, MessageSquare, Package, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NotificationSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Bell />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have a few unread notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <MessageSquare />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>New message from John Doe</ItemTitle>
                <ItemDescription>Hey, how are you doing today?</ItemDescription>
              </ItemContent>
              <span className="text-muted-foreground text-xs">2m ago</span>
            </Item>
            <Item>
              <ItemMedia variant="icon">
                <Package />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Your order #12345 has shipped</ItemTitle>
                <ItemDescription>
                  It&apos;s on its way to your doorstep.
                </ItemDescription>
              </ItemContent>
              <span className="text-muted-foreground text-xs">1h ago</span>
            </Item>
            <Item>
              <ItemMedia variant="icon">
                <UserPlus />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>You have a new follower</ItemTitle>
                <ItemDescription>
                  Jane Smith started following you.
                </ItemDescription>
              </ItemContent>
              <span className="text-muted-foreground text-xs">3h ago</span>
            </Item>
          </ItemGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
}
