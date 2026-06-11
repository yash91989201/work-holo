import { IconHash } from "@tabler/icons-react";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";

export function ChannelFeature() {
  return (
    <Card className="opacity-60">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
            <IconHash className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">Channels</CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              Manage topic-based group channels for your organization
            </CardDescription>
          </div>
          <Badge
            className="shrink-0 text-muted-foreground text-xs"
            variant="outline"
          >
            Coming Soon
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs">
          Configuration options for this feature are not yet available.
        </p>
      </CardContent>
    </Card>
  );
}
