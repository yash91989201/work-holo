import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useModuleConfig,
  useUpdateModuleConfig,
} from "@/hooks/use-module-access";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/manage/settings/"
)({
  component: RouteComponent,
});

type ModuleMode = "disabled" | "org_wide" | "team_based" | "user_based";

function RouteComponent() {
  const { data, isLoading } = useModuleConfig("direct_message");
  const { mutate, isPending } = useUpdateModuleConfig();

  const [mode, setMode] = useState<ModuleMode>("disabled");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setMode((data.mode as ModuleMode) || "disabled");
      setSelectedTeamIds(data.teams?.map((t: any) => t.id) || []);
      setSelectedUserIds(data.users?.map((u: any) => u.id) || []);
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
        onSuccess: () => {
          toast.success("Settings saved");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save settings");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <section className="space-y-6 p-6">
        <div>
          <h1 className="font-semibold text-2xl">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure organization module settings
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Direct Messages</CardTitle>
            <CardDescription>
              Control who can use Direct Messages in this organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="font-semibold text-2xl">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure organization module settings
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Direct Messages</CardTitle>
          <CardDescription>
            Control who can use Direct Messages in this organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            onValueChange={(v) => handleModeChange(v as ModuleMode)}
            value={mode}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="m-disabled" value="disabled" />
              <label htmlFor="m-disabled">Disabled</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="m-org-wide" value="org_wide" />
              <label htmlFor="m-org-wide">Organization Wide</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="m-team-based" value="team_based" />
              <label htmlFor="m-team-based">Team Based</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="m-user-based" value="user_based" />
              <label htmlFor="m-user-based">User Based</label>
            </div>
          </RadioGroup>

          {mode === "team_based" && (
            <Suspense
              fallback={
                <div className="py-4">
                  <Spinner className="h-6 w-6" />
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
                <div className="py-4">
                  <Spinner className="h-6 w-6" />
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
        <CardFooter>
          <Button disabled={isPending} onClick={handleSave}>
            {isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

function TeamPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const {
    data: { teams },
  } = useSuspenseQuery(queryUtils.team.manage.list.queryOptions({}));

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <h3 className="font-medium">Select Teams</h3>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div
              className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted"
              key={team.id}
            >
              <Checkbox
                checked={selectedIds.includes(team.id)}
                id={`team-${team.id}`}
                onCheckedChange={(checked) => {
                  if (checked) onChange([...selectedIds, team.id]);
                  else onChange(selectedIds.filter((id) => id !== team.id));
                }}
              />
              <label
                className="flex flex-1 cursor-pointer items-center space-x-2"
                htmlFor={`team-${team.id}`}
              >
                <div className="font-medium text-sm">{team.name}</div>
                <div className="text-muted-foreground text-xs">
                  ({team.teamMembers.length} members)
                </div>
              </label>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No teams found</p>
        )}
      </div>
    </div>
  );
}

function UserPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const {
    data: { members },
  } = useSuspenseQuery(
    queryUtils.org.member.list.queryOptions({
      input: { page: 1, perPage: 100 },
    })
  );

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <h3 className="font-medium">Select Users</h3>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted"
              key={member.userId}
            >
              <Checkbox
                checked={selectedIds.includes(member.userId)}
                id={`user-${member.userId}`}
                onCheckedChange={(checked) => {
                  if (checked) onChange([...selectedIds, member.userId]);
                  else
                    onChange(selectedIds.filter((id) => id !== member.userId));
                }}
              />
              <label
                className="flex flex-1 cursor-pointer items-center space-x-2"
                htmlFor={`user-${member.userId}`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-medium text-xs">
                  {member.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-sm">
                    {member.user.name}
                  </div>
                  <div className="truncate text-muted-foreground text-xs">
                    {member.user.email}
                  </div>
                </div>
                <Badge className="text-xs capitalize" variant="outline">
                  {member.role}
                </Badge>
              </label>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No users found</p>
        )}
      </div>
    </div>
  );
}
