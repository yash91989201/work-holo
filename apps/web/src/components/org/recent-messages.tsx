import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
// TODO: Create message API
const dummyMessages = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: null,
    time: "13m",
    preview: "The project timeline has been upda...",
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: null,
    time: "45m",
    preview: "I've sent the final assets for the...",
  },
  {
    id: "3",
    name: "Meylina Rose",
    avatar: null,
    time: "1h",
    preview: "Can we jump on a quick sync...",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-teal-700",
    "bg-violet-600",
    "bg-rose-600",
    "bg-blue-600",
    "bg-amber-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function RecentMessages() {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-2xl p-0 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h3 className="font-semibold text-lg">Recent Messages</h3>
        <Badge className="border-0 bg-red-100 font-semibold text-red-600 hover:bg-red-100">
          14 New
        </Badge>
      </div>

      {/* Message List */}
      <div className="flex flex-col divide-y divide-border/50 px-6">
        {dummyMessages.map((msg) => (
          <div className="flex items-start gap-3 py-4 first:pt-0" key={msg.id}>
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage alt={msg.name} src={msg.avatar ?? undefined} />
              <AvatarFallback
                className={`text-white text-xs ${getAvatarColor(msg.name)}`}
              >
                {getInitials(msg.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm">{msg.name}</p>
                <span className="shrink-0 text-muted-foreground text-xs">
                  {msg.time}
                </span>
              </div>
              <p className="mt-0.5 truncate text-muted-foreground text-sm">
                {msg.preview}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto px-6 py-4">
        <button
          className="w-full text-center font-semibold text-sm text-violet-600 uppercase tracking-wider transition-colors hover:text-violet-700"
          type="button"
        >
          View All Messages
        </button>
      </div>
    </Card>
  );
}
