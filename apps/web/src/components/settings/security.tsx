import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function ChangePasswordForm() {
  return (
    <div className="space-y-3">
      <h3>Change Password</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Default home view</ItemTitle>
            <ItemDescription>
              Which view is opened when you open up Work Holo
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a view</SelectLabel>
                  <SelectItem value="org">Org home</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Display full names</ItemTitle>
            <ItemDescription>
              Show full names instead of short usernames
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch id="airplane-mode" />
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>First day of week</ItemTitle>
            <ItemDescription>
              Used for date pickers and calendars
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a day</SelectLabel>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Convert text emoticons to emoji</ItemTitle>
            <ItemDescription>
              Strings like :) will be converted to 😊
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch id="airplane-mode" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}

export function AccountSessions() {
  return (
    <div className="space-y-3">
      <h3>Account Sessions</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Default home view</ItemTitle>
            <ItemDescription>
              Which view is opened when you open up Work Holo
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a view</SelectLabel>
                  <SelectItem value="org">Org home</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Display full names</ItemTitle>
            <ItemDescription>
              Show full names instead of short usernames
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch id="airplane-mode" />
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>First day of week</ItemTitle>
            <ItemDescription>
              Used for date pickers and calendars
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a day</SelectLabel>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Convert text emoticons to emoji</ItemTitle>
            <ItemDescription>
              Strings like :) will be converted to 😊
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch id="airplane-mode" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}
