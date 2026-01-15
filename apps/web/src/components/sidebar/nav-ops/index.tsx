import { IconBrandTeams, IconBroadcast } from "@tabler/icons-react";
import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import { Calendar, Users } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

export function NavOps() {
	const { slug } = useParams({
		from: "/(authenticated)/org/$slug",
	});

	const { role } = useLoaderData({
		from: "/(authenticated)/org/$slug",
	});

	if (role === "member") {
		return null;
	}

	return (
		<>
			<SidebarSeparator />

			<SidebarGroup>
				<SidebarGroupLabel>Ops</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton tooltip="View Attendance">
								<Link
									params={{ slug }}
									search={{ page: 1 }}
									to="/org/$slug/dashboard/attendance"
								>
									<Calendar />
									<span>Attendance</span>
								</Link>
							</SidebarMenuButton>
							<SidebarMenuButton tooltip="Manage Communication Channels">
								<Link
									params={{ slug }}
									to="/org/$slug/dashboard/communication/channels"
								>
									<IconBroadcast />
									<span>Channels</span>
								</Link>
							</SidebarMenuButton>
							<SidebarMenuButton
								render={
									<Link params={{ slug }} to="/org/$slug/dashboard/teams" />
								}
								tooltip="Teams Management"
							>
								<IconBrandTeams />
								<span>Teams</span>
							</SidebarMenuButton>
							<SidebarMenuButton
								render={
									<Link params={{ slug }} to="/org/$slug/dashboard/members" />
								}
								tooltip="Members Management"
							>
								<Users />
								<span>Members</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	);
}
