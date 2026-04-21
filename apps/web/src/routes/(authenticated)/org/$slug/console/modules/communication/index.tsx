import {
  IconBell,
  IconHash,
  IconLock,
  IconMessage2,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { Checkbox } from "@work-holo/ui/components/checkbox";
import { RadioGroup, RadioGroupItem } from "@work-holo/ui/components/radio-group";
import { Separator } from "@work-holo/ui/components/separator";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import {
  useModuleConfig,
  useUpdateModuleConfig,
} from "@/hooks/use-module-access";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/modules/communication/"
)({
  staticData: { crumb: "Communication" },
  component: RouteComponent,
});

type ModuleMode = "disabled" | "org_wide" | "team_based" | "user_based";

const MODE_OPTIONS: {
  value: ModuleMode;
  label: string;
  description: string;
}[] = [
  {
    value: "disabled",
    label: "Disabled",
    description: "Feature is turned off for all members",
  },
  {
    value: "org_wide",
    label: "Organization Wide",
    description: "All members can use this feature",
  },
  {
    value: "team_based",
    label: "Team Based",
    description: "Only selected teams have access",
  },
  {
    value: "user_based",
    label: "User Based",
    description: "Only selected users have access",
  },
];

function FeatureSectionSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

function DirectMessageFeature() {
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

  if (isLoading) return <FeatureSectionSkeleton />;

  const currentModeLabel =
    MODE_OPTIONS.find((o) => o.value === mode)?.label ?? "Disabled";
  const isActive = mode !== "disabled";

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <IconMessage2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">Direct Messages</CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              Control who can send private messages within this organization
            </CardDescription>
          </div>
          <Badge
            className="shrink-0 text-xs"
            variant={isActive ? "default" : "secondary"}
          >
            {currentModeLabel}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-5 pt-5">
        <div>
          <p className="mb-3 font-medium text-sm">Access Level</p>
          <RadioGroup
            className="space-y-2"
            onValueChange={(v) => handleModeChange(v as ModuleMode)}
            value={mode}
          >
            {MODE_OPTIONS.map((option) => (
              <label
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                htmlFor={`dm-${option.value}`}
                key={option.value}
              >
                <RadioGroupItem
                  className="mt-0.5"
                  id={`dm-${option.value}`}
                  value={option.value}
                />
                <div>
                  <p className="font-medium text-sm leading-none">
                    {option.label}
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        {mode === "team_based" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-4">
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
              <div className="flex items-center justify-center py-4">
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

      <CardFooter className="border-t pt-4">
        <Button disabled={isPending} onClick={handleSave} size="sm">
          {isPending ? <Spinner className="mr-2 h-3.5 w-3.5" /> : null}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}

function ComingSoonFeature({
  icon: Icon,
  iconClassName,
  iconBgClassName,
  title,
  description,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBgClassName: string;
  iconClassName: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Card className="opacity-60">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBgClassName} ${iconClassName}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              {description}
            </CardDescription>
          </div>
          {badge && (
            <Badge
              className="shrink-0 text-muted-foreground text-xs"
              variant="outline"
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <p className="text-muted-foreground text-xs">
          Configuration options for this feature are not yet available.
        </p>
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  return (
    <section className="space-y-4 p-6">
      <div className="grid gap-4">
        <DirectMessageFeature />

        <ComingSoonFeature
          badge="Coming Soon"
          description="Manage topic-based group channels for your organization"
          icon={IconHash}
          iconBgClassName="bg-violet-500/10"
          iconClassName="text-violet-500"
          title="Channels"
        />

        <ComingSoonFeature
          badge="Coming Soon"
          description="Configure how and when members receive communication alerts"
          icon={IconBell}
          iconBgClassName="bg-amber-500/10"
          iconClassName="text-amber-500"
          title="Notifications"
        />

        <ComingSoonFeature
          badge="Coming Soon"
          description="Set policies for how long messages are stored and archived"
          icon={IconLock}
          iconBgClassName="bg-emerald-500/10"
          iconClassName="text-emerald-500"
          title="Message Retention"
        />
      </div>
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
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="flex items-center gap-2 font-medium text-sm">
        Select Teams
        {selectedIds.length > 0 && (
          <Badge className="ml-auto text-xs" variant="secondary">
            {selectedIds.length} selected
          </Badge>
        )}
      </h3>
      <div className="max-h-48 space-y-1 overflow-y-auto">
        {teams.length > 0 ? (
          teams.map((team) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
              htmlFor={`team-${team.id}`}
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
              <span className="flex-1 font-medium text-sm">{team.name}</span>
              <span className="text-muted-foreground text-xs">
                {team.teamMembers.length} members
              </span>
            </label>
          ))
        ) : (
          <p className="py-2 text-muted-foreground text-sm">No teams found</p>
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
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="flex items-center gap-2 font-medium text-sm">
        Select Users
        {selectedIds.length > 0 && (
          <Badge className="ml-auto text-xs" variant="secondary">
            {selectedIds.length} selected
          </Badge>
        )}
      </h3>
      <div className="max-h-48 space-y-1 overflow-y-auto">
        {members.length > 0 ? (
          members.map((member) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
              htmlFor={`user-${member.userId}`}
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
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-xs">
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
              <Badge className="shrink-0 text-xs capitalize" variant="outline">
                {member.role}
              </Badge>
            </label>
          ))
        ) : (
          <p className="py-2 text-muted-foreground text-sm">No users found</p>
        )}
      </div>
    </div>
  );
}
