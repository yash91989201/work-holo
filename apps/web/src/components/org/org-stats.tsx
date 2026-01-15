import { Building2, Hash, UserCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>;
}

const dummyStats: StatItem[] = [
	{
		title: "Total Teams",
		value: 12,
		icon: Building2,
	},
	{
		title: "Total Members",
		value: 248,
		icon: Users,
	},
	{
		title: "Channels",
		value: 34,
		icon: Hash,
	},
	{
		title: "Punched In Today",
		value: 186,
		icon: UserCheck,
	},
];

function StatCard({ stat }: { stat: StatItem }) {
	const Icon = stat.icon;

	return (
		<Card className="relative overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-muted-foreground text-sm">
					{stat.title}
				</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{stat.value}</div>
			</CardContent>
		</Card>
	);
}

export function OrgStats() {
	return (
		<div className="grid gap-4 border-b py-3 md:grid-cols-2 lg:grid-cols-4">
			{dummyStats.map((stat, index) => (
				<StatCard key={index.toString()} stat={stat} />
			))}
		</div>
	);
}
