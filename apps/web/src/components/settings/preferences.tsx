import {
  IconDeviceDesktop,
  IconMoonFilled,
  IconRotateClockwise,
  IconSunFilled,
} from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@work-holo/ui/components/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Separator } from "@work-holo/ui/components/separator";
import { Switch } from "@work-holo/ui/components/switch";
import { useTheme } from "next-themes";
import {
  type FontFamily,
  type FontSize,
  type LetterSpacing,
  type Radius,
  type Spacing,
  useThemeStore,
} from "@/stores/theme-store";

const themeOptions = [
  { value: "light", label: "Light", icon: IconSunFilled },
  { value: "dark", label: "Dark", icon: IconMoonFilled },
  { value: "system", label: "System", icon: IconDeviceDesktop },
];

const fontFamilyOptions: {
  value: FontFamily;
  label: string;
  isDefault?: boolean;
}[] = [
  { value: "inter", label: "Inter" },
  { value: "geist", label: "Geist (Default)", isDefault: true },
  { value: "system", label: "System" },
  { value: "mono", label: "Monospace" },
  { value: "roboto", label: "Roboto" },
  { value: "opensans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "poppins", label: "Poppins" },
  { value: "nunito", label: "Nunito" },
  { value: "sfpro", label: "SF Pro (Apple)" },
  { value: "segoeui", label: "Segoe UI (Microsoft)" },
  { value: "ibmplex", label: "IBM Plex Sans" },
  { value: "worksans", label: "Work Sans" },
  { value: "dmsans", label: "DM Sans" },
];

const fontSizeOptions: {
  value: FontSize;
  label: string;
  isDefault?: boolean;
}[] = [
  { value: "xs", label: "Extra Small (12px)" },
  { value: "sm", label: "Small (14px)" },
  { value: "base", label: "Base (16px) - Default", isDefault: true },
  { value: "lg", label: "Large (18px)" },
  { value: "xl", label: "Extra Large (20px)" },
];

const radiusOptions: { value: Radius; label: string; isDefault?: boolean }[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large (Default)", isDefault: true },
  { value: "xl", label: "Extra Large" },
  { value: "2xl", label: "2X Large" },
];

const spacingOptions: { value: Spacing; label: string; isDefault?: boolean }[] =
  [
    { value: "compact", label: "Compact" },
    { value: "cozy", label: "Cozy" },
    { value: "normal", label: "Normal (Default)", isDefault: true },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ];

const letterSpacingOptions: {
  value: LetterSpacing;
  label: string;
  isDefault?: boolean;
}[] = [
  { value: "tighter", label: "Tighter" },
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal (Default)", isDefault: true },
  { value: "wide", label: "Wide" },
  { value: "wider", label: "Wider" },
];

export function General() {
  return (
    <div className="space-y-3">
      <h3>General</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Default home view</ItemTitle>
            <ItemDescription>
              Which view is opened when you open up Work Holo
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={[
                { value: "org", label: "Org home" },
                { value: "attendance", label: "Attendance" },
                { value: "communication", label: "Communication" },
              ]}
            >
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
            <Select
              items={[
                { value: "monday", label: "Monday" },
                { value: "tuesday", label: "Tuesday" },
                { value: "wednesday", label: "Wednesday" },
                { value: "thursday", label: "Thursday" },
                { value: "friday", label: "Friday" },
                { value: "saturday", label: "Saturday" },
                { value: "sunday", label: "Sunday" },
              ]}
            >
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

export function Interface() {
  const { setTheme, theme } = useTheme();

  const {
    fontFamily,
    fontSize,
    radius,
    spacing,
    letterSpacing,
    setFontFamily,
    setFontSize,
    setRadius,
    setSpacing,
    setLetterSpacing,
    resetTheme,
  } = useThemeStore();

  return (
    <div className="space-y-3">
      <h3>Interface and theme</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Theme</ItemTitle>
            <ItemDescription>Customize your interface theme.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={themeOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                setTheme(value);
              }}
              value={theme || "system"}
            >
              <SelectTrigger className="w-32" id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Font family</ItemTitle>
            <ItemDescription>
              Customize the font used across the app
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={fontFamilyOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                setFontFamily(value as FontFamily);
              }}
              value={fontFamily}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Font size</ItemTitle>
            <ItemDescription>
              Customize the font size across the app
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={fontSizeOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                setFontSize(value as FontSize);
              }}
              value={fontSize}
            >
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Letter Spacing</ItemTitle>
            <ItemDescription>
              Set spacing between individual letters
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={letterSpacingOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                setLetterSpacing(value as LetterSpacing);
              }}
              value={letterSpacing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select letter spacing" />
              </SelectTrigger>
              <SelectContent>
                {letterSpacingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Gap</ItemTitle>
            <ItemDescription>Set the gap between ui elements</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={spacingOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                setSpacing(value as Spacing);
              }}
              value={spacing}
            >
              <SelectTrigger id="spacing">
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                {spacingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemContent>
            <ItemTitle>Corner Radius</ItemTitle>
            <ItemDescription>
              Customize the border radius of cards and buttons
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={radiusOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                setRadius(value as Radius);
              }}
              value={radius}
            >
              <SelectTrigger id="radius">
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                {radiusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
        <Separator />
        <Item>
          <ItemHeader>Theme preview</ItemHeader>
          <ItemContent>
            <ItemTitle>A preview of your current theme</ItemTitle>

            <div className="mt-3 space-y-3">
              <div className="space-x-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Sample Section</h4>
                <p className="text-muted-foreground text-sm">
                  This is sample text content to show how your theme preferences
                  affect the appearance of text elements.
                </p>
              </div>
            </div>
          </ItemContent>
        </Item>
        <Separator />

        <Item>
          <ItemContent>
            <ItemTitle>Reset Theme</ItemTitle>
            <ItemDescription>
              Reset all theme customizations to default
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={resetTheme} variant="outline">
              <IconRotateClockwise className="size-3" />
              <span>Reset</span>
            </Button>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}
