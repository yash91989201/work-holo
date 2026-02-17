import {
  IconArrowBackUp,
  IconEyeFilled,
  IconSparkles,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const dummyMention = {
  id: "1",
  author: "Meylina Rose",
  avatar: null,
  channel: "#Design-Ops",
  time: "2m ago",
  message:
    "Hey @Markus, I've just uploaded the updated design system components for the new mobile view.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function RecentMentions() {
  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-lg">Recent Mentions</h3>
        <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Channel Activity
        </span>
      </div>

      {/* Mention Card */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage
            alt={dummyMention.author}
            src={dummyMention.avatar ?? undefined}
          />
          <AvatarFallback className="bg-teal-700 text-sm text-white">
            {getInitials(dummyMention.author)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm">{dummyMention.author}</span>
            <span className="text-muted-foreground text-sm">in</span>
            <span className="font-medium text-sm text-violet-600">
              {dummyMention.channel}
            </span>
            <span className="ml-auto shrink-0 text-muted-foreground text-xs">
              {dummyMention.time}
            </span>
          </div>
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
            Hey <span className="font-medium text-violet-600">@Markus</span>,
            I've just uploaded the updated design system components for the new
            mobile view.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        <Button className="gap-2 rounded-full px-4" size="sm" variant="outline">
          <IconEyeFilled className="h-4 w-4" />
          View
        </Button>
        <Button className="gap-2 rounded-full px-4" size="sm" variant="outline">
          <IconArrowBackUp className="h-4 w-4" />
          Reply
        </Button>
        <IconSparkles className="ml-1 h-5 w-5 text-amber-500" />
      </div>
    </Card>
  );
}
