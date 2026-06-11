import { IconMessage2 } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
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
import { Spinner } from "@work-holo/ui/components/spinner";
import { Switch } from "@work-holo/ui/components/switch";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useModuleConfig,
  useUpdateModuleConfig,
} from "@/hooks/use-module-access";
import { FeatureSectionSkeleton } from "./feature-section-skeleton";
import { TeamPicker } from "./team-picker";
import { MODE_OPTIONS, type ModuleMode } from "./types";
import { UserPicker } from "./user-picker";

export function DirectMessageFeature() {
  const { data, isLoading } = useModuleConfig("direct_message");
  const { mutate, isPending } = useUpdateModuleConfig();

  const [mode, setMode] = useState<ModuleMode>("disabled");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setMode((data.mode as ModuleMode) || "disabled");
      setSelectedTeamIds(data.teams?.map((t) => t.id) ?? []);
      setSelectedUserIds(data.users?.map((u) => u.id) ?? []);
    }
  }, [data]);

  const isEnabled = mode !== "disabled";

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setMode("org_wide");
    } else {
      setMode("disabled");
      setSelectedTeamIds([]);
      setSelectedUserIds([]);
    }
  };

  const handleModeChange = (newMode: ModuleMode) => {
    setMode(newMode);
    setSelectedTeamIds([]);
    setSelectedUserIds([]);
  };

  const handleSave = () => {
    mutate(
      {
        module: "direct_message",
        mode,
        teamIds: selectedTeamIds,
        userIds: selectedUserIds,
      },
      {
        onSuccess: () => toast.success("Settings saved"),
        onError: (error) =>
          toast.error(error.message || "Failed to save settings"),
      }
    );
  };

  if (isLoading) return <FeatureSectionSkeleton />;

  const showTeamPicker = mode === "team_based";
  const showUserPicker = mode === "user_based";

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-sm">Feature Access</p>
          <p className="mt-0.5 text-muted-foreground text-xs">
            Enable or disable direct messaging for your organization
          </p>
        </div>
        <ItemGroup>
          <Item variant="outline">
            <ItemMedia className="text-blue-500" variant="icon">
              <IconMessage2 />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Direct Messages</ItemTitle>
              <ItemDescription>
                Allow members to send private messages to each other
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch checked={isEnabled} onCheckedChange={handleToggle} />
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>

      {isEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm">Access Level</p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Choose who in your organization can use direct messages
              </p>
            </div>
            <Select
              items={MODE_OPTIONS}
              onValueChange={(value) => {
                if (value) handleModeChange(value);
              }}
              value={mode}
            >
              <SelectTrigger className="w-44 shrink-0">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Access level</SelectLabel>
                  {MODE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {showTeamPicker && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-6">
                  <Spinner className="h-5 w-5" />
                </div>
              }
            >
              <TeamPicker
                onChange={setSelectedTeamIds}
                selectedIds={selectedTeamIds}
              />
            </Suspense>
          )}

          {showUserPicker && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-6">
                  <Spinner className="h-5 w-5" />
                </div>
              }
            >
              <UserPicker
                onChange={setSelectedUserIds}
                selectedIds={selectedUserIds}
              />
            </Suspense>
          )}
        </div>
      )}

      <Button disabled={isPending} onClick={handleSave} size="sm">
        {isPending ? <Spinner className="mr-2 h-3.5 w-3.5" /> : null}
        Save Changes
      </Button>
    </div>
  );
}
