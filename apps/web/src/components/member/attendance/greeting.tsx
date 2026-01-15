import { useLoaderData } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useCurrentTime } from "@/hooks/use-current-time";

export function Greeting() {
	const { user } = useAuthedSession();
	const { orgName } = useLoaderData({
		from: "__root__",
	});

	const { formattedTime, timeOfDay, formattedDate } = useCurrentTime();

	return (
		<div className="flex flex-col justify-between gap-3 p-1.5 sm:flex-row sm:items-center">
			<div className="space-y-1">
				<h3 className="font-semibold text-3xl leading-none tracking-tight">
					{timeOfDay.greeting}, {user.name}! 👋
				</h3>
				<p className="text-muted-foreground text-sm">
					Welcome back to {orgName}
				</p>
			</div>

			<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/50 px-4 py-2">
				<div className="rounded-full bg-primary/10 p-2">
					<Clock className="h-5 w-5 text-primary" />
				</div>
				<div className="space-y-1.5 text-right">
					<p className="font-semibold text-lg tabular-nums leading-none">
						{formattedTime}
					</p>
					<p className="font-medium text-muted-foreground text-xs tracking-wider">
						{formattedDate}
					</p>
				</div>
			</div>
		</div>
	);
}
