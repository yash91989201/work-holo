import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

export function Profile() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <Item>
        <ItemContent>
          <ItemTitle>Profile image</ItemTitle>
        </ItemContent>
        <ItemActions>profile view/update</ItemActions>
      </Item>
      <Separator />
      <Item>
        <ItemContent>
          <ItemTitle>Email</ItemTitle>
        </ItemContent>
        <ItemActions>email update dialog</ItemActions>
      </Item>
      <Separator />
      <Item>
        <ItemContent>
          <ItemTitle>Full Name</ItemTitle>
        </ItemContent>
        <ItemActions> full name update input</ItemActions>
      </Item>
      <Separator />
      <Item>
        <ItemContent>
          <ItemTitle>Username</ItemTitle>
          <ItemDescription>
            Nickname or firstname whatever you want to be called in WorkHolo
          </ItemDescription>
        </ItemContent>
        <ItemActions>username update input</ItemActions>
      </Item>
    </div>
  );
}
