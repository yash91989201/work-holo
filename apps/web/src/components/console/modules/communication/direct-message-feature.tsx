import { IconMessage2 } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateModuleConfig } from "@/hooks/use-module-access";
import { queryUtils } from "@/utils/orpc";
import { TeamPicker } from "./team-picker";
import { MODE_OPTIONS, type ModuleMode } from "./types";
import { UserPicker } from "./user-picker";

export function DirectMessageFeature() {
  const { data } = useSuspenseQuery(
    queryUtils.org.moduleConfig.getModuleConfig.queryOptions({
      input: { module: "direct_message" },
    })
  );
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

  const showPicker = mode === "team_based" || mode === "user_based";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Access Level</CardTitle>
          <CardDescription>
            Control who in your organization can send private messages
          </CardDescription>
          <CardAction>
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
          </CardAction>
        </CardHeader>
      </Card>

      {showPicker && (
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "team_based" ? "Select Teams" : "Select Users"}
            </CardTitle>
            <CardDescription>
              {mode === "team_based"
                ? "Choose which teams have access to direct messages"
                : "Choose which users have access to direct messages"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "team_based" && (
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

            {mode === "user_based" && (
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
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button disabled={isPending} onClick={handleSave} size="sm">
          {isPending ? <Spinner className="mr-2 h-3.5 w-3.5" /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function DirectMessageFeatureSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconMessage2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Direct Messages</CardTitle>
          </div>
          <CardDescription>
            Control who in your organization can send private messages
          </CardDescription>
          <CardAction>
            <Skeleton className="h-9 w-44 rounded-md" />
          </CardAction>
        </CardHeader>
      </Card>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}

DirectMessageFeature.Fallback = DirectMessageFeatureSkeleton;
